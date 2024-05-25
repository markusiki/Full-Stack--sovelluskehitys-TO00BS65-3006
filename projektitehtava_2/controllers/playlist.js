const playlistRouter = require('express').Router()
const Song = require('../models/song')
const Artist = require('../models/artist')
const Album = require('../models/album')
const { songExtractor } = require('../utils/middleware')
const {
  getArtist,
  getAlbum,
  deleteFromArtist,
  deleteFromAlbum,
} = require('../utils/query')

playlistRouter.get('/getall', async (req, res) => {
  const playlist = await Song.find({})
    .populate({
      path: 'artist',
      transform: (item) => (item == null ? null : item.name),
    })
    .populate({
      path: 'album',
      transform: (item) => (item == null ? null : item.title),
    })

  if (!playlist) {
    res.status(200).json({ message: 'Playlist is empty' })
    return
  }
  res.json(playlist)
})

playlistRouter.get('/getbyid/:id', async (req, res) => {
  try {
    const id = req.params.id
    const item = await Song.findById(id)
      .populate({
        path: 'artist',
        transform: (item) => (item == null ? null : item.name),
      })
      .populate({
        path: 'album',
        transform: (item) => (item == null ? null : item.title),
      })
    if (!item) {
      res.status(200).json({ message: 'No item matches the id' })
      return
    }
    res.json(item)
  } catch (error) {
    res.status(400).json(error)
  }
})

playlistRouter.get('/getbyname/:songName', async (req, res) => {
  try {
    const songName = req.params.songName
    const item = await Song.find({
      title: { $regex: new RegExp(songName, 'i') },
    })
      .populate({
        path: 'artist',
        transform: (item) => (item == null ? null : item.name),
      })
      .populate({
        path: 'album',
        transform: (item) => (item == null ? null : item.title),
      })
    if (!item) {
      res.status(200).json({ message: 'No item matches the song name' })
      return
    }
    res.json(item)
  } catch (error) {
    res.status(400).json(error)
  }
})

playlistRouter.post('/add', songExtractor, async (req, res) => {
  try {
    const body = req.body

    const artist = await getArtist(body.artist)
    const album = await getAlbum(body.album)

    const newSong = new Song({
      title: body.title,
      artist: artist._id,
      genre: body.genre,
      album: album._id,
      year: body.year,
    })

    await newSong.populate('artist album')

    const savedSong = await newSong.save()
    const albumIncluded = artist.albums.find(
      (alb) => alb._id.toString() === album._id.toString()
    )
    if (!albumIncluded) {
      artist.albums = artist.albums.concat({
        _id: album._id,
        title: body.album,
      })
    }

    artist.songs = artist.songs.concat(savedSong._id)
    await artist.save()
    if (JSON.stringify(album.artist) === '{}') {
      album.artist = { _id: artist._id, name: artist.name }
    }
    album.songs = album.songs.concat(savedSong._id)
    await album.save()

    const response = {
      id: savedSong._id,
      title: savedSong.title,
      artist: savedSong.artist.name,
      album: savedSong.album.title,
      genre: savedSong.genre,
      year: savedSong.year,
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

playlistRouter.put('/update/:id', songExtractor, async (req, res) => {
  const update = req.body
  const songToUpdate = req.songToUpdate
  try {
    if (update.artist && !update.album) {
      res.status(200).json({ message: 'Album missing' })
      return
    }
    if (update.album && !update.artist) {
      res.status(200).json({ message: 'Artist missing' })
      return
    }

    const changeArtist = async (artist) => {
      if (artist._id.toString() !== songToUpdate.artist.toString()) {
        await deleteFromArtist(songToUpdate)
        // Add song to new artist's song list
        artist.songs = artist.songs.concat(songToUpdate._id)
      }
    }

    const changeAlbum = async (album) => {
      if (album._id.toString() !== songToUpdate.album.toString()) {
        await deleteFromAlbum(songToUpdate)
        // Add song to new album's song list
        album.songs = album.songs.concat(songToUpdate._id)
      }
    }
    // Update artist and album
    if (update.artist && update.album) {
      const artist = await getArtist(update.artist)
      const album = await getAlbum(update.album)
      await changeArtist(artist)
      songToUpdate.set('artist', artist._id)
      album.artist = {
        _id: artist._id,
        name: artist.name,
      }
      await album.save()
      await changeAlbum(album)
      songToUpdate.set('album', album._id)
      artist.albums = artist.albums.concat({
        _id: album._id,
        title: album.title,
      })

      await artist.save()
      await album.save()
    }
    //Update all other parameters
    Object.entries(update).forEach(async ([key, value]) => {
      if (key !== 'artist' && key !== 'album') {
        songToUpdate.set(key, value)
      }
    })
    await songToUpdate.populate('artist album')
    const updatedSong = await songToUpdate.save()
    const response = {
      id: updatedSong._id,
      title: updatedSong.title,
      artist: updatedSong.artist.name,
      album: updatedSong.album.title,
      genre: updatedSong.genre,
      year: updatedSong.year,
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

playlistRouter.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const songToDelete = await Song.findById(id)
    if (!songToDelete) {
      res.status(404).json({ message: 'No item matches the given id' })
      return
    }

    await deleteFromArtist(songToDelete)
    await deleteFromAlbum(songToDelete)

    const deletedSong = await songToDelete.deleteOne()
    res.json(deletedSong)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

playlistRouter.delete('/deleteall', async (req, res) => {
  try {
    const deletedSongs = await Song.deleteMany({})
    const deletedArtists = await Artist.deleteMany({})
    const deltedAlbums = await Album.deleteMany({})
    const response = {
      'songs deleted': deletedSongs.deletedCount,
      'artists deleted': deletedArtists.deletedCount,
      'albums deleted': deltedAlbums.deletedCount,
    }
    res.json(response)
  } catch (error) {
    connsole.log(error)
    res.status(400).json(error)
  }
})

module.exports = playlistRouter

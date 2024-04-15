const playlistRouter = require('express').Router()
const Song = require('../models/song')
const Artist = require('../models/artist')
const Album = require('../models/album')

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

playlistRouter.get('/:songName', async (req, res) => {
  const songName = req.params.songName
  const item = await Song.find({ title: { $regex: new RegExp(songName, 'i') } })
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
})

playlistRouter.post('/add', async (req, res) => {
  try {
    const body = req.body

    const song = await Song.findOne({
      title: { $regex: new RegExp(body.title, 'i') },
    })
    const existingArtist = await Artist.findOne({
      name: { $regex: new RegExp(body.artist, 'i') },
    })
    console.log('song', song)
    if (song && existingArtist) {
      res.status(400).json({ message: 'Song already exists' })
      return
    }
    const getArtist = () => {
      if (!existingArtist) {
        const newArtist = Artist.create({ name: body.artist })
        return newArtist
      }
      return existingArtist
    }
    const artist = await getArtist()
    console.log('artist', artist)

    const existingAlbum = await Album.findOne({
      title: { $regex: new RegExp(body.album, 'i') },
    })
    const getAlbum = () => {
      if (!existingAlbum) {
        console.log('newAlbum Created')
        const newAlbum = Album.create({ title: body.album })
        return newAlbum
      }
      console.log('Existing album used')
      return existingAlbum
    }

    const album = await getAlbum()
    console.log('album', album)

    const newSong = new Song({
      title: body.title,
      artist: artist._id,
      genre: body.genre,
      album: album._id,
      year: body.year,
    })

    const savedSong = await newSong.save()
    console.log('savedSong', savedSong)
    if (!artist.albums.includes(album._id)) {
      artist.albums = artist.albums.concat(album._id)
    }
    artist.songs = artist.songs.concat(savedSong._id)
    await artist.save()
    if (!album.artist) {
      album.artist = artist
    }
    album.songs = album.songs.concat(savedSong._id)
    await album.save()

    res.status(200).json(savedSong)
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

playlistRouter.put('/update/:id', async (req, res) => {
  const id = req.params.id
  const update = req.body
  try {
    const songToUpdate = await Song.findById(id).exec()
    console.log(songToUpdate)
    if (!songToUpdate) {
      res.status(200).json({ message: 'No item matches the given id ' })
      return
    }

    if (update.artist && !update.album) {
      res.status(200).json({ message: 'Album missing' })
      return
    }
    if (update.album && !update.artist) {
      res.status(200).json({ message: 'Artist missing' })
      return
    }
    const existingArtist = await Artist.findOne({
      name: { $regex: new RegExp(update.artist, 'i') },
    })
    const existingAlbum = await Album.findOne({
      title: { $regex: new RegExp(update.album, 'i') },
    })

    const getArtist = () => {
      if (!existingArtist) {
        const newArtist = Artist.create({
          name: update.artist,
          songs: [songToUpdate._id],
        })
        return newArtist
      }
      return existingArtist
    }

    const getAlbum = () => {
      if (!existingAlbum) {
        console.log('newAlbum Created')
        const newAlbum = Album.create({
          title: update.album,
          songs: [songToUpdate._id],
        })
        return newAlbum
      }
      console.log('Existing album used')
      return existingAlbum
    }
    const artist = await getArtist()
    console.log('artist', artist)
    const album = await getAlbum()
    console.log('album', album)

    const changeArtist = async () => {
      console.log('existingArtist._id', existingArtist?._id)
      console.log('songToUpdate.artist._id', songToUpdate?.artist._id)
      if (existingArtist?._id !== songToUpdate.artist._id) {
        // Delete song from old artist's song list
        const oldArtist = songToUpdate.artist._id
        const artistToModify = await Artist.findById(oldArtist)
        const songToDelete = artistToModify.songs.indexOf({
          _id: songToUpdate._id,
        })
        artistToModify.songs = artistToModify.songs.splice(songToDelete, 1)
        await artistToModify.save()
      }
    }

    const changeAlbum = async () => {
      if (existingAlbum?._id !== songToUpdate.album._id) {
        // Delete song from old album's song list
        const oldAlbum = songToUpdate.album._id
        const albumToModify = await Album.findById(oldAlbum)
        const songToDelete = albumToModify.songs.indexOf({
          _id: songToUpdate._id,
        })
        albumToModify.songs = albumToModify.songs.splice(songToDelete, 1)
        await albumToModify.save()
      }
    }

    Object.entries(update).forEach(async ([key, value]) => {
      if (key === 'artist') {
        changeArtist()
        songToUpdate.set(key, artist._id)
        return
      }
      if (key === 'album') {
        changeAlbum()
        songToUpdate.set(key, album._id)
      } else {
        console.log(key, value)
        songToUpdate.set(key, value)
      }
    })

    const updatedSong = await songToUpdate.save()
    res.json(updatedSong)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = playlistRouter

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
    console.log('album._id', album._id)
    console.log(artist.albums[0])
    const albumIncluded = artist.albums.find(
      (alb) => alb._id.toString() === album._id.toString()
    )
    console.log('albumIncluded', albumIncluded)
    if (!albumIncluded) {
      console.log('not included')
      artist.albums = artist.albums.concat({
        _id: album._id,
        title: body.album,
      })
    }

    artist.songs = artist.songs.concat(savedSong._id)
    await artist.save()
    console.log('JSON.stringify(album.artist)', JSON.stringify(album.artist))
    if (JSON.stringify(album.artist) === '{}') {
      console.log('no artist')
      album.artist = { _id: artist._id, name: artist.name }
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
      res.status(200).json({ message: 'No item matches the given id' })
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
      if (artist._id.toString() !== songToUpdate.artist._id.toString()) {
        // Delete song from old artist's song list
        const artistToDeleteFrom = await Artist.findById(
          songToUpdate.artist._id
        )
        for (const [index, song] of artistToDeleteFrom.songs.entries()) {
          if (song._id.toString() === songToUpdate._id.toString()) {
            artistToDeleteFrom.songs = artistToDeleteFrom.songs.toSpliced(
              index,
              1
            )
            await artistToDeleteFrom.save()
            break
          }
        }
        // Add song to new artist's song list
        artist.songs = artist.songs.concat(songToUpdate._id)
        await artist.save()
      }
    }

    const changeAlbum = async () => {
      if (album._id.toString() !== songToUpdate.album._id.toString()) {
        // Delete song from old album's song list
        const albumToDeleteFrom = await Album.findById(songToUpdate.album._id)
        for (const [index, song] of albumToDeleteFrom.songs.entries()) {
          if (song._id.toString() === songToUpdate._id.toString()) {
            albumToDeleteFrom.songs = albumToDeleteFrom.songs.toSpliced(
              index,
              1
            )
            await albumToDeleteFrom.save()
            break
          }
        }
        // Add song to new album's song list
        album.songs = album.songs.concat(songToUpdate._id)
        await album.save()
      }
    }

    Object.entries(update).forEach(async ([key, value]) => {
      if (key === 'artist') {
        changeArtist()
        songToUpdate.set(key, artist._id)
        album.artist = {
          _id: artist._id,
          name: artist.name,
        }
        await album.save()
        return
      }
      if (key === 'album') {
        changeAlbum()
        songToUpdate.set(key, album._id)
        artist.albums = artist.albums.concat({
          _id: album._id,
          title: album.title,
        })

        await artist.save()
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

playlistRouter.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const songToDelete = await Song.findById(id)
    if (!songToDelete) {
      res.status(404).json({ message: 'No item matches the given id' })
      return
    }
    const deleteFromArtist = async () => {
      const artistToDeleteFrom = await Artist.findById(songToDelete.artist)
      for (const [index, song] of artistToDeleteFrom.songs.entries()) {
        if (song._id.toString() === songToDelete._id.toString()) {
          artistToDeleteFrom.songs = artistToDeleteFrom.songs.toSpliced(
            index,
            1
          )
          await artistToDeleteFrom.save()
          break
        }
      }
    }

    const deleteFromAlbum = async () => {
      const albumToDeleteFrom = await Album.findById(songToDelete.album)
      for (const [index, song] of albumToDeleteFrom.songs.entries()) {
        if (song._id.toString() === songToDelete._id.toString()) {
          albumToDeleteFrom.songs = albumToDeleteFrom.songs.toSpliced(index, 1)
          await albumToDeleteFrom.save()
          break
        }
      }
    }

    deleteFromArtist()
    deleteFromAlbum()
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

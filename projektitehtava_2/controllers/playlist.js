const playlistRouter = require('express').Router()
const Song = require('../models/song')
const Artist = require('../models/artist')
const Album = require('../models/album')

playlistRouter.get('/getall', async (req, res) => {
  const playlist = await Song.find({})
    .populate('album', { title: 1, date: 1 })
    .populate('artist', { name: 1 })

  if (!playlist) {
    res.status(200).json({ message: 'Playlist is empty' })
    return
  }
  res.json(playlist)
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

module.exports = playlistRouter

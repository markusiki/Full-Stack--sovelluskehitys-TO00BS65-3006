const playlistRouter = require('express').Router()
const Song = require('../models/song')
const Artist = require('../models/artist')
const Album = require('../models/album')

playlistRouter.get('/getall', async (req, res) => {
  const playlist = await Song.find({})
    .populate('album', { title: 1, date: 1 })
    .populate('artist', { name: 1 })
  res.json(playlist)
})

playlistRouter.post('/add', async (req, res) => {
  try {
    const body = req.body

    const song = await Song.findOne({ title: body.title })
    console.log('song', song)
    if (song) {
      res.status(400).json({ message: 'Song already exists' })
      return
    }

    const artist = await Artist.findOneAndUpdate({
      conditions: { name: body.artist },
      options: { new: true, upsert: true },
    })
    console.log(artist)
    const album = await Album.findOneAndUpdate({
      conditions: { title: body.album },
      options: { new: true, upsert: true },
    })
    console.log(album)

    const newSong = new Song({
      title: body.title,
      artist: artist,
      genre: body.genre,
      album: album,
      year: body.year,
    })

    const savedSong = newSong.save()
    if (!artist.albums.includes(body.album)) {
      artist.albums.concat(album._id)
    }
    artist.songs.concat(savedSong._id)
    await artist.save()
    if (!album.artist) {
      album.artist = body.artist
    }

    res.status(200).json(savedSong.toJSON())
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

module.exports = playlistRouter

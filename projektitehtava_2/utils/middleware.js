const Artist = require('../models/artist')
const Song = require('../models/song')

const songExtractor = async (req, res, next) => {
  let songToUpdate
  if (req.url.startsWith('/update')) {
    console.log(req.url)
    songToUpdate = await Song.findById(req.params.id)
    console.log('songToUpdate: ', songToUpdate)
    if (!songToUpdate) {
      return res.status(404).json({ message: 'No item matches the given id' })
    }
  }
  const existingArtist = await Artist.findOne({
    name: req.body.artist,
  }).collation({ locale: 'en', strength: 2 })

  const getExistingSong = async () => {
    const existingSongs = await existingArtist.populate('songs')
    const existingSong = existingSongs.songs.find(
      (song) => song.title.toLowerCase() === req.body.title.toLowerCase()
    )

    return existingSong
  }
  console.log('existingArtist: ', existingArtist)
  console.log('songToUpdate.artist: ', songToUpdate?.artist)

  if (existingArtist && existingArtist._id !== songToUpdate?.artist) {
    const existingSong = await getExistingSong()
    console.log('existingSong: ', existingSong)
    console.log('songToUpdate.title: ', songToUpdate?.title)
    if (existingSong && existingSong.title !== songToUpdate?.title) {
      return res.status(400).json({ message: 'Song already exists' })
    }
  }
  req.songToUpdate = songToUpdate
  next()
}

module.exports = { songExtractor }

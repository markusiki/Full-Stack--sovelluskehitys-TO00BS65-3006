const Artist = require('../models/artist')

const songExtractor = async (req, res, next) => {
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

  if (existingArtist) {
    const existingSong = await getExistingSong()
    if (existingSong) {
      return res.status(400).json({ message: 'Song already exists' })
    }
  }

  next()
}

module.exports = { songExtractor }

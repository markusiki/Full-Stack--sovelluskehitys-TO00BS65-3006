const Artist = require('../models/artist')
const Album = require('../models/album')

const getArtist = async (artist) => {
  const existingArtist = await Artist.findOne({
    name: artist,
  }).collation({ locale: 'en', strength: 2 })

  if (!existingArtist) {
    const newArtist = Artist.create({
      name: artist,
    })
    return newArtist
  }
  return existingArtist
}

const getAlbum = async (album) => {
  const existingAlbum = await Album.findOne({
    title: album,
  }).collation({ locale: 'en', strength: 2 })

  if (!existingAlbum) {
    const newAlbum = Album.create({
      title: album,
    })
    return newAlbum
  }
  return existingAlbum
}

module.exports = { getArtist, getAlbum }

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
    console.log('newArtist Created')
    return newArtist
  }
  console.log('Existing artist used')
  return existingArtist
}

const getAlbum = async (album) => {
  const existingAlbum = await Album.findOne({
    title: album,
  }).collation({ locale: 'en', strength: 2 })

  if (!existingAlbum) {
    console.log('newAlbum Created')
    const newAlbum = Album.create({
      title: album,
    })
    return newAlbum
  }
  console.log('Existing album used')
  return existingAlbum
}

module.exports = { getArtist, getAlbum }

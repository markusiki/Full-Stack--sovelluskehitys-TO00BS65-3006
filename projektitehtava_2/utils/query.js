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

const deleteFromArtist = async (songToDelete) => {
  const artistToDeleteFrom = await Artist.findById(songToDelete.artist)
  for (const [index, song] of artistToDeleteFrom.songs.entries()) {
    if (song._id.toString() === songToDelete._id.toString()) {
      artistToDeleteFrom.songs = artistToDeleteFrom.songs.toSpliced(index, 1)
      await artistToDeleteFrom.save()
      break
    }
  }
}

const deleteFromAlbum = async (songToDelete) => {
  const albumToDeleteFrom = await Album.findById(songToDelete.album)
  for (const [index, song] of albumToDeleteFrom.songs.entries()) {
    if (song._id.toString() === songToDelete._id.toString()) {
      albumToDeleteFrom.songs = albumToDeleteFrom.songs.toSpliced(index, 1)
      await albumToDeleteFrom.save()
      break
    }
  }
}

module.exports = { getArtist, getAlbum, deleteFromArtist, deleteFromAlbum }

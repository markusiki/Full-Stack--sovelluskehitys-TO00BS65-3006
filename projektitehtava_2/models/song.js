const mongoose = require('mongoose')
const artist = require('./artist')
const album = require('./album')

const songSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  genre: {
    type: String,
    lowercase: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  },

  year: Number,
})

songSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
  virtuals: true,
})

module.exports = mongoose.model('Song', songSchema)

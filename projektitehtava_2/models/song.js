const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
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
})

module.exports = mongoose.model('Song', songSchema)

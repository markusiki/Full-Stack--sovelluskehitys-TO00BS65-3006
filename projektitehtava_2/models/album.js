const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
    name: {
      type: String,
    },
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
})

albumSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Album', albumSchema)

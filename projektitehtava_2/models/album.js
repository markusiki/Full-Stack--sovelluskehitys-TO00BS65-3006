const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
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

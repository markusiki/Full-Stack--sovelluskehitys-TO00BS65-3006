const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
  albums: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
      },
      title: {
        type: String,
      },
    },
  ],
})

artistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Artist', artistSchema)

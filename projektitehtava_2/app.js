const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const playlistRouter = require('./controllers/playlist')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error.message}`)
  })

app.use(express.json())
app.use('/api', playlistRouter)

module.exports = app

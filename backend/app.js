require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const MONGO_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`

const PORT = process.env.PORT || 8080;

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
  })

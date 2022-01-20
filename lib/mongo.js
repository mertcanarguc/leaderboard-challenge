require('dotenv').config()
const mongoose = require('mongoose')

const con = mongoose.createConnection("mongodb://localhost:27017/challence")

module.exports = {
    con
}
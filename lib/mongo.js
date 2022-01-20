const mongoose = require('mongoose')

const con = mongoose.createConnection(process.env.MONGO_URI)

module.exports = {
    con
}
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { con } = require('../lib/mongo')

const Pool = new Schema({
    coin: { type: Number, default: 0 },
    weekNumber: { type: Number, default: 0, required: true },
    year: { type: Number, default: 0, unique: true, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = con.model("Pool", Pool)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { con } = require('../lib/mongo')

const User = new Schema({
    username: { type: String, unique: [true, "'username' tekrar kayıt edilemez."], required: [true, "'username' bilgisi gereklidir."] },
    age: { type: Number, required: true },
    last_day: { type: Number, default: 0 },
    live_score: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    password: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = con.model('User', User)
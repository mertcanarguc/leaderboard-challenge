const socketio = require('socket.io');
const io = socketio()
const User = require('../models/user')
const redis = require('ioredis')
const redisClient = redis.createClient()
const socketApi = {}

socketApi.io = io;

let temp = 0
let userid = null

io.on('connection', (socket) => {
    socket.on('skorGonder', async(data) => {
        const user = await User.findById({ '_id': data.id })
        userid = user._id
        redisClient.on('connect', () => {
            console.log("connected")
        })

        redisClient.on('error', () => {
            console.log(error)
        })

        temp += data.data

        const key = user._id // key
        redisClient.set(key, Number(user.live_score) + Number(temp)) //databasedeki veri eklendi

        redisClient.get(key, (err, result) => {
            if (!err) {
                socket.emit('sonuc', { data: result })
            }
        })
    })

    socket.on('disconnect', async() => {
        const user = User.findById({ '_id': userid })
        redisClient.get(userid, (err, data) => {
            user.update({
                live_score: data
            }, (err, data) => {
                if (err) {
                    throw err
                }
                temp = 0
            })
        })

    })

})



module.exports = socketApi;
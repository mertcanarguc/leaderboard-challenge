const Pool = require('../models/pool')
const moment = require('moment')

module.exports = {
    CreateNewPool() {
        new Pool({
            weekNumber: moment().week() - 1,
            year: moment().year()
        }).save((err, data) => {
            if (err) {
                console.log(false)
            } else {
                console.log(true)
            }
        })
    }
}
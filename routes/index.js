const express = require('express');
const router = express.Router();
const LeaderBoard = require('../controllers/LeaderBoardController')
const middleware = require('../middleware/auth')


router.get('/', async(req, res, next) => { res.render('index') })
router.post('/first-hundred', LeaderBoard.first_hundred)


module.exports = router;
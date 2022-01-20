const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')

router.post('/login', UserController.login) // Gamer login işlemleri
router.post('/register', UserController.register) // Gamer register işlemleri
router.post('/create_fake_user', UserController.fake_user) // Test için fake gamers ekleyebilirsiniz.
router.get('/get_test_user', UserController.get_test_user) // Test için fake gamers ekleyebilirsiniz.

module.exports = router;
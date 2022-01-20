const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const faker = require('@faker-js/faker')
const randomix = require('randomix')

exports.register = async(req, res, next) => {
    try {
        const { username, password, age } = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).json({
                status: false,
                message: 'All input is required for create user.'
            });
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ "username": username });

        if (oldUser) {
            return res.status(409).json({
                status: false,
                message: 'User Already Exist. Please Login.'
            });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            username: username,
            age: age,
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({
                user_id: user._id,
                username
            },
            process.env.TOKEN_KEY, {
                expiresIn: '2h',
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json({
            success: true,
            user: { id: user._id, username: username },
            token: user.token
        });
    } catch (err) {
        console.log(err);
    }
}

exports.login = async(req, res, next) => {
    // Our login logic starts here
    try {
        // Get user input
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).json({
                status: false,
                message: 'All input is required'
            });
        }
        // Validate if user exist in our database
        const user = await User.findOne({ "username": username });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, username },
                process.env.TOKEN_KEY, {
                    expiresIn: '2h',
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json({
                id: user._id,
                username: user.username,
                token: user.token
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Invalid Credentials'
            });
        }

    } catch (err) {
        console.log(err);
    }
}

exports.fake_user = async(req, res, next) => {
    for (let index = 0; index < 500; index++) {
        const username = faker.internet.userName()
        encryptedPassword = await bcrypt.hash(username, 10);
        const last = randomix.generate({ length: 5, charset: 'numeric' })
        const live = randomix.generate({ length: 4, charset: 'numeric' })
        User.create({
            username: username,
            age: randomix.generate({ length: 2, charset: 'numeric' }),
            last_day: Number(last),
            live_score: Number(last) + Number(live),
            password: encryptedPassword
        }, (err, data) => {
            if (!err) {
                console.log(".")
            } else {
                console.log(err)
            }
        });
    }
}

exports.get_test_user = async(req, res, next) => {
    let testuser = await User.find({}).limit(1).sort({ "live_score": -1 })

    res.json({ data: testuser[0].username })
}
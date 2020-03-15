const express = require('express')
const router = express.Router();
const config = require('../config/database');
const User = require('../models/users');
const UserSession = require('../models/userSession')
const multer = require('multer');
const bcrypt = require('bcryptjs');
var path = require('path');
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'local_storage/profile_Images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('profileImage')

//User registration
router.post('/register', function (req, res) {
    console.log(req.body)
    // upload(req, res, (err) => {
    //     var fullPath = req.file.originalname;

    const newUser = new User({
        fullName: req.body.fullName,
        password: req.body.password,
        userId: req.body.userId,
        userType: req.body.userType,
        birthday: req.body.birthday,
        email: req.body.email,
        nic: req.body.nic,
        mobileOne: req.body.mobileOne,
        mobileTwo: req.body.mobileTwo,
        epf: req.body.epf,
        etf: req.body.etf,
        address: req.body.address,
        other: req.body.other,
        // path: fullPath
    })
    User.findOne({ userId: newUser.userId }, function (error, user) {
        if (error) throw error
        if (user != null) {
            if (user.userId == newUser.userId) {
                res.json({ state: false, msg: "This userId already in use..!" })
            }
        }
        else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    newUser.password = hash;

                    if (err) {
                        throw err;
                    }
                    else {
                        newUser.save()
                            .then(req => {
                                res.json({ state: true, msg: " User Registered Successfully..!" })
                            })
                            .catch(err => {
                                console.log(err);
                                res.json({ state: false, msg: "User Registration Unsuccessfull..!" })
                            })
                    }
                })
            })
        }
    })
    // })
})

//User Login
router.post('/account/login', function (req, res) {
    const userId = req.body.userId
    const password = req.body.password
    console.log(req.body);

    User.findOne({ userId: userId }, function (err, user) {
        if (err) throw err;

        if (user == null) {
            res.json({ state: false, msg: "Invalid User ID..!" })
        }
        else {
            bcrypt.compare(password, user.password, function (err, match) {
                if (err) throw err;

                if (match) {
                    const userSession = new UserSession();
                    userSession.userId = user._id;

                    userSession.save(function (err, doc) {
                        if (err) {
                            console.log(err)
                            return res.send({ state: false, msg: "Error : Server error" })
                        }
                        else {
                            return res.send({ state: true, msg: " Valid Signin ..!", token: doc._id })
                        }
                    })
                }
                else {
                    res.json({ state: false, msg: "Password Incorrect..!" })
                }
            })
        }
    })
})

//account verify
router.get('/account/verify', function (req, res) {
    const { query } = req;
    const { token } = query;

    UserSession.find({ _id: token, isDeleted: false },
        (err, sessions) => {
            if (err) {
                return res.send({ state: false, msg: 'Error , Server Error' })
            }
            if (sessions.length != 1) {
                return res.send({ state: false, msg: 'Error , Invalid' })
            }
            else {
                return res.send({ state: true, msg: 'Successful..!' })
            }
        })
}) 

//account logout
router.get('/account/logout', function (req, res) {
    const { query } = req;
    const { token } = query;
    UserSession.findOneAndUpdate({ _id: token, isDeleted: false },
        {
            $set: { isDeleted: true }
        },
        null,
        (err, sessions) => { 
            if (err) {
                return res.send({ state: false, msg: 'Error , Server Error' })
            }  
            else {
                return res.send({ state: true, msg: 'Successful..!' })
            }
        })
})

//Profile Image visible
router.get("/profileImage/:filename", function (req, res) {
    const filename = req.params.filename
    res.sendFile(path.join(__dirname, '../local_storage/profile_Images/' + filename))
})



module.exports = router
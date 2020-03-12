const express = require('express')
const router = express.Router();
const config = require('../config/database');
const User = require('../models/users');
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

    //     const newUser = new User({
    //         fullName: req.body.fullName,
    //         password: req.body.password,
    //         userId: req.body.userId,
    //         userType: req.body.userType,
    //         birthday: req.body.birthday,
    //         email: req.body.email,
    //         nic: req.body.nic,
    //         mobileOne: req.body.mobileOne,
    //         mobileTwo: req.body.mobileTwo,
    //         epf: req.body.epf,
    //         etf: req.body.etf,
    //         address: req.body.address,
    //         other: req.body.other,
    //         path: fullPath
    //     })
    //     User.findOne({userId: newUser.userId}, function(error, user){
    //         if(error) throw error
    //         if(user != null){
    //             if(user.userId == newUser.userId){
    //                 res.json({state: false, msg: "This userId already in use..!"}) 
    //             }
    //         }
    //         else{
    //             bcrypt.genSalt(10, function (err, salt) {
    //                 bcrypt.hash(newUser.password, salt, function (err, hash) {
    //                     newUser.password = hash;

    //                     if (err) {
    //                         throw err;
    //                     }
    //                     else {
    //                         newUser.save()
    //                             .then(req => {
    //                                 res.json({ state: true, msg: "User Registered Successfully..!" })
    //                             })
    //                             .catch(err => {
    //                                 console.log(err);
    //                                 res.json({ state: false, msg: "User Registration Unsuccessfull..!" })
    //                             })
    //                     }
    //                 })
    //             })
    //         }
    //     })
    // })
})

//User Login
router.post('/login', function (req, res) {
    const userId = req.body.userId
    const password = req.body.password
    console.log(req.body);

    User.findOne({userId : userId}, function(err, user){
        if(err) throw err;

        if(user == null){
            res.json({state : false, msg : "Invalid User ID..!"})
        }
        else{
            bcrypt.compare(password, user.password, function(err,match){
                if (err) throw err;

                if(match){
                    res.json({state : true, msg : "Password Correct..!"})
                }
                else{
                    res.json({state : false, msg : "Password Incorrect..!"})
                }
            })
        }
    })
})

//Profile Image visible
router.get("/profileImage/:filename", function (req, res) {
    const filename = req.params.filename
    res.sendFile(path.join(__dirname, '../local_storage/profile_Images/' + filename))
})



module.exports = router
const express = require('express')
const router = express.Router();
const config = require('../config/database');
const User = require('../models/users');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'local_storage/profile_Images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('profile-Image')


// const storage = multer.diskStorage({
//    destination: "./public/uploads/",
//    filename: function(req, file, cb){
//       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
//    }
// });

// const upload = multer({
//    storage: storage,
//    limits:{fileSize: 1000000},
// }).single("myImage");

//User registration
router.post('/register', async function (req, res) {

    //checking if the userId is already in the database
    const userIdExist = await User.findOne({ userId: req.body.userId })
    if (userIdExist) return res.status(400).send({ state: false, msg: "This userId already in use..!" })

    console.log(req.body)
    // upload(req, res, (err) => {
    //     var fullPath = req.file.originalname;

    //     //create a new user
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
    //         // path: req.body.path
    //         path: fullPath
    //     })

    //     bcrypt.genSalt(10, async function (err, salt) {
    //         await bcrypt.hash(newUser.password, salt, function (err, hash) {
    //             newUser.password = hash;

    //             if (err) {
    //                 throw err;
    //             }
    //             else {
    //                 newUser.save()
    //                     .then(req => {
    //                         res.json({ state: true, msg: " User Registered Successfully..!" })
    //                     })
    //                     .catch(err => {
    //                         console.log(err);
    //                         res.json({ state: false, msg: "User Registration Unsuccessfull..!" })
    //                     })
    //             }
    //         })
    //     })
    // })
})

//User Login
router.post('/account/login', async function (req, res) {
    const password = req.body.password

    //checking if the userId is already in the database
    const user = await User.findOne({ userId: req.body.userId })
    if (!user) return res.status(400).send({ state: false, msg: "This is not valid userId!" })

    bcrypt.compare(password, user.password, function (err, match) {
        if (err) throw err;

        if (match) {
            if (err) {
                console.log(err)
                return res.send({ state: false, msg: "Error : Server error" })
            }
            else {
                const token = jwt.sign({ _id: user._id }, config.secret)
                res.header('auth-token', token).send({ state: true, msg: " Sign in Successfully..!", token: token })
            }
        }
        else {
            res.json({ state: false, msg: "Password Incorrect..!" })
        }
    })

})

router.get('/verify', verify, function (req, res, next) {
    res.send({ loginState: true, msg: 'Login Successful..!' })
})

//Profile Image visible
router.get("/profileImage/:filename", function (req, res) {
    const filename = req.params.filename
    res.sendFile(path.join(__dirname, '../local_storage/profile_Images/' + filename))
})

// router.post('/upload', function (req, res) {
//     upload(req, res, function (err) {
//         iconsole.log("Request ---", req.body);
//         console.log("Request file ---", req.file);//Here you get file.
//         /*Now do where ever you want to do*/
//         if(!err) {
//             return res.send(200).end();
//         }
//     })
// })


module.exports = router
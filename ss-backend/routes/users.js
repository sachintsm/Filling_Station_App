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
        cb(null, 'local_storage/profile_Images/')    //user profile pictures saving destination folder
    },
    filename: function (req, file, cb) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours()
        cb(null, time + '-' + file.originalname)   //set the file neme
    }
});

const upload = multer({ storage: storage }).single('profileImage');

//User registration
router.post('/register', function (req, res) {
    upload(req, res, (err) = async () => {
        //check userId 
        if (req.body.userId == '') return res.json({ state: false, msg: "User Id Empty..!" })

        //check password empty
        if (req.body.password == '') return res.json({ state: false, msg: "Password Empty..!" })
        console.log(req.body.userId);

        //checking if the userId is already in the database
        const userIdExist = await User.findOne({ userId: req.body.userId })
        if (userIdExist) return res.json({ state: false, msg: "This userId already in use..!" })

        //check file empty
        if (req.file == null) return res.json({ state: false, msg: "Profile Image is empty..!" })

        let ts = Date.now();
        let date_ob = new Date(ts);
        const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours()

        var fullPath = time + '-' + req.file.originalname;

        //create a new user
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
            path: fullPath,
            activeState : true,
        })

        bcrypt.genSalt(10, async function (err, salt) {
            await bcrypt.hash(newUser.password, salt, function (err, hash) {
                newUser.password = hash;

                if (err) {
                    throw err;
                }
                else {
                    newUser.save()
                        .then(result => {
                            res.json({ state: true, msg: " User Registered Successfully..!" })
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({ state: false, msg: "User Registration Unsuccessfull..!" })
                        })
                }
            })
        })
    })
})

//get all users details
router.get('/get', function (req, res) {

    User.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//get data for a particular id
router.get('/get/:id', function (req, res) {
    let id = req.params.id;
    User.find({ userId: id })
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
});

//update user data
router.post('/updateuser/:userId', async function (req, res) {
    console.log(req.body);
    const userId = req.params.userId;

    const userType = req.body.userType;
    const birthday = req.body.birthday;
    const email = req.body.email;
    const epf = req.body.epf;
    const etf = req.body.etf;
    const address = req.body.address;
    const other = req.body.other;

    await User
        .update({ userId: userId },
            {
                $set: {
                    userType: userType,
                    birthday: birthday,
                    email: email,
                    epf: epf,
                    etf: etf,
                    address: address,
                    other: other
                }
            })    //update user data with correspond to userid
        .exec()
        .then(data => {
            console.log("Data Update Success..!")
            res.json({ state: true, msg: "Data Update Success..!" });

        })
        .catch(error => {
            console.log("Data Updating Unsuccessfull..!")
            res.json({ state: false, msg: "Data Updating Unsuccessfull..!" });
        })
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
                res.header('auth-token', token).send({ state: true, msg: " Sign in Successfully..!", token: token, data: user })
            }
        }
        else {
            res.json({ state: false, msg: "Password Incorrect..!" })
        }
    })

})

//verify user login token
router.get('/verify', verify, function (req, res, next) {
    res.send({ loginState: true, msg: 'Login Successful..!' })
})

//Profile Image visible
router.get("/profileImage/:filename", function (req, res) {
    const filename = req.params.filename
    res.sendFile(path.join(__dirname, '../local_storage/profile_Images/' + filename))
})

//get active pumpers user id and full name
router.get('/getPumpers', function (req, res) {
    User
        .find({ userType: 'Pumper' , activeState : true })
        .select('userId fullName')
        .exec()
        .then(data => {
            res.json({ state: true, msg: "Data Trnsfer Success..!", data: data });
        })
        .catch(err => {
            res.json({ state: false, msg: 'Data retrive Unsuccess .. !' })
        })
})

//get pumer name to pumpers daily calculation 
router.get('/getPumperName/:id', async function (req, res) {
    //checking if the userId is already in the database
    const userIdExist = await User.findOne({ userId: req.params.id })
    if (!userIdExist) return res.json({ state: false, msg: "This userId does not exists..!" })

    User
        .find({ userId: req.params.id })
        .select('fullName')
        .exec()
        .then(data => {
            res.json({ state: true, msg: "Data Trnsfer Success..!", data: data });
        })
        .catch(err => {
            res.json({ state: false, msg: 'Data retrive Unsuccess .. !' })
        })
})

//check userId available of not
router.get('/checkUserId/:id', async function (req, res) {
    //checking if the userId is already in the database
    const userIdExist = await User.findOne({ userId: req.params.id })
    if (!userIdExist) return res.json({ state: false, msg: "This userId does not exists..!" })
    else return res.json({ state: true})
})

module.exports = router
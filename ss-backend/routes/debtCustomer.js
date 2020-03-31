const express = require('express')
const router = express.Router();
const config = require('../config/database');
const Debtor = require('../models/debtCustomer');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');



//User registration
router.post('/register', function (req, res) {
    
        //check fullName 
        if (req.body.fullName == '') return res.json({ state: false, msg: "Name Empty..!" })
        if (req.body.debtorId == '') return res.json({ state: false, msg: "Debtor ID Empty..!" })
        console.log(req.body.debtorId);
        if (req.body.damount == '') return res.json({ state: false, msg: "Amount Empty..!" })
        if (req.body.nic == '') return res.json({ state: false, msg: "NIC Empty..!" })
        if (req.body.mobile == '') return res.json({ state: false, msg: "Mobile Number Empty..!" })
        

        //checking if the userId is already in the database
        // const debtorIdExist = await Debtor.findOne({ debtorId: req.body.debtorId })
        // if (debtorIdExist) return res.json({ state: false, msg: "This debtorId already in use..!" })

        

      

        //create a new user
        const newDebtor = new Debtor({
            fullName: req.body.fullName,
            debtorId: req.body.debtorId,
            damount: req.body.damount,
            nic: req.body.nic,
            mobile: req.body.mobile,
            fax: req.body.fax,
            address: req.body.address,
            other: req.body.other,
        })

        newDebtor.save()
        .then(req => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })

  
 
})

//get data from backend

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
router.get('/get/debtor/:id', function (req, res) {

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

//update notification 
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
                res.header('auth-token', token).send({ state: true, msg: " Sign in Successfully..!", token: token,data :user })
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

module.exports = router
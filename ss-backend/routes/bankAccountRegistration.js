const express = require('express')
const router = express.Router();
const config = require('../config/database');
const BankAccounts = require('../models/bankAccountRegistration');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {
    //checking if the userId is already in the database
    const userIdExist = await BankAccounts.findOne({ accountNumber: req.body.accountNumber })
    if (userIdExist) return res.json({ state: false, msg: "This Account Number already exists..!" })

    const data = new BankAccounts({
        bankName: req.body.bankName,
        accountName:req.body.accountName,
        accountNumber: req.body.accountNumber,
    })

    console.log(data);
    data.save()
        .then(result => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })
})

router.get('/getAccountNames', function (req, res){
    BankAccounts
        .find()
        .exec()
        .then(result => {
            res.json({state: true, msg: "Data Transfer Success..!", data : result})
        })
        .catch(err => {
            res.json({state: false, msg: "Data Transfer Error..!"})
        })
})
module.exports = router
const express = require('express')
const router = express.Router();
const config = require('../config/database');
const FinalLocker = require('../models/finalLocker');
const verify = require('../authentication');


//? add today locker final balance
router.post('/add',verify, (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)
    var amount = parseFloat(req.body.amount).toFixed(2)
    
    const data = new FinalLocker({
        amount : amount,
        date: date,
        timeStamp : dt/1000
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

//? get yesterday locker balance 
router.get('/yesterday' , (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()-1);

    FinalLocker
        .find({date : date})
        .select('amount')
        .exec()
        .then(data => {
            res.json({ state: true, msg: " Data Transfer Successfully..!" , data : data})
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Transfer Unsuccessfull..!" })
        })
})

//? get today locker balance
router.get('/today' , (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    FinalLocker
        .find({date : date})
        .select('amount')
        .exec()
        .then(data => {
            res.json({ state: true, msg: " Data Transfer Successfully..!" , data : data})
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Transfer Unsuccessfull..!" })
        })
})

//? delete today locker balnce
router.delete('/delete', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    FinalLocker
        .remove({ date: date })
        .then(data => {
            res.send({ state: true, msg: "Successfully Deleted..!"})
        })
        .catch(err => {
            res.send({ state: false, msg: "Recored does not delete..!" })
        })
})

//? get history  final locker data
router.get('/get/:date', function (req, res) {
    const date = req.params.date
    FinalLocker.find({ date:date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

module.exports = router;

const express = require('express')
const router = express.Router();
const config = require('../config/database');
const BankAccountData = require('../models/bankAccountData');
const verify = require('../authentication');

function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.post('/add', verify, async function (req, res) {

    var dt = Date.parse(req.body.dip_date)

    const data = new BankAccountData({
        accountNumber: req.body.dip_account,
        type: req.body.dip_type,
        chequeNo: req.body.dip_cheque,
        amount: parseFloat(req.body.dip_amount).toFixed(2),
        date: convertToday(req.body.dip_date),
        timeStamp: dt / 1000
    })

    data.save()
        .then(result => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })
})

router.get('/getLastSeven', function (req, res) {
    const d = new Date()
    var ts = (d.getTime() - (7 * 24 * 60 * 60*1000)) / 1000;
    console.log(ts);
    
    BankAccountData
        .find({
            "timeStamp": {
                $gte: ts
            }
        })
        .sort({ "timeStamp": -1 })
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Success..!", data: result })
        })
        .catch(err => {
            res.json({ state: false, msg: "Data Transfer Error..!" })
        })
})

router.post('/getLastMonth', function (req, res) {

    var dt1 = new Date(req.body.date1)
    var dt2 = new Date(req.body.date2);

    const date1 = (Date.parse(dt1) - (1000 * 60 * 60 * 24)) / 1000
    const date2 = Date.parse(dt2) / 1000

    console.log(date1 / 1000);

    BankAccountData
        .find({
            "timeStamp":
            {
                $gte: date1,
                $lte: date2
            }
        })
        .sort({ "_id": -1 })
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Success..!", data: result })
        })
        .catch(err => {
            res.json({ state: false, msg: "Data Transfer Error..!" })
        })
})

router.delete('/delete/:id', function (req, res) {
    const id = req.params.id

    BankAccountData
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted Successfully'
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
})
module.exports = router
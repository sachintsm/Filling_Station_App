const express = require('express')
const router = express.Router();
const config = require('../config/database');
const DebitorAccount = require('../models/debitorsAccount');
const verify = require('../authentication');

router.post('/add', verify, function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(req.body.dip_date)

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.debitorId,
        billNo: req.body.billNo,
        invoiceNo: req.body.invoiceNo,
        vehicleNo: req.body.vehicleNo,
        productId: req.body.productId,
        productName: req.body.productName,
        size: req.body.size,
        qty: req.body.qty,
        debitAmount: req.body.amount,
        debitType: 'products',
        pumpId: req.body.pumpId,
        state: 'Pending',
        timeStamp: dt/1000
    })

    data.save()
        .then(result => {
            res.send({ state: true, msg: "Data Successfully Added ..!" })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Adding Not Successfull..!" })
        })
})

router.post('/addOther', verify, function (req, res) {
    // console.log(req.body);

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(req.body.dip_date)

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.newDOname,
        debitAmount: req.body.newDOamount,
        debitType: 'other',
        state: 'Pending',
        timeStamp: dt/1000
    })

    data.save()
        .then(result => {
            res.send({ state: true, msg: "Data Successfully Added ..!" })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Adding Not Successfull..!" })
        })
})
router.get('/get', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    DebitorAccount.find({ date: date, debitType: 'products' })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})
router.get('/getOther', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    DebitorAccount.find({ date: date, debitType: 'other' })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})



//delete product
router.delete('/delete/:id', function (req, res) {
    const _id = req.params.id

    DebitorAccount.remove({ _id: _id })
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

router.post('/addOtherCredit', verify, function (req, res) {
    // console.log(req.body);
// 
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(req.body.dip_date)

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.newCOname,
        creditAmount: req.body.newCOamount,
        debitType: 'other',
        timeStamp: dt/1000
    })

    data.save()
        .then(result => {
            res.send({ state: true, msg: "Data Successfully Added ..!" })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Adding Not Successfull..!" })
        })
})

router.post('/addCredit', verify, function (req, res) {
    // console.log(req.body);

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(req.body.dip_date)

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.debitorId,
        creditAmount: req.body.creditAmount,
        chequeNo : req.body.chequeNo,
        debitType: 'products',
        timeStamp: dt/1000
    })

    data.save()
        .then(result => {
            res.send({ state: true, msg: "Data Successfully Added ..!" })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Adding Not Successfull..!" })
        })
})
function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
//get by date
router.get('/get/:date', function (req, res) {
    var date = convertToday(req.params.date) 
    DebitorAccount.find({ date: date, debitType: 'products' })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

module.exports = router
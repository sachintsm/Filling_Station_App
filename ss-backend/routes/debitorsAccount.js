const express = require('express')
const router = express.Router();
const config = require('../config/database');
const DebitorAccount = require('../models/debitorsAccount');
const verify = require('../authentication');

router.post('/add', verify, function (req, res) { 

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.debitorId,
        billNo: req.body.billNo,
        invoiceNo: req.body.invoiceNo,
        vehicleNo: req.body.vehicleNo,
        productId: req.body.productId,
        productName: req.body.productName,
        size : req.body.size,
        qty: req.body.qty,
        amount: req.body.amount,
        debitType: 'products',
        pumpId: req.body.pumpId,
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
    console.log(req.body);
    console.log("heool"); 
    

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const data = new DebitorAccount({
        date: date,
        debitorId: req.body.debitorId,
        billNo: req.body.billNo,
        invoiceNo: req.body.invoiceNo,
        vehicleNo: req.body.vehicleNo,
        productId: req.body.productId,
        productName: req.body.productName,
        size : req.body.size,
        qty: req.body.qty,
        amount: req.body.amount,
        debitType: 'products',
        pumpId: req.body.pumpId,
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

    DebitorAccount.find({ date: date, debitType : 'products' })
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

    DebitorAccount.find({ date: date, debitType : 'products' })
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

module.exports = router
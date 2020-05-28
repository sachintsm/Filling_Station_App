const express = require('express')
const router = express.Router();
const config = require('../config/database');
const { dailySales } = require('../models/dailySales');
const { dailyFinalData } = require('../models/dailySales');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var price = req.body.price.toFixed(2);
    var dt = Date.parse(today)

    const data = new dailySales({
        pId: req.body.pId,
        pName: req.body.pName,
        size: req.body.size,
        qty: req.body.qty,
        price: price,
        date: date,
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

router.get('/get', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    dailySales.find({ date: date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})


router.post('/addDailyFinal', verify, async function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)

    const data = new dailyFinalData({
        fuels: req.body.fuels,
        totalProfit: req.body.totalProfit,
        date: date,
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


//? get history daily final data
router.get('/getfinal/:date', function (req, res) {
   
    dailyFinalData.find({ date: req.params.date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

//? get history daily sales data
router.get('/get/:date', function (req, res) {
   
    dailySales.find({ date: req.params.date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})
module.exports = router
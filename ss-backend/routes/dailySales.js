const express = require('express')
const router = express.Router();
const config = require('../config/database');
const DailySales = require('../models/dailySales');
const verify = require('../authentication');

router.post('/add', async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var price = req.body.price.toFixed(2);

    const data = new DailySales({
        pId: req.body.pId,
        pName: req.body.pName,
        size: req.body.size,
        qty: req.body.qty,
        price: price,
        date: date
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

router.get('/get', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    DailySales.find({ date: date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})
module.exports = router
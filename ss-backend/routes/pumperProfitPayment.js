const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpersProfitPayment = require('../models/pumperProfitPayment');
const verify = require('../authentication');

function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.post('/add', verify, function (req, res) {

    const startDate = convertToday(req.body.startDate)
    const endDate = convertToday(req.body.endDate)

    var dt = Date.parse(req.body.startDate)
    console.log(req.body)
    console.log(dt)
    const data = new PumpersProfitPayment({
        startDate: startDate,
        endDate: endDate,
        pumperId: req.body.pumperId,
        amount: parseFloat(req.body.amount).toFixed(2),
        type: req.body.type,
        timeStamp: dt / 1000
    })

    data.save()
        .then(result => {
            res.send({ state: true, msg: "Data Successfully Added ..!" })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Adding Not Successfull..!" })
        })
})

// get data by date and pumper id for earlier data
router.delete('/delete/:id', function (req, res) {
    var id = req.params.id

    PumpersProfitPayment
        .remove({ _id: id })
        .then(data => {
            res.send({ state: true, msg: "Successfully Deleted..!"})
        })
        .catch(err => {
            res.send({ state: false, msg: "Recored does not delete..!" })
        })
})

// get this month data
router.get('/getThisYear/:id', async (req, res) => {
    var today = new Date
    var dt = Date.parse(today)
    const date = (dt - (1000 * 60 * 60 * 24 * 30 * 12 * 3)) / 1000

    const id = req.params.id
    PumpersProfitPayment
        .find({
            "timeStamp":
            {
                $gte: date,
            },
            pumperId: id
        })
        .select('startDate endDate amount type')
        .sort({ timeStamp: 1 })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Transfer Unsuccessful..!" })
        })
})

module.exports = router
const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpersCalculation = require('../models/pumpersCalculations');
const verify = require('../authentication');

function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.post('/add', verify, function (req, res) {

    const date = convertToday(req.body.date)
    var dt = Date.parse(req.body.date)

    const data = new PumpersCalculation({
        setNumber: req.body.setNumber,
        date: date,
        pumperId: req.body.pumperId,
        twoStrokeOil: req.body.twoStrokeOil,
        engineOil: req.body.engineOil,
        otherSales: req.body.otherSales,
        saleAmount: req.body.saleAmount,
        receivedAmount: req.body.receivedAmount,
        profit: req.body.profit,
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

//get data by date and pumper id for earlier data
router.post('/get', async function (req, res) {
    var date = convertToday(req.body.el_date)
    var pumperId = req.body.el_pumperId
    //checking if the userId is already in the database
    const userIdExist = await PumpersCalculation.findOne({ pumperId: pumperId })
    if (!userIdExist) return res.json({ state: false, msg: "This pumperId does not exists..!" })

    PumpersCalculation.find({ date: date, pumperId: pumperId })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

//get this month data
router.get('/getThisMonth/:id', async (req, res) => {
    var today = new Date
    var dt = Date.parse(today)
    const date = (dt - (1000 * 60 * 60 * 24 * 30 * 3)) / 1000

    const id = req.params.id
    PumpersCalculation
        .find({
            "timeStamp":
            {
                $gte: date,
            },
            pumperId : id
        })
        .select('date pumperId profit')
        .sort({ timeStamp: 1 })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Transfer Unsuccessful..!" })
        })
})

module.exports = router
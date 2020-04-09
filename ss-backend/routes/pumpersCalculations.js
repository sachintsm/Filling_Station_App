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
    
    console.log(req.body);
    const date = convertToday(req.body.date)

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
router.post('/get', function (req, res) {
    var date = convertToday(req.body.el_date)
    var pumperId = req.body.el_pumperId
    
    PumpersCalculation.find({ date: date , pumperId : pumperId})
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})


module.exports = router
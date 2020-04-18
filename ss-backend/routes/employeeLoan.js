const express = require('express')
const router = express.Router();
const config = require('../config/database');
const EmployeeLoan = require('../models/employeeLoan');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)
    var credit = req.body.credit.toFixed(2)
    var debit = req.body.debit.toFixed(2)


    const data = new EmployeeLoan({
        empId: req.body.empId,
        credit: credit,
        debit: debit,
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

router.get('/get', function (req, res) {
    EmployeeLoan.find()
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})
module.exports = router
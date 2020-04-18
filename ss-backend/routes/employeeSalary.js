const express = require('express')
const router = express.Router();
const config = require('../config/database');
const EmployeeSalary = require('../models/employeeSalary');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)
    var amount = req.body.amount.toFixed(2)

    const data = new EmployeeSalary({
        empId: req.body.empId,
        amount: amount,
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

    EmployeeSalary.find()
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})
module.exports = router
const express = require('express')
const router = express.Router();
const config = require('../config/database');
const EmployeeSalary = require('../models/employeeSalary');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)
    var amount = parseFloat(req.body.amount).toFixed(2)

    const data = new EmployeeSalary({
        empId: req.body.empId,
        amount: amount,
        date: date,
        timeStamp: dt / 1000
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
    var dt = Date.parse(today)

    const date1 = (dt - (1000 * 60 * 60 * 24 * 30 * 12)) / 1000

    console.log(date1 / 1000);

    EmployeeSalary.find({
        "timeStamp":
        {
            $gte: date1,
        }
    })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    EmployeeSalary
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
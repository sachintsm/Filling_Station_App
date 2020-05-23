const express = require('express')
const router = express.Router();
const config = require('../config/database');
const EmployeeLoan = require('../models/employeeLoan');
const verify = require('../authentication');

router.post('/add', verify, async function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dt = Date.parse(today)

    const data = new EmployeeLoan({
        empId: req.body.empId,
        amount: parseFloat(req.body.amount).toFixed(2),
        type: req.body.type,
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
    const date1 = (dt - (1000 * 60 * 60 * 24 * 30 * 12 * 2)) / 1000
    EmployeeLoan
        .find({
            "timeStamp":
            {
                $gte: date1,
            }
        })
        .sort({ timeStamp: -1 })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "Data Transfer Unsuccessful..!" })
        })
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    EmployeeLoan
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
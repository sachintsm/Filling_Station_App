const express = require('express')
const router = express.Router();
const config = require('../config/database');
const LockerState = require('../models/lockerState');
const verify = require('../authentication');

router.post('/add', verify, function (req, res) {
    console.log(req.body);

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dt = Date.parse(req.body.dip_date)

    const data = new LockerState({
        lockerAmount: req.body.lockerAmount,
        date: date,
        time: time,
        timeStamp: dt/1000
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

    LockerState.find({ date: date })
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

    LockerState.remove({ _id: _id })
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
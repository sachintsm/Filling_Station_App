const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpersCash = require('../models/pumpersCash');
const verify = require('../authentication');

//add new pump details
router.post('/add', verify, async function (req, res, next) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const data = new PumpersCash({
        setNumber: req.body.setNumber,
        date: date,
        time : time,
        pumperId: req.body.pumperId,
        amount: req.body.amount+'.00',
    });

    data.save()
        .then(req => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })
})

//get pumps data
router.get('/get', function (req, res) {
    PumpSet.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//delete pump
router.delete('/delete/:id', function (req, res) {
    const _id = req.params.id

    PumpSet.remove({ _id: _id })
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

module.exports = router;

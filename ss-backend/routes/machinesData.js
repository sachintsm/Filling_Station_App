const express = require('express')
const router = express.Router();
const config = require('../config/database');
const MachineData = require('../models/machinesData');
const verify = require('../authentication');

router.post('/add', async function (req, res) {
    console.log(req.body);
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    //checking if the userId is already in the database
    const alreadyExists = await MachineData.findOne({ machineNumber: req.body.machineNumber, date: date })
    if (alreadyExists) {
        MachineData
            .update({ machineNumber: req.body.machineNumber, date: date },
                {
                    $set: {
                        meterReading: req.body.meterReading
                    }
                })    //update user data with correspond to userid
            .exec()
            .then(data => {
                console.log("Data Update Success..!")
                res.json({ state: true, msg: "Data Update Success..!" });

            })
            .catch(error => {
                console.log("Data Updating Unsuccessfull..!")
                res.json({ state: false, msg: "Data Updating Unsuccessfull..!" });
            })
    }
    else {
        const data = new MachineData({
            machineNumber: req.body.machineNumber,
            meterReading: req.body.meterReading,
            date: date,
        })
        data.save()
            .then(result => {
                res.json({ state: true, msg: " Data Added Successfully..!" })
            })
            .catch(err => {
                console.log(err);
                res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
            })
    }
})

router.get('/getToday', function (req, res) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    MachineData.find({ date: date })
        .sort({ machineNumber: 1 })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

router.get('/getYesterday', function (req, res) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 1);

    MachineData.find({ date: date })
        .sort({ machineNumber: 1 })
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
    MachineData.remove({ _id: _id })
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

//this below function uses for dailyPumpers calculations
function convertYesterDay(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + (date.getDate() - 1)).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.get('/getYes/:date', function (req, res) {

    const param = req.params.date
    let date = convertYesterDay(param)
    // console.log(date)
    MachineData.find({ date: date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
router.get('/getToday/:date', function (req, res) {

    const param = req.params.date
    let date = convertToday(param)
    // console.log(date)
    MachineData.find({ date: date })
        .then(data => {
            res.send({ state: true, msg: "Data Transefer Done..!", data: data })
        })
        .catch(err => {
            res.send({ state: false, msg: "data Tranfr Unsuccessful..!" })
        })
})

module.exports = router
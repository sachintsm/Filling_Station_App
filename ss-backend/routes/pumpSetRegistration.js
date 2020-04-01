const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpSet = require('../models/pumpSetRegistration');
const verify = require('../authentication');

//add new pump details
router.post('/add', verify, async function (req, res, next) {
    //checking if the pId is already in the database
    const pumpSetIdExist = await PumpSet.findOne({ setNumber: 'SET' + req.body.setNumber })
    if (pumpSetIdExist) return res.json({ state: false, msg: "This Set Number already in use..!" })

    const data = new PumpSet({
        setNumber: 'SET' + req.body.setNumber,
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

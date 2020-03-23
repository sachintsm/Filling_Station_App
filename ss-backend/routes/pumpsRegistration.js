const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpRegistration = require('../models/pumpsRegistration');
const verify = require('../authentication');

//add new pump details
router.post('/add', verify, function (req, res, next) {
    console.log(req.body);
    const data = new PumpRegistration({
        machineNumber: req.body.machineNumber,
        fuelType: req.body.fuelType,
        meterReading: req.body.meterReading,
        pumpSet: 'none'
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
    PumpRegistration.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//update pump set data
router.post('/updatePumpSet', async function (req, res) {
    console.log(req.body);
    const machineNumber = req.body.machineNumber;
    const pumpSet = req.body.pumpSet;

    await PumpRegistration
        .update({ machineNumber: machineNumber },
            {
                $set: {
                    pumpSet: pumpSet
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
})

//delete pump
router.delete('/deletePump/:id', function (req, res) {
    const _id = req.params.id

    PumpRegistration.remove({ _id: _id })
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

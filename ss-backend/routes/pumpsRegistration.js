const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpRegistration = require('../models/pumpsRegistration');
const verify = require('../authentication');

router.post('/add', function (req, res, next) {
    console.log(req.body);
    const data = new PumpRegistration({
        machineNumber: req.body.machineNumber,
        fuelType: req.body.fuelType,
        meterReading: req.body.meterReading,
        pumpSet: 'none'
    });
    data.save()
        .then(req => {
            res.json({ state: true, msg: " User Registered Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "User Registration Unsuccessfull..!" })
        })

})


module.exports = router;
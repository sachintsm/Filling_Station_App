const express = require('express')
const router = express.Router();
const config = require('../config/database');
const PumpRegistration = require('../models/pumpsRegistration');
const verify = require('../authentication');

router.post('/add',verify, function (req, res, next) {
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

router.get('/get',function(req,res){
    PumpRegistration.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

module.exports = router;

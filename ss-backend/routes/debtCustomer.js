const express = require('express')
const router = express.Router();
const config = require('../config/database');
const Debtor = require('../models/debtCustomer');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');



//User registration
router.post('/register', function (req, res) {
    
        //check fullName 
        if (req.body.fullName == '') return res.json({ state: false, msg: "Name Empty..!" })
        if (req.body.debtorId == '') return res.json({ state: false, msg: "Debtor ID Empty..!" })
        console.log(req.body.debtorId);
        if (req.body.damount == '') return res.json({ state: false, msg: "Amount Empty..!" })
        if (req.body.nic == '') return res.json({ state: false, msg: "NIC Empty..!" })
        if (req.body.mobile == '') return res.json({ state: false, msg: "Mobile Number Empty..!" })
        

        //checking if the userId is already in the database
        // const debtorIdExist = await Debtor.findOne({ debtorId: req.body.debtorId })
        // if (debtorIdExist) return res.json({ state: false, msg: "This debtorId already in use..!" })

        

      

        //create a new user
        const newDebtor = new Debtor({
            fullName: req.body.fullName,
            debtorId: req.body.debtorId,
            damount: req.body.damount,
            nic: req.body.nic,
            mobile: req.body.mobile,
            fax: req.body.fax,
            address: req.body.address,
            other: req.body.other,
        })

        newDebtor.save()
        .then(req => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })

  
 
})

//get data from backend

router.get('/get', function (req, res) {

    Debtor.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//delete product
router.delete('/deleteDebtor/:id', function (req, res) {
    const _id = req.params.id

    Debtor.remove({ _id: _id })
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
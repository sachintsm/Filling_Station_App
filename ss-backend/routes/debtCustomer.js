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
router.post('/register', async function (req, res) {
    //check already exist or not
    const debtExists = await Debtor.findOne({ debtorId: req.body.debtorId })
    if (debtExists) return res.json({ state: false, msg: "This Customer ID already in use..!" })

    //create a new user
    const newDebtor = new Debtor({
        fullName: req.body.fullName,
        debtorId: req.body.debtorId,
        damount: parseFloat(req.body.damount).toFixed(2),
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

//get name and ID
router.get('/getNameId', function (req, res) {
    Debtor.find()
        .select('fullName debtorId')
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

router.get("/checkId/:id", async (req, res) => {
    // checking if the pId is already in the database
    const product = await Debtor.findOne({ debtorId: req.params.id });
    if (!product) return res.json({ state: false, msg: "Not available debitor Id..!" })
    else return res.json({ state: true })
})

//? get all data from the customer list
router.get('/customer/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    Debtor.find({debtorId : id})
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})
module.exports = router
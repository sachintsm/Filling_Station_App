const express = require('express')
const router = express.Router();
const config = require('../config/database');
const BankAccountData = require('../models/bankAccountData');
const verify = require('../authentication');

function convertToday(str) {
    var date = new Date(str),
        mnth = ("" + (date.getMonth() + 1)).slice(-2),
        day = ("" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.post('/add', verify, async function (req, res) {

    const data = new BankAccountData({
        accountNumber: req.body.dip_account,
        type: req.body.dip_type,
        chequeNo: req.body.dip_cheque,
        amount: req.body.dip_amount,
        date: convertToday(req.body.dip_date)
    })

    console.log(req.body);
    data.save()
        .then(result => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })
})

// router.get('/getAccountNames', function (req, res){
//     BankAccounts
//         .find()
//         .exec()
//         .then(result => {
//             res.json({state: true, msg: "Data Transfer Success..!", data : result})
//         })
//         .catch(err => {
//             res.json({state: false, msg: "Data Transfer Error..!"})
//         })
// })
module.exports = router
const express = require('express')
const router = express.Router();
const config = require('../config/database');
const FuelLubPrice = require('../models/fuelLubricantPrice');
const verify = require('../authentication');

//add new product details
router.post('/add', verify, async function (req, res, next) {
    //checking if the pId is already in the database
    const productIdExist = await FuelLubPrice.findOne({ pId: req.body.pId })
    if (productIdExist) return res.json({ state: false, msg: "This pId already in use..!" })

    const data = new FuelLubPrice({
        pId: req.body.pId,
        pName: req.body.pName,
        size: req.body.size,
        buyPrice: req.body.buyPrice,
        sellPrice: req.body.sellPrice,
        pType: req.body.pType
    });
    data.save()
        .then(result => {
            res.json({ state: true, msg: " Data Added Successfully..!" })
        })
        .catch(err => {
            console.log(err);
            res.json({ state: false, msg: "Data Adding Unsuccessfull..!" })
        })

})

//get pumps data
router.get('/get', function (req, res) {
    FuelLubPrice.find()
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//update pump set data
router.post('/updateProductPrice', async function (req, res) {
    console.log(req.body);
    const pId = req.body.pId;
    const buyPrice = req.body.buyPrice;
    const sellPrice = req.body.sellPrice;


    await FuelLubPrice
        .update({ pId: pId },
            {
                $set: {
                    buyPrice: buyPrice,
                    sellPrice: sellPrice
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

//delete product
router.delete('/deleteProduct/:id', function (req, res) {
    const _id = req.params.id

    FuelLubPrice.remove({ _id: _id })
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

router.get('/getFuelPrice', function (req, res) {
    FuelLubPrice.find({pType : 'Fuel'})
        .select('pId sellPrice')
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})
module.exports = router;

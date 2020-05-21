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

    var size = req.body.size
    var buyPrice = req.body.buyPrice
    var sellPrice = req.body.sellPrice

    const data = new FuelLubPrice({
        pId: req.body.pId,
        pName: req.body.pName,
        size: parseFloat(size).toFixed(3),
        buyPrice: parseFloat(buyPrice).toFixed(2),
        sellPrice: parseFloat(sellPrice).toFixed(2),
        pType: req.body.pType,
        availStock: 0
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
    FuelLubPrice.find({ pType: 'Fuel' })
        .select('pId sellPrice')
        .exec()
        .then(result => {
            res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
        })
        .catch(error => {
            res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
        })
})

//update available stock data
router.post('/updateAvailableStock', verify, async function (req, res) {
    console.log(req.body);
    const pId = req.body.pId;
    const availStock = req.body.updatedStock;

    await FuelLubPrice
        .update({ pId: pId },
            {
                $set: {
                    availStock: availStock,
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

//update daily sales page stocks redusions
router.post('/salesUpdate', async (req, res) => {

    // checking if the pId is already in the database
    const product = await FuelLubPrice.findOne({ pId: req.body.pId })
    if (!product) return res.json({ state: false, msg: "This Product Not Available..!" })
    const newStock = product.availStock - req.body.qty

    await FuelLubPrice
        .update({ pId: req.body.pId },
            {
                $set: {
                    availStock: newStock,
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
module.exports = router;

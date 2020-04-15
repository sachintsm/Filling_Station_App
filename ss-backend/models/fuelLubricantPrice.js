const mongoose = require('mongoose');
const Schema = mongoose.schema;

var fuelLubPriceSchema = mongoose.Schema({
    pId: {type: String},
    pName: {type: String},
    size: {type: String},
    buyPrice: {type: String},
    sellPrice: {type: String},
    pType: {type: String},  
    availStock : {type: String},
});

const fuelLubPrice = module.exports = mongoose.model("fuelLubPrice", fuelLubPriceSchema);

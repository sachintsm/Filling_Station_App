const mongoose = require('mongoose');
const Schema = mongoose.schema;

var dailySalesSchema = mongoose.Schema({
    pId: {type: String},
    pName: {type: String},
    size: {type: String},
    price: {type: String},
    qty: {type: String}, 
    pumper: {type: String},   
    pState: {type: String},
});

const dailySales = module.exports = mongoose.model("dailySales", dailySalesSchema);

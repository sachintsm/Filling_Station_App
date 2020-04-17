const mongoose = require('mongoose');
const Schema = mongoose.schema;

var dailySalesSchema = mongoose.Schema({
    pId: {type: String},
    pName: {type: String},
    size: {type: String},
    price: {type: String},
    qty: {type: String}, 
    date: {type: String},
    timeStamp: { type: String },
});

const dailySales = module.exports = mongoose.model("dailySales", dailySalesSchema);

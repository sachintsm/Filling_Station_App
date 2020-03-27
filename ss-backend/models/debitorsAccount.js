const mongoose = require('mongoose');
const Schema = mongoose.schema;

var DebitorAccountSchema = mongoose.Schema({
    date: { type: String },
    debitorId: { type: String },
    billNo: { type: String },
    invoiceNo: { type: String },
    vehicleNo: { type: String },
    productId: { type: String },
    productName : {type : String},
    qty: { type: String },
    size : {type: String},
    amount : {type : String},
    debitType: { type: String },
    pumpId: { type: String },
});

const DebitorAccount = module.exports = mongoose.model("DebitorAccount", DebitorAccountSchema);

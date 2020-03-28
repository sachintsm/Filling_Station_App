const mongoose = require('mongoose');
const Schema = mongoose.schema;

var DebitorAccountSchema = mongoose.Schema({
    date: { type: String },
    debitorId: { type: String },
    billNo: { type: String },
    invoiceNo: { type: String },
    chequeNo: {type:String},
    vehicleNo: { type: String },
    productId: { type: String },
    productName : {type : String},
    qty: { type: String },
    size : {type: String},
    debitAmount : {type : String},
    creditAmount : {type:String},
    debitType: { type: String },
    pumpId: { type: String },
    state : {type  :String}
});

const DebitorAccount = module.exports = mongoose.model("DebitorAccount", DebitorAccountSchema);

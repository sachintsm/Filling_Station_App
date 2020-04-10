const mongoose = require('mongoose');
const Schema = mongoose.schema;

var BankAccountDataSchema = mongoose.Schema({
    accountNumber: {type: String},
    type: {type: String},
    chequeNo: {type: String},
    amount: {type: String},
    date: {type: String},
});

const BankAccountData = module.exports = mongoose.model("BankAccountData", BankAccountDataSchema);

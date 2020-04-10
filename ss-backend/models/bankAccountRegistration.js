const mongoose = require('mongoose');
const Schema = mongoose.schema;

var BankAccountSchema = mongoose.Schema({
    bankName: {type: String},
    accountName: {type: String},
    accountNumber: {type: String},
});

const BankAccounts = module.exports = mongoose.model("BankAccounts", BankAccountSchema);

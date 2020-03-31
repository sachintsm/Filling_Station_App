const mongoose = require('mongoose');
const Schema = mongoose.schema;

var debtSchema = mongoose.Schema({
    fullName: {type: String},
    debtorId: {type: String},
    damount: {type: String},
    nic: {type: String},
    mobile: {type: String},
    fax: {type: String},
    address: {type: String},
    other: {type: String},
    isDeleted:{type:String}
});

const Debtor = module.exports = mongoose.model("Debtor", debtSchema);

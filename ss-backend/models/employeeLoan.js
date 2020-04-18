const mongoose = require('mongoose');
const Schema = mongoose.schema;

var employeeLoanSchema = mongoose.Schema({
    date: {type: String},
    empId: {type: String},
    credit: {type: String},
    debit: {type: String},
    timeStamp: {type: String},
});

const employeeLoan = module.exports = mongoose.model("employeeLoan", employeeLoanSchema);

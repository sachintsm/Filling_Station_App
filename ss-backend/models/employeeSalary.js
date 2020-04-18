const mongoose = require('mongoose');
const Schema = mongoose.schema;

var employeeSalarySchema = mongoose.Schema({
    date: {type: String},
    empId: {type: String},
    amount: {type: String},
    timeStamp: {type: String},
});

const employeeSalary = module.exports = mongoose.model("employeeSalary", employeeSalarySchema);

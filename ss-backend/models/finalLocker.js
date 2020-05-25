const mongoose = require('mongoose');
const Schema = mongoose.schema;

var finalLockerSchema = mongoose.Schema({
    date: {type: String},
    amount: {type: String},
    timeStamp: {type: String},
});

const finalLocker = module.exports = mongoose.model("finalLocker", finalLockerSchema);

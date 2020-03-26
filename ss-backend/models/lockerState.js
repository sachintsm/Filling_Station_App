const mongoose = require('mongoose');
const Schema = mongoose.schema;

var lockerStateSchema = mongoose.Schema({
    lockerAmount: { type: String },
    date: { type: String },
    time: { type: String },
});

const lockerState = module.exports = mongoose.model("lockerState", lockerStateSchema);

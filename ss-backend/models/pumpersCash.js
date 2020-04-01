const mongoose = require('mongoose');
const Schema = mongoose.schema;

var pumpersCashSchema = mongoose.Schema({
    date: { type: String },
    time: { type: String },
    pumperId: { type: String },
    amount: { type: String },
    setNumber: { type: String },
});

const PumpersCash = module.exports = mongoose.model("PumpersCash", pumpersCashSchema);

const mongoose = require('mongoose');
const Schema = mongoose.schema;

var pumpSetRegistrationSchema = mongoose.Schema({
    setNumber: {type: String},  
});

const PumpSet = module.exports = mongoose.model("PumpSet", pumpSetRegistrationSchema);

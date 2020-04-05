const mongoose = require('mongoose');
const Schema = mongoose.schema;

var pumpRegistrationSchema = mongoose.Schema({
    machineNumber: {type: String},
    fuelType: {type: String},
    meterReading: {type: String},
    pumpSet: {type: String},  
    productId : {type: String}
});

const PumpRegistration = module.exports = mongoose.model("PumpRegistration", pumpRegistrationSchema);

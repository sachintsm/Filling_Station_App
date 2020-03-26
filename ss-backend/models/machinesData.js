const mongoose = require('mongoose');
const Schema = mongoose.schema;

var machineDataSchema = mongoose.Schema({
    meterReading: {type: String},
    date: {type: String},
    machineNumber: {type: String},    
});

const MachineData = module.exports = mongoose.model("MachineData", machineDataSchema);

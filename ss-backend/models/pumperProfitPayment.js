const mongoose = require('mongoose');
const Schema = mongoose.schema;

var pumpersProfitPaymentsSchema = mongoose.Schema({
    startDate: {type: String},
    endDate: {type: String},
    pumperId : {type:String},
    amount: {type: String},
    type:{type: String},
    timeStamp: {type: String},
});

const pumpersProfitPayments = module.exports = mongoose.model("pumpersProfitPayments", pumpersProfitPaymentsSchema);

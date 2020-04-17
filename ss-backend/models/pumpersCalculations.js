const mongoose = require('mongoose');
const Schema = mongoose.schema;

var pumpersCalculationSchema = mongoose.Schema({
        setNumber: { type: String },
        date: { type: String },
        pumperId: { type: String },
        twoStrokeOil: { type: String },
        engineOil: { type: String },
        otherSales: { type: String },
        saleAmount: { type: String },
        receivedAmount: { type: String },
        profit: { type: String },
        timeStamp: { type: String },
});

const pumpersCalculation = module.exports = mongoose.model("pumpersCalculation", pumpersCalculationSchema);

const mongoose = require('mongoose');
const Schema = mongoose.schema;

var dailySalesSchema = mongoose.Schema({
    pId: { type: String },
    pName: { type: String },
    size: { type: String },
    price: { type: String },
    qty: { type: String },
    date: { type: String },
    timeStamp: { type: String },
});

var dailyFinalDataSchema = mongoose.Schema({
    date: { type: String },
    totalProfit: { type: String },
    fuels: [{
        pumpId: String,
        fuelType: String,
        units: String,
        amount: String
    }],
    timeStamp: { type: String },
})

const dailySales = mongoose.model("dailySales", dailySalesSchema);
const dailyFinalData = mongoose.model("dailyFinalData", dailyFinalDataSchema)

module.exports = {
    dailySales: dailySales,
    dailyFinalData: dailyFinalData
}

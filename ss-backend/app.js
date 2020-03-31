const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
// const jwt = require('jsonwebtoken');
const passport = require('passport');
const { createServer } = require('http');

const config = require('./config/database')
const users = require('./routes/users')
const debtors = require('./routes/debtCustomer')

const pumpsRegistration = require('./routes/pumpsRegistration')
const fuelLubricantPrice = require('./routes/fuelLubricantPrice')
const dailySales = require('./routes/dailySales')
const lockerState = require('./routes/lockerState')
const machinesData = require('./routes/machinesData')
const debitorsAccount = require('./routes/debitorsAccount')
const pumpSetRegistration = require('./routes/pumpSetRegistration')

const connection = mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true })
if (connection) {
    console.log("Database Connected");
}
else {
    console.log("Database not Connected");
}

app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', users);
app.use('/debtors', debtors);

app.use('/pumpsRegistration', pumpsRegistration)
app.use('/fuelLubricantPrice', fuelLubricantPrice)
app.use('/dailySales', dailySales)
app.use('/lockerState', lockerState)
app.use('/machinesData', machinesData)
app.use('/debitorsAccount', debitorsAccount)
app.use('/pumpSetRegistration', pumpSetRegistration)

app.get("/", function (req, res) {
    res.send("Hello world");
});

app.listen(4000, function () {
    console.log("listening to port 4000");
});


module.exports = app;  
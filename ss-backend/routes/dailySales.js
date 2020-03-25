const express = require('express')
const router = express.Router();
const config = require('../config/database');
const DailySales = require('../models/dailySales');
const verify = require('../authentication');


module.exports = router
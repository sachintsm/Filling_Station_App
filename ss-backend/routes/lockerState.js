const express = require('express')
const router = express.Router();
const config = require('../config/database');
const LockerState = require('../models/lockerState');
const verify = require('../authentication');


module.exports = router
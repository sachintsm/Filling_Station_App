const express = require('express')
const router = express.Router();
const config = require('../config/database');
const User = require('../models/users');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
var path = require('path');
const fs = require('fs');

//User registration
router.post('/register',function(req,res){

})

//User Login
router.get('/login', function(req,res){
    
})


module.exports = router
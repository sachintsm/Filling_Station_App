const mongoose = require('mongoose');
const Schema = mongoose.schema;

var userSchema = mongoose.Schema({
    userid: { type: String },
    teachername: { type: String },
    subject: { type: String },
    attachmenttype: { type: String },
    class: { type: String },
    showname: {type: String},
    path: { type: String },
});

const Users = module.exports = mongoose.model("Users", userSchema);

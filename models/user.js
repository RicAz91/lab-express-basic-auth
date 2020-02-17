'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;

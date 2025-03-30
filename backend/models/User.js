const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  Phone:{
    type : Number,
    required : true ,
  }
});
const User = mongoose.model('User', userSchema); // Mongoose maps to 'users' collection
module.exports = User;

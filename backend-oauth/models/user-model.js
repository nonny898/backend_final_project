const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  googleId: Number,
});

module.exports = mongoose.model('User', userSchema);

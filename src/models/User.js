const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  region: String,
  name: String,
});

module.exports = mongoose.model('User', UserSchema);
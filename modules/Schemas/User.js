const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  uuid: String,
  name: String,
  user_name: String,
  password: String
});

User.path('_id');

module.exports = mongoose.model('User', User );
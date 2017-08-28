var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var msgSchema = new Schema({
        msg: String,
  	username: String,
  	position: String,
  	time: String
});

//mongoose.connect('mongodb://localhost:27017/socketChat');
module.exports = mongoose.model('message', msgSchema);

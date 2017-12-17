'use strict.';

var user = require('../../models/model');
var crypto = require('crypto');
var rand = require('csprng');

module.exports = login = {};

login.loginUser = function(username, password, callback) {
	user.find({username: username},function(err,users){
		if(users.length != 0){
			var temp = users[0].salt;
			var hash_db = users[0].hashed_password;
			var id = users[0].token;
			var newpass = temp + password;
			var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			//var grav_url = gravatar.url(email, {s: '200', r: 'pg', d: '404'});
			if(hash_db == hashed_password){
				return callback({'response':"Login Sucess",'res':true,'token':id});
			}else{
				return callback({'response':"Invalid Password",'res':false});
			}
		}else {
			return callback({'response':"User not exist",'res':false});
		}
	});
	
};

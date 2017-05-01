'use strict.';

var user = require('../../models/model');
var crypto = require('crypto');
var rand = require('csprng');

module.exports = register = {};

register.newUser = function(username, email, password, callback) {
	//status = 'success';
	var x = email;
	if(!(x.indexOf("@") == x.length)){
		//if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && password.length > 4 && password.match(/[0-9]/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
			var temp =rand(160, 36);
			var newpass = temp + password;
			var token = crypto.createHash('sha512').update(email +rand).digest("hex");
			var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			var newuser = new user({
				username: username,
				token: token,
				email: email,
				hashed_password: hashed_password,
				salt :temp 
			});
			user.find({email : email}, function(err, users){
				if(err) {
					console.log(err);
				}else {
					var len = users.length;
					if(len == 0){
						newuser.save(function (err) {
							return callback({'response' : 'Sucessfully Registered'});
						});
					}else{
						return callback({'response' : 'Email already Registered'});
					}
				}
			});
		
		//}
	}else{
		callback({'response' : 'Email Not Valid'});
	}
};

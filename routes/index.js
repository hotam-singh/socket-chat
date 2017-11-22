var register = require('../public/js/register');
var login = require('../public/js/login');
var Messages = require('../models/messages');
Messages.remove();
var session;

module.exports = Routes;

function Routes(app, io) {
	app.get('/', function(req, res) {
		//session = req.session;
		// console.log('cookies : '+JSON.stringify(req.cookies));
		// if(session.username) {
		// 	console.log('user already login');
		// }else {
			res.render('index');
		//}
	});

	app.get('/login', function(req, res) {
		session = req.session;
		if(session.username) {
			console.log('user already login');
		}else {
			res.render('index');
		}
	});

	app.get('/register', function(req, res) {
		session = req.session;
		if(session.username) {
			console.log('user already login');
		}else {
			res.render('register');
		}
	});

	app.post('/chatroom', function(req, res) {
		console.log('EXECUTING POST METHOD ON LOGGING-IN A USER');
		console.log('user data : '+JSON.stringify(req.body));
		username = req.body.username;
		password = req.body.password;
		req.checkBody('username', 'Error : Username Field Is Required').notEmpty();
		req.checkBody('password', 'Error : Password Field Is Required').notEmpty();
		var errors = req.validationErrors();
		if(errors) {
			console.log('errors : ' + JSON.stringify(errors));
			res.render('index', {
				errors : errors
			});
		}else {
			console.log('NO ERRORS FOUND. YOU CAN NOW FURTHER PROCESS');
			login.loginUser(username, password, function(status) {
				//console.log('STATUS : ' + status);
				console.log('STATUS : ' + JSON.stringify(status));
				if(status.response == 'Login Sucess') {
					req.session.user = req.body.username;
					req.headers.cookie = req.body.username
					//console.log('./chatroom for post request : '+req.session.user);
					Messages.find({}, function(err, result) {
						if(err) throw err;
						if(result.length >= 0) {
							res.render('home', {
								username: req.body.username,
								msgHistory : result
							});
						}
					});
				}else {
					res.render('index', {
						errorMsg : status.response
					});
				}
			});
		}
	});

	app.get('/chatroom', function(req, res) {
		if(req.session && req.session.user) {
			Messages.find({}, function(err, result) {
				if(err) throw err;
				console.log('updating message UI : '+JSON.stringify(result));
				res.render('home', {
					username : req.session.user,
					msgHistory: result
				});
			});
		}else {
			res.redirect('/login');
		}
	});

	app.post('/register', function(req, res) {
		console.log('EXECUTING POST METHOD ON REGISTERING A USER');
		console.log('user data : '+JSON.stringify(req.body));
		username = req.body.username;
		email = req.body.email;
		password = req.body.password;
		password2 = req.body.confirmPassword;
		req.checkBody('username', 'Error : Username Field Is Required').notEmpty();
		req.checkBody('email', 'Error : Email Address Field Is Required').notEmpty();
		req.checkBody('email', 'Error : Email Address Field Is Invalid').isEmail();
		req.checkBody('password', 'Error : Password Field Is Required').notEmpty();
		var errors = req.validationErrors();
		if(errors) {
			console.log('errors : ' + JSON.stringify(errors));
			res.render('index', {
				errors : errors
			});
		}else {
			if(password != password2) {
				passwordError = [{"param":"password2","msg":"Error : Password Does Not Match"}];
				res.render('index', {
					errors : passwordError
				});
			}else {
				console.log('NO ERRORS FOUND. YOU CAN NOW FURTHER PROCESS');
				register.newUser(username, email, password, function(status) {
					console.log('STATUS : ' + JSON.stringify(status));
					if(status.response == 'Sucessfully Registered') {
						res.render('index', {
							successMsg : status.response
						});
					}else {
						res.render('index', {
							errorMsg : status.response
						});
					}
				});
			}
		}

	});

	//Called Default GET Request When No Request Found On Server
	app.get('*', function(req, res) {
		//log.debug("Got a URL with no handler... Using default handler... Redirecting to /. URL : " + req.hostname);
		//Setting P3P in response header
		var policyRef = req.protocol+"://"+req.hostname;
		res.set({'P3P': "CP='NOI DSP COR NID CURa TAIi OUR BUS INT PRE'; policyref='"+policyRef+"/w3c/p3p.xml';"});
		res.redirect("/");//"login.html", {errorMessage: "Page not found.", Username: ""});
	});
};

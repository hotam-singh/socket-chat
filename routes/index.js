var register = require('../public/js/register');
var login = require('../public/js/login');
var Messages = require('../models/messages');
Messages.remove();
var session;

module.exports = Routes;

function Routes(app, io) {
	app.get('/', function(req, res) {
		session = req.session;
		if(session.user) {
		 	return;
		}else {
			res.render('index');
		}
	});

	app.get('/login', function(req, res) {
		session = req.session;
		if(session.user) {
			return;
		}else {
			res.render('index');
		}
	});

	app.get('/register', function(req, res) {
		session = req.session;
		if(session.user) {
			return;
		}else {
			res.render('register');
		}
	});

	app.post('/chatroom', function(req, res) {
		username = req.body.username;
		password = req.body.password;
		req.checkBody('username', 'Error : Username Field Is Required').notEmpty();
		req.checkBody('password', 'Error : Password Field Is Required').notEmpty();
		var errors = req.validationErrors();
		if(errors) {
			res.render('index', {
				errors : errors
			});
		}else {
			login.loginUser(username, password, function(status) {
				if(status.response == 'Login Sucess') {
					req.session.user = req.body.username;
					req.headers.cookie.user = req.body.username;
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
				register.newUser(username, email, password, function(status) {
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

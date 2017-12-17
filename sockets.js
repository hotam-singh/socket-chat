var connect = require('connect');
//var parseCookie = require('connect').utils.parseCookie;
var cookie = require('cookie');
var config = require('./config/config.json');
var Message = require('./models/messages');
var users = [];
var msgCount = 0;
var count = 0;

module.exports = Sockets;

function Sockets (app, io) {
	onConnectionHandler = function(socket) {
		//Socket Event To Set Username In Online User's List
		socket.on('setUsername', function(data) {
			var user = {
				username: data.username,
				status: 'online',
				socketId: socket.id
		        };
			acceptUser(socket, user);
		});

		//Socket Event For User Is Typing
		socket.on('isTyping', function(data) {
			io.sockets.emit('typing', data);
		});

		//Socket Event For Sending A Message
		socket.on('send-message', function(data) {
			msgCount = msgCount + 1;
			count = 0;
			io.sockets.emit('msgCount', msgCount);
			io.sockets.emit('send-message', {
				msg: data.message,
				time: data.time,
				username: data.username
			});
		});

		//On Socket Disconection
		socket.on('disconnect', function() {
			getUser(socket.id, function(offlineUser) {
				io.emit('users', users);
			});
		});
	};

	//Function To Verify Whether A User Already Exists In Online User's List
	function acceptUser(socket, user) {
		var userFound = false;
		if (users) {
			for (var i = 0; i < users.length; i++) {
				if (users[i]['username'] == user.username) {
					users[i]['status'] = 'online';
					userFound = true;
				}
			}
		}
		if (!userFound) {
			users.push(user);
		}
		io.emit('users', users);
	}

	//Function To Get Offline User
	function getUser(socketId, callback) {
		if(users) {
			users.forEach(function(user) {
				if(user.socketId == socketId) {
					var offlineUser = user.username;
					users.pop(user);
					callback(offlineUser);
				}
			});
		}
	};
	io.on('connection', onConnectionHandler);
}

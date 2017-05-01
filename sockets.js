var connect = require('connect');
//var parseCookie = require('connect').utils.parseCookie;
var cookie = require('cookie');
var config = require('./config/config.json');
var users = [];
var msgCount = 0;

module.exports = Sockets;

function Sockets (app, io) {
	setAuthorization = function (socket, next) {
		var hsData = socket.request;
		console.log("Socket's setAuthorization called from "+hsData.connection.remoteAddress);
	        if(hsData.headers.cookie) {
	            //console.log('cookies : '+hsData.headers.cookie);
		    var cookies = cookie.parse(hsData.headers.cookie);
		    var sid = cookies['connect.sid'];
		    console.log('sid : '+sid);
	        } else {
	            next(new Error('No cookie transmitted.'));
	        }
	};
	onConnectionHandler = function(socket) {
		//var cookie = socket.request.headers.cookie;
		//var parseCookie = connect.utils.parseCookie(cookie);
		//var sid = parseCookie['connect.sid'];
		//if(!sid)
		//return;
		//var cookie = socket.handshake.headers.cookie;
		//var cookie = cookie.parse(socket.handshake.headers.cookie);
		//console.log('cookie : '+cookie);
		console.log('socketID : ' + socket.id + ' connected');

		//Socket Event For User Is Typing
		socket.on('isTyping', function(data) {
			console.log(data.nickname + ' is typing');
			io.sockets.emit('typing', data);
		});

		//Event For Sending A Message
		socket.on('send-message', function(data) {
			msgCount = msgCount + 1;
			console.log('data : ' + JSON.stringify(data));
			io.sockets.emit('msgCount', msgCount);
			io.sockets.emit('send-message', {
				msg: data.message,
				position: 'right',
				time: data.time,
				username: data.username
			});
		});

		//On Socket Disconection
		socket.on('disconnect', function() {
			console.log('socketID : ' + socket.id + ' is disconnected');
		});
	};
	//io.use(setAuthorization);
	io.on('connection', onConnectionHandler);
}

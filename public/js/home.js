'use strict';

$('document').ready(function() {
	var username = '';
	//var URL = window.location.protocol + "//" + window.location.host;
	var socket = io('http://localhost:3333');
	$('#input-message').keypress(function(e) {
		if(e.which == 13 || e.keyCode == 13) {
			var msg = $('#input-message').val();
			var currentDate = new Date();
			var time = currentDate.getHours() + ':' + currentDate.getMinutes();
			username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
			//alert(username);
			socket.emit('send-message', {
				message : msg,
				time: time,
				username: username
			});
			$('#input-message').val('');
		}else {
			socket.emit('isTyping', {
				nickname : username
			});
		}
	});

	socket.on('msgCount', function(msgCount) {
		$('.count span').html(msgCount);
	});

	//Event For Sending A Message
	socket.on('send-message', function(data) {
		if(username) {
			$('ul#messages').append(
				$('<li>').attr('class', data.position).append(
					$('<div>').attr('class','head').append(
						$('<span>').attr('class', 'time').append(data.time),
						$('<span>').attr('class', 'name').append(data.username)
					),
					$('<div>').attr('class','message').append(data.msg)
				)
			);
		}else {
			$('ul#messages').append(
				$('<li>').attr('class', 'left').append(
					$('<div>').attr('class','head').append(
						$('<span>').attr('class', 'time').append(data.time),
						$('<span>').attr('class', 'name').append(data.username)
					),
					$('<div>').attr('class','message').append(data.msg)
				)
			);
		}
	});

	//Event For User Is Typing
	socket.on('typing', function(data) {
		//alert(data.nickname + ' is typing');
		//$('ul.chat').html('<li>' + data.nickname + 'is typing</li>');
		console.log(data.nickname + ' is typing');
	});

});

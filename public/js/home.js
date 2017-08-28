$(function () {
	var username = '';
	var socket = io();
	socket.on('connect', function() {
		username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
		username = username.trim();
		if(username) {
			socket.emit('setUsername', {
				'username': username
			});
		}
	});
	$('#input-message').keypress(function(e) {
		if(e.which == 13 || e.keyCode == 13) {
			var msg = $('#input-message').val();
			var currentDate = new Date();
			var time = currentDate.getHours() + ':' + currentDate.getMinutes();
			username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
			username = username.trim();
			if(msg) {
				socket.emit('send-message', {
					message : msg,
					time: time,
					username: username
				});
				$('#input-message').val('');
				return false;
			}
		}else {
			socket.emit('isTyping', {
				nickname : username
			});
		}
	});

	socket.on('typing', function(data) {
		//alert(data.nickname + ' is typing');
		username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
		username = username.trim();
		if(username != data.nickname) {
			$('#isTyping').html(data.nickname + ' is typing');
		}else {
			$('#isTyping').html('');
		}
	});

	//Updating Message on Client Side
	socket.on('send-message', function(data) {
		$('#isTyping').html('');
		username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
		username = username.trim();
		if(username == data.username) {
			$('ul#messages').append(
				$('<li>').attr('class', 'right').append(
					$('<div>').attr('class','head').append(
						$('<span>').attr('class', 'time').append(data.time),
						$('<span>').attr('class', 'name').append(data.username)
					),
					$('<div>').attr('class','message').append(data.msg)
				)
			);
			/*socket.emit('save_new_msg', {
				msg: data.msg,
				time: data.time,
				username: data.username,
				position: 'right'
			});*/
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
			/*username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
			username = username.trim();
			socket.emit('save_new_msg', {
				msg: data.msg,
				time: data.time,
				username: username,
				position: 'left'
			});*/
		}
	});

	//Updating Online Users
	socket.on('users', function(users) {
		//alert('updating all online users');
		username = $('button.btn.btn-default.dropdown-toggle').text().split('T')[0];
		username = username.trim();
		$('.list-friends li').each(function(i) {
			if(i > 0) {
				$(this).remove();
			}
		});
		users.forEach(function(user) {
			if(username != user.username) {
				$('.list-friends').append(
					$('<li>').attr('id', user.username).append(
						$('<i>').attr('class', 'fa fa-user fa-fw user-icon'),
						$('<div>').attr('class', 'info').append(
							$('<div>').attr('class', 'user').append(user.username),
							$('<div>').attr('class', 'status online').append('online'),
							$('<div>').attr('class', 'message-alert label label-warning').append('New Message')
						)
					)
				);
			}
		});
	});
});

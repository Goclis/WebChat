var io = require('socket.io-client');

var client_sockets = [];

var len = 100;

for (var i = 0; i < len; ++i) {
	(function () {
		var socket = io.connect('http://localhost:3000', {'force new connection': true});
		socket.on('connect', function () {

			client_sockets.push(socket);

			if (client_sockets.length === len) {
				console.log('Create over.\n');
				

				setInterval(function () {
					client_sockets[0].emit('my_msg', '');
				}, 100);
			}
		});

		socket.on('others_msg', function (data) {

		});
	})();
}
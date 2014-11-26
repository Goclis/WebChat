var io = require('socket.io-client');

var client_sockets = [];

var len = 100;

var interval_ms = 100;

var url = "http://localhost:3000";

for (var i = 0; i < len; ++i) {
	(function () {
		var socket = io.connect(url, {'force new connection': true});
		socket.on('connect', function () {

			client_sockets.push(socket);

			if (client_sockets.length === len) {
				console.log('Create over.\n');
				

				setInterval(function () {
					client_sockets[0].emit('my_msg', '');
				}, interval_ms);
			}
		});

		socket.on('others_msg', function (data) {

		});
	})();
}

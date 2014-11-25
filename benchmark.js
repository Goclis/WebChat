var request = require('request');

var client_cookies = [];

var len = 100;

for (var i = 0; i < len; ++i) {
	request('http://localhost:3000', function (err, res, body) {
		if (!err && res.statusCode == 200) {
			client_cookies.push('id=' + res.headers['set-cookie'][0].split(';')[0].substr(3));

			if (client_cookies.length === len) {
				console.log(client_cookies);


				setInterval(function () {
					console.log('Go....!!!');

					// one send.
					request({
						url: 'http://localhost:3000/send',
						method: 'GET',
						headers: {
							'Cookie': client_cookies[0]
						},
						qs: {
							'msg': ''
						}
					}, function (err, res, body) {

					});

					// other recieved.
					for (var i = 1; i < client_cookies.length; ++i) {
						(function () {
							var k = i;
							request({
								url: 'http://localhost:3000/get',
								method: 'GET',
								headers: {
									'Cookie': client_cookies[k]
								}
							}, function (err, res, body) {

							});
						}) ();
					}
				}, 100);
			}
		}
	});
}


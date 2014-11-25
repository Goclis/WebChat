var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile('views/index.html', { encoding: 'utf-8' }, function (err, data) {
        if (err) {
            res.end('Error');
        } else {
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(data, 'utf-8');
        }
    });
});

var server_socket = io.listen(server);
server.listen(3000);


var client_list = [];
var nickname_list = ['A', 'B', 'C', 'D'];
server_socket.on('connection', function (client_socket) {
    var timestamp = new Date().getTime();
    client_socket.nickname = nickname_list[timestamp % 4] + ' ' + Math.round(timestamp / 1000000);
    client_list.push(client_socket);

    client_socket.on('my_msg', function (msg) {
        broadcast(msg, client_socket);
    });

    client_socket.on('disconnect', function () {
        var index = client_list.indexOf(client_socket);
        client_list.splice(index, 1);
    });
});

function broadcast(msg, client_socket) {
    for (var i = 0; i < client_list.length; ++i) {
        if (client_list[i] !== client_socket) {
            client_list[i].emit('others_msg', {
                nickname: client_socket.nickname,
                msg: msg
            });
        }
    }
}
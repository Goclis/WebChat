var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;

    console.log('Request for ' + pathname + ' received.');

    route(pathname, req, res);
});

function route (pathname, req, res) {
    if (pathname === '/static/jquery.mobile-1.3.2.min.css') {
        fs.readFile('statics/jquery.mobile-1.3.2.min.css', 
                { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                res.end('Error');
            } else {
                res.writeHead(200, {'content-type': 'text/css'});
                res.end(data, 'utf-8');
            }
        });
    } else if (pathname === '/static/jquery.mobile-1.3.2.min.js') {
        fs.readFile('statics/jquery.mobile-1.3.2.min.js', 
                { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                res.end('Error');
            } else {
                res.writeHead(200, {'content-type': 'application/x-javascript'});
                res.end(data, 'utf-8');
            }
        });
    } else if (pathname === '/static/jquery-1.8.3.min.js') {
        fs.readFile('statics/jquery-1.8.3.min.js', 
                { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                res.end('Error');
            } else {
                res.writeHead(200, {'content-type': 'application/x-javascript'});
                res.end(data, 'utf-8');
            }
        });
    } else if (pathname === '/favicon.icon') {
        res.end('No icon');
    } else {
        fs.readFile('views/index.html', { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                res.end('Error');
            } else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.end(data, 'utf-8');
            }
        });
    }
}

var server_socket = io.listen(server);
server.listen(3000);


var client_list = [];
var nickname_list = ['A', 'B', 'C', 'D'];
server_socket.on('connection', function (client_socket) {
    var timestamp = new Date().getTime();
    client_socket.nickname = nickname_list[timestamp % 4] + ' ' + Math.round(timestamp / 1000000);
    client_list.push(client_socket);

    client_socket.on('my_msg', function (msg, callback) {
        broadcast(msg, client_socket);
        callback('ok');
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
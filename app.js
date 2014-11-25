var http = require('http');
var fs = require('fs');
var url = require('url');
var Cookies = require('cookies');

var server = http.createServer(function (req, res) {
    route(req, res);
});

server.listen(3000);

var uids = {

};

function route (req, res) {
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url, true).query;

    console.log('Request for ' + pathname + ' received.');

    var cookies = new Cookies(req, res);

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
    } else if (pathname === '/send') {
        id = cookies.get('id');
        broadcast(query.msg, id);
        res.end('over');
    } else if (pathname === '/get') {
        id = cookies.get('id');
        res.writeHead(200, {'content-type': 'text/json'});
        res.end(JSON.stringify(uids[id].msgs), 'utf-8');
        uids[id].msgs = [];
    } else if (pathname === '/') {
        fs.readFile('views/index.html', { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                res.end('Error');
            } else {
                var new_id = new Date().getTime();
                cookies.set('id', new_id);
                uids[new_id] = {
                    'msgs': []
                };
                res.writeHead(200, {'content-type': 'text/html'});
                res.end(data, 'utf-8');
            }
        });
    } else {
        res.end('NOT FOUND');
    }
}

function broadcast (msg, id) {
    keys = Object.keys(uids);
    keys.forEach(function (element, index, array) {
        if (id !== element) {
            uids[element].msgs.push({'id': id, 'msg': msg});
        }
    });
}
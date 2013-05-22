var express = require('express')
        , app = express()
        , http = require('http')
        , server = http.createServer(app)
        , io = require('socket.io').listen(server)
        , push = require('pushover-notifications')
        , p = new push({
    user: '8p4j5FbxQGBPXJgKeDBej7xlxjcKp0',
    token: 'RfJBofJ2Abrt7e2OgOhCmG7M3ci3no',
});

server.listen(80);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

var usernames = {};
var offlinemessages = {};
var server_name = 'batuhan\'ın kalfası';

io.sockets.on('connection', function(socket) {

    socket.on('sendchat', function(data, to_phone) {
        if (socket.username === 'y' || 'b') {
            io.sockets.emit('updatechat', socket.username, data);
            if (to_phone || !usernames['b']) {
                if (!usernames['b']) {
                    offlinemessages[new Date().getTime()] = data;
                }
                p.send({
                    message: 'Yasemin dedi ki: ' + data,
                    title: "zamazingo"
                });
            }
        } else {
            socket.disconnect();
        }
    });

    socket.on('panic', function(data) {
        p.send({
            message: 'panik butonuna basıldı!',
            title: "zamazingo"
        });
        socket.broadcast.emit('updatechat', server_name, data);
        socket.disconnect();
    });

    socket.on('adduser', function(password) {
        if (password === 'fuckyoumum') {
            socket.username = 'y';
            usernames['y'] = 'y';
            socket.emit('updatechat', server_name, 'bağlandın yenge!');
            socket.emit('showstuff', 'dummy');
            socket.broadcast.emit('updatechat', server_name, ' sevgilin geldi patron.');
            io.sockets.emit('updateusers', usernames);
            p.send({
                message: 'Yasemin bağlandı.',
                title: "zamazingo"
            });
        } else if (password === '123ttym') {
            socket.username = 'b';
            usernames['b'] = 'b';
            socket.emit('updatechat', server_name, 'bağlandın patron!');
            socket.emit('showstuff', 'dummy');
            socket.broadcast.emit('updatechat', server_name, ' sevgilin geldi yenge.');
            io.sockets.emit('updateusers', usernames);
            for (var key in offlinemessages) {
                socket.emit('updatechat', 'y (çevrimdışı) (at ' + key + ')', offlinemessages[key]);
                delete offlinemessages[key];
            }

        } else {
            socket.broadcast.emit('updatechat', server_name, ' birileri giriş yapmayı denedi ama, bilemedim ki.');
            socket.emit('wrongpassword', 'buralar özel dedik');
            socket.username = 'o aptalı siktir ettik.';
            p.send({
                message: 'biri giriş denedi!',
                title: "zamazingo"
            });
            socket.disconnect();
        }
    });

    socket.on('disconnect', function() {
        if (socket.username === 'y' || 'b') {
            delete usernames[socket.username];
            socket.broadcast.emit('updatechat', server_name, socket.username + ' çıkış yaptı :(');
        }
    });
});
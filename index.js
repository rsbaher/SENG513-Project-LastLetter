//======================================================================================================================
// SERVER SET UP:

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 30000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

//======================================================================================================================
// GLOBAL VARIABLES:

var numberOfOnlineUsers = 0;

//======================================================================================================================
//SERVER SENDS MESSAGES TO A CLIENT:

function updateOnlineUsers(){
    io.emit('update-online-users',numberOfOnlineUsers);
}

//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){

    console.log("We have a new user");
    numberOfOnlineUsers++;
    updateOnlineUsers();

    socket.on('disconnect', function(){
        console.log("User disconnected");
        numberOfOnlineUsers--;
        updateOnlineUsers();

    });
});
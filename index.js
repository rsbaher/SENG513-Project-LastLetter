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

var gameFactory = require('./game-factory.js');

//======================================================================================================================
//SERVER SENDS MESSAGES TO A CLIENT:

function updateOnlineUsers(){
    io.emit('update-online-users',numberOfOnlineUsers);
}


//======================================================================================================================
// DATABASE CITIES CHECK



//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){

    console.log("We have a new user");



    const cities = require("all-the-cities");
    var input = 'Calgary';
    console.log(cities.filter(function(city) {
        return(city.name === (input));
    }));
    var gameObj = new gameFactory.GameObject([1],"cities", io);
    console.log(gameObj.category);





    socket.on('singleplayer-user-input', function(){

    });

    socket.on('disconnect', function(){
        console.log("User disconnected");
        numberOfOnlineUsers--;
        updateOnlineUsers();

    });
});
//======================================================================================================================
// SERVER SET UP:

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 30000;
var gameLogic = require('./singleplayer-game-logic.js');


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
// DATABASE CITIES CHECK



//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){
    gameLogic.test1();
    gameLogic.test2();

    console.log("We have a new user");
    numberOfOnlineUsers++;
    updateOnlineUsers();


    const cities = require("all-the-cities");
    var input = 'Calgary';
    console.log(cities.filter(function(city) {
        return(city.name.match(input));
    }));
    gameLogic.test();





    socket.on('singleplayer-user-input', function(){

    });

    socket.on('disconnect', function(){
        console.log("User disconnected");
        numberOfOnlineUsers--;
        updateOnlineUsers();

    });
});
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
var gameLogic = require('./game-logic.js');

//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){
    gameLogic.test1();
    gameLogic.test2();

    console.log("We have a new user");




    var gameObj = new gameFactory.GameObject([1],"cities", io);
    var inputStr = "Calgary";
    gameLogic.doLogic(gameObj, inputStr, io);





    socket.on('singleplayer-user-input', function(){

    });

    socket.on('disconnect', function(){
        console.log("User disconnected");
        numberOfOnlineUsers--;
        updateOnlineUsers();

    });
});
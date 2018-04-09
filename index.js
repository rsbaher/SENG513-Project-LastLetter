//======================================================================================================================
// SERVER SET UP:
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 30000;
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const dbAPI = require('./dbAPI');

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

//======================================================================================================================
// SET UP FIREBASE:

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://seng513-project-lastletter.firebaseio.com'
});

//======================================================================================================================
// GLOBAL VARIABLES:

var gameFactory = require('./game-factory.js');
var gameLogic = require('./game-logic.js');
var userConstructor = require('./user.js');


var onlineUsers = [];



//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

// TODO ask Marc if I have to move the following code somewhere after user is authenticated not on connection
// TODO add color
// TODO first parameter is name (name from database? how?)
io.on('connection', function(socket){

    console.log("We have a new user");

    //TODO tell the user from which letter to start
    socket.on('single-player-start-game',function(category){
        var userObj = new userConstructor.UserObject("someName", "someColor",socket.id);
        onlineUsers.push(userObj);
        var gameObj = new gameFactory.GameObject([userObj], category, socket);
        gameFactory.gameObjects.push(gameObj);
        gameLogic.updateCurrentLetter(gameObj.currentLetter, socket);

    });

    // TODO find game based on the socket
    socket.on('single-player-input', function(inputStr){
        var gameObj = gameFactory.returnGameObjBasedOnSocket(socket.id);
        gameLogic.doLogic(gameObj,inputStr,socket);
    });




    // User log in: Check if new or returning user
    socket.on('login', function(user) { dbAPI.registerUser(admin, socket, user); });

    // User data requested
    socket.on('get user', function(user) { dbAPI.getUser(admin, socket, user); });

    // User name change requested
    socket.on('new name', function(user, newName) { dbAPI.changeUserName(admin, user, newName, socket); });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });

    // On disconnection
    socket.on('disconnect', function(){
        console.log("User disconnected");
    });
});

//======================================================================================================================
// GLOBAL VARIABLES

let onlineUsers = new Map();// active users (email -> User)

//======================================================================================================================
// DEPENDENCIES

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 30000;
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

const dbAPI = require('./dbAPI');
const chatAPI = require('./chatAPI');
const gameFactory = require('./game-factory.js');
const gameLogic = require('./game-logic.js');
const userConstructor = require('./user.js');


//======================================================================================================================
// SERVER SETUP

http.listen( port, function () { console.log('listening on port', port); });

app.use(express.static(__dirname + '/public'));

//======================================================================================================================
// FIREBASE SERVER

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://seng513-project-lastletter.firebaseio.com'
});

//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){

    // User disconnected
    socket.on('disconnect', function() { console.log('User disconnected'); });

    // User log in: Register new users
    socket.on('login', function(user) {
        dbAPI.registerUser(admin, socket, user, onlineUsers);
        socket.emit('login');
    });

    // User starts a single player game
    socket.on('single-player-start-game',function(category, user) {
        let listOfPlayers = [ user ];
        const gameObj = new gameFactory.GameObject(listOfPlayers, category);
        gameFactory.gameObjects.set(user.email, gameObj);
        gameLogic.updateCurrentLetter(gameObj.currentLetter, socket);
    });

    // User sends an answer for a single player game
    socket.on('single-player-input', function(inputStr, user){
        const gameObj = gameFactory.returnGameObject(user);
        gameLogic.doLogic(gameObj, inputStr, socket, user);
    });

    // User log in: Check if new or returning user
    socket.on('login', function(user) { dbAPI.registerUser(admin, socket, user); });

    // User data requested
    socket.on('get user', function(user) { dbAPI.getUser(admin, socket, user); });

    // User name change requested
    socket.on('new name', function(user, newName) {
        if(dbAPI.changeUserName(admin, user, newName)) { socket.emit('new name', newName); }
    });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });

    // User logs out
    socket.on('logout', function(user) { chatAPI.removeUser(user, onlineUsers); });

    // User closes window
    socket.on('exit', function(user) { chatAPI.removeUser(user, onlineUsers); });

    // User sends a message to the chat
    socket.on('chat', function(user, message) { chatAPI.broadcastMessage(io, message, user.name, user.chatColor); });

    // User sends a message to another user during a game
    socket.on('message', function(user, message) { chatAPI.sendMessage(socket, message, user.name, user.chatColor); });
});
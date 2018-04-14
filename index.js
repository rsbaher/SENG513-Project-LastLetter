
//======================================================================================================================
// GLOBAL VARIABLES

var onlineUsers = new Map();// active users (email -> User)

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
const multiPlayerLogic = require('./multi-player-logic.js');

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

//====================================================================================================================
// GET MESSAGES FROM A CLIENT:

io.on('connection', function(socket){

    // TODO , find a user, get socket if available, set a new one

    //======================================================================================================================
    // DISCONNECT OR EXIT COMMUNICATION WITH A CLIENT:

    // User disconnected
    socket.on('disconnect', function() { console.log('User disconnected'); });
    // User logs out
    socket.on('logout', function(user) { chatAPI.removeUser(user, onlineUsers); });
    // User closes window
    socket.on('exit', function(user) { chatAPI.removeUser(user, onlineUsers); });


    //===========================================================================================================
    // LOGIN COMMUNICATION WITH A CLIENT:

    // User log in: Register new users
    socket.on('login', function(user) {
        dbAPI.registerUser(admin, socket, user, onlineUsers);
        socket.emit('login');
    });

    //==========================================================================================================
    // SINGLE - PLAYER: LISTEN TO A CLIENT:

    socket.on('single-player-start-game',function(categoryStr, user) {
        let listOfPlayers = [ user ];
        let gameObj = new gameFactory.GameObject(listOfPlayers, categoryStr);
        gameFactory.gameObjects.set(user.email, gameObj);
        gameLogic.updateCurrentLetterSinglePlayer(gameObj.currentLetter, socket);
        gameLogic.updateCurrentScoreSinglePlayer(gameObj.score, socket);
    });

    socket.on('single-player-input', function(inputStr, user){
        let gameObj = gameFactory.returnGameObject(user);
        gameLogic.doLogic(gameObj, inputStr, socket, user);
    });

    socket.on('delete-single-player-game', function (user){
        gameFactory.gameObjects.delete(user);
    });

    //==========================================================================================================
    // MULTI=PLAYER:

    socket.on('multiplayer-delete-me-from-wait-list', function(){
        multiPlayerLogic.removeSocketFromWaitList(socket);
    });

    socket.on('add-me-to-wait-list-or-give-a-player', function(user, categoryStr){
        let listOfPlayers = multiPlayerLogic.addMeToTheListOrGiveAPlayer(socket, user, categoryStr);
        if (listOfPlayers.length > 0){
            let gameObj = new gameFactory.GameObject(listOfPlayers, categoryStr);

            let socket1 = listOfPlayers[0].socket;
            let socket2 = listOfPlayers[1].socket;

            gameLogic.updateCurrentScoreMultiPlayer(gameObj.score, socket1 );
            gameLogic.updateCurrentLetterSinglePlayer(gameObj.currentLetter, socket1);

            gameLogic.updateCurrentScoreMultiPlayer(gameObj.score, socket2 );
            gameLogic.updateCurrentLetterSinglePlayer(gameObj.currentLetter, socket2);
        }
    });

    //==========================================================================================================
    // DATA BASE COMMUNICATION WITH THE CLIENT:

    // User data requested
    socket.on('get user', function(user) { dbAPI.getUser(admin, socket, user); });

    // User name change requested
    socket.on('new name', function(user, name) { dbAPI.changeUserName(admin, user, name, socket); });

    //User color change requested
    socket.on('new color', function(user, color) { dbAPI.changeUserColor(admin, user, color, socket) });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });



    //==========================================================================================================
    // CHAT COMMUNICATION WITH A CLIENT:

    // User sends a message to the chat
    socket.on('chat', function(user, message) {
        chatAPI.broadcastMessage(io, message, user.name, user.chatColor);
    });

    // User sends a message to another user during a game
    socket.on('message', function(user, message) {
        chatAPI.sendMessage(socket, message, user.name, user.chatColor);
    });


    //===============================================================================================================
    // COOKIES:

    



});
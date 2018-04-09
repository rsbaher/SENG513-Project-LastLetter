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

//======================================================================================================================
// SERVER SETUP

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

//======================================================================================================================
// FIREBASE SERVER

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://seng513-project-lastletter.firebaseio.com'
});

//======================================================================================================================
// WEB SOCKET EVENTS

// User connected
io.on('connection', function(socket){
    console.log('New user connected');

    // User disconnected
    socket.on('disconnect', function() { console.log('User disconnected'); });

    // User log in: Register new users
    socket.on('login', function(user) {
        dbAPI.registerUser(admin, socket, user);
        socket.emit('login');
    });

    // Track users on server
    socket.on('add user', function(user) { chatAPI.addUser(user); });

    // User data requested
    socket.on('get user', function(user) { dbAPI.getUser(admin, socket, user); });

    // User name change requested
    socket.on('new name', function(user, newName) {
        if(dbAPI.changeUserName(admin, user, newName)) { socket.emit('new name', newName); }
    });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });

    // User logs out
    socket.on('logout', function(user) { console.log('User logged out'); chatAPI.removeUser(user); });

    // User closes window
    socket.on('exit', function(user) { console.log('User exited'); chatAPI.removeUser(user); });

    // User sends a message to the chat
    socket.on('chat', function(user, message) { chatAPI.broadcastMessage(io, message, user.name, user.chatColor); });

    // User sends a message to another user during a game
    socket.on('message', function(user, message) { chatAPI.sendMessage(socket, message, user.name, user.chatColor); });
});

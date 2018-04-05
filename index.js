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

var numberOfOnlineUsers = 0;

//======================================================================================================================
//SERVER SENDS MESSAGES TO A CLIENT:

function updateOnlineUsers(){
    io.emit('update-online-users',numberOfOnlineUsers);
}

//======================================================================================================================
//SERVER LISTENS TO A CLIENT:

io.on('connection', function(socket){

    console.log('We have a new user');
    numberOfOnlineUsers++;
    updateOnlineUsers();

    socket.on('disconnect', function(){
        console.log('User disconnected');
        numberOfOnlineUsers--;
        updateOnlineUsers();

    });

    // User log in: Check if new or returning user
    socket.on('login', function(user) { dbAPI.registerUser(admin, socket, user); });

    // User data requested
    socket.on('get user', function(user) { dbAPI.getUser(admin, socket, user); });

    // User name change requested
    socket.on('new name', function(user, newName) { dbAPI.changeUserName(admin, user, newName, socket); });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });
});

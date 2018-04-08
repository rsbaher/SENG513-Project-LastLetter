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
    socket.on('disconnect', function(){ console.log('User disconnected'); });

    // User log in: Register new users TODO adjust for new html structure
    socket.on('login', function(user) {
        dbAPI.registerUser(admin, socket, user);
        chatAPI.addUser(dbAPI.getUser(admin, socket, user));
        socket.emit('login');
    });

    // User data requested
    socket.on('get user', function(user) {
        let result = dbAPI.getUser(admin, socket, user);
        if(result != null) { socket.emit('get user', result); }
    });

    // User name change requested
    socket.on('new name', function(user, newName) {
        if(dbAPI.changeUserName(admin, user, newName)) { socket.emit('new name', newName); }
    });

    // Leaderboard data requested
    socket.on('get leaderboard', function() { dbAPI.getLeaderboard(admin, socket); });

    // User logs out
    socket.on('logout', function(user) { console.log('User logged out: ' + user.name); });

    // User closes window
    socket.on('exit', function(user) { console.log('User closed window: ' + user.name); });
});

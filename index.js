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
const chatAPI = require('./chatAPI');

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

// User connected
io.on('connection', function(socket){
    console.log('New user connected');

    // User disconnected
    socket.on('disconnect', function(){ console.log('User disconnected'); });

    // User log in: Register new users TODO adjust for new html structure
    socket.on('login', function(user) {
        if (dbAPI.registerUser(admin, socket, user)) {
            socket.emit('login', '/home.html');
            chatAPI.addUser(dbAPI.getUser(admin, socket, user));
        }
    });

    // User data requested
    socket.on('get user', function(user) {
        let result = dbAPI.getUser(admin, socket, user);
        if(result != null) { socket.emit('get user', result); }
    });

    // User name change requested
    socket.on('new name', function(user, newName) {
        if(dbAPI.changeUserName(admin, user, newName, socket)) { socket.emit('new name', newName); }
    });

    // Leaderboard data requested
    socket.on('get leaderboard', function() {
        let result = dbAPI.getLeaderboard(admin, socket);
        // TODO send the whole thing instead of each entry individually
        result.forEach(function(doc) { socket.emit('get leaderboard', doc.data()); });
    });

    // User logs out
    socket.on('logout', function(user) { console.log('User logged out: ' + user.name); });

    // User closes window
    socket.on('exit', function(user) { console.log('User closed window: ' + user.name); });
});

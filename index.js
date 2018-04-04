//======================================================================================================================
// SERVER SET UP:
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 30000;
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

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
    socket.on('login', function(user) {

        // Query DB for user by email
        const ref = admin.firestore().collection('users').doc(user.email);
        ref.get().then(function(doc) {

            // User is not yet registered
            if(!doc.exists) {

                // Register user
                admin.firestore().collection('users').doc(user.email).set({
                    email: user.email,      // Email = Key
                    name: user.displayName, // Username
                    singleHighScore: 0,     // Single player high score
                    multiHighScore: 0,      // Multi player high score
                    chatColor: '#ffffff',   // Chat message color
                    imageLink: null,        // User profile image URL
                    gameInProgress: false,  // Is the user in a game right now?
                    savedGame: null         // Previously saved single player game
                })
                    // Success: redirect to home page
                    .then(function() { console.log('Success: ' + user.email + ' registered.'); })

                    // Error
                    .catch(function(error) { console.error('Error: ', error); });
            }

            // Login done, redirect to home page
            socket.emit('login', '/home.html');
        });
    });

    // User data requested
    socket.on('get user', function(user) {

        // Get reference to user in DB and fetch data
        const ref = admin.firestore().collection('users').doc(user.email);
        ref.get()

            // Success: Send user data
            .then(function(doc) { socket.emit('get user', doc.data()); })

            // Error
            .catch(function(error) { console.error("Error: ", error); });
    });

    // User name change requested
    socket.on('new name', function(user, newName) {

        // Get reference to user in DB and update it
        const ref = admin.firestore().collection('users').doc(user.email);
        let data = {
            email: user.email,                      // Email = Key
            name: newName,                          // New username
            singleHighScore: user.singleHighScore,  // Single player high score
            multiHighScore: user.multiHighScore,    // Multi player high score
            chatColor: user.chatColor,              // Chat message color
            imageLink: user.imageLink,              // User profile image URL
            gameInProgress: user.gameInProgress,    // Is the user in a game right now?
            savedGame: user.savedGame               // Previously saved single player game
        };
        ref.set(data)

            // Success
            .then(function () { socket.emit('new name', newName); })

            // Error
            .catch(function(error) { console.error('Error: ', error); });
    });

    // Leaderboard data requested
    socket.on('get leaderboard', function() {

        // Get top 10 user scores from DB
        admin.firestore().collection('users')
            .orderBy('singleHighScore', 'desc')
            .limit(10)
            .get()

            // Success: Send each leaderboard entry to the client
            // TODO send the whole thing instead of each entry individually
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) { socket.emit('get leaderboard', doc.data()); });
            })

            // Error
            .catch(function(error) { console.error("Error: ", error) });
    })
});

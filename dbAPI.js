module.exports = {

    /**
     * Register new users in the DB
     */
    registerUser: function(admin, socket, user) {

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
                    chatColor: '#000000',   // Chat message color
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
            socket.emit('login');
        });
    },

    /**
     * Get a user from the DB
     */
    getUser: function(admin, socket, user) {

        // Get reference to user in DB and fetch data
        const ref = admin.firestore().collection('users').doc(user.email);
        ref.get()

            // Success: Send user data
            .then(function(doc) { socket.emit('get user', doc.data()); })

            // Error
            .catch(function(error) { console.error("Error: ", error); });
    },

    /**
     * Change a user's name in the DB
     */
    changeUserName: function(admin, user, newName, socket) {

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
    },

    /**
     * Get the top 10 players for single and multiplayer from the DB
     */
    getLeaderboard: function(admin, socket) {
        sendLeaderboardEntries(admin, socket, 'singleHighScore');
        sendLeaderboardEntries(admin, socket, 'multiHighScore');
    }
};

/**
 * Send leaderboard entries for a specified leaderboard
 * @param admin for firebase
 * @param socket to send entries to
 * @param score to send entries for ('singleHighScore' or 'multiHighScore')
 */
function sendLeaderboardEntries(admin, socket, score) {

    console.log('Getting ' + score);

    // Get top 10 user scores from DB
    admin.firestore().collection('users')
        .orderBy(score, 'desc')
        .limit(10)
        .get()

        // Success: Send each leaderboard entry to the client
        // TODO send the whole thing instead of each entry individually
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) { socket.emit('get leaderboard', score === 'singleHighScore', doc.data()); });
        })

        // Error
        .catch(function(error) { console.error("Error: ", error) });
}
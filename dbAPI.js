module.exports = {

    /**
     * Register new users in the DB
     */
    registerUser: function(admin, socket, user, users) {

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

                    socket: JSON.stringify(socket),
                    savedGame: null         // Previously saved single player game

                })
                    // Success
                    .then(function() { users.set(user.email, user); })

                    // Error
                    .catch(function(error) { console.error('Error: ', error); });
            }
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
            .catch(function(error) { console.error("Error: ", error); return null; });
    },

    /**
     * Change a user's name in the DB
     */
    changeUserName: function(admin, user, newName, socket) {


        updateProperty(admin, user, 'name', newName, socket, 'new name');

    },

    /**
     * Change a user's color in the DB
     */
    changeUserColor: function(admin, user, newColor, socket) {

        updateProperty(admin, user, 'chatColor', '#' + newColor, socket, 'new color');

    },


    
   


    /**
     * Get the top 10 players for single and multi player from the DB
     */
    getLeaderboard: function(admin, socket) {
        sendLeaderboardEntries(admin, socket, 'singleHighScore');
        sendLeaderboardEntries(admin, socket, 'multiHighScore');
    },

    /**
     * Update a player's single player high score if necessary
     */
    updateSinglePlayerHighScore: function(admin, user, newScore) {
        if (newScore > user.singleHighScore) {
            updateProperty(admin, user, 'singleHighScore', newScore);
        }
    },

    /**
     * Update a player's saved single player game
     */
    updateSinglePlayerGame: function(admin, user, game, socket) {
        updateProperty(admin, user, 'savedGame', JSON.stringify(game), socket, 'save-single-player-game');
    }
};

/**
 * Send leaderboard entries for a specified leaderboard
 * @param admin for firebase
 * @param socket to send entries to
 * @param score to send entries for ('singleHighScore' or 'multiHighScore')
 */
function sendLeaderboardEntries(admin, socket, score) {

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

/**
 * Update a user's property in the DB
 * @param admin for firebase
 * @param user to update
 * @param property to update
 * @param updatedValue to insert
 * @param socket to inform on success
 * @param event to send on to socket
 */
function updateProperty(admin, user, property, updatedValue, socket, event) {

    console.log("Updating ", property, ": ", updatedValue);

    // Get reference to user in DB
    const ref = admin.firestore().collection('users').doc(user.email);

    // Update the specified property and inform client if necessary
    let data = {};
    data[property] = updatedValue;
    ref.update(data)
        .then(function() { if (socket !== undefined) { socket.emit(event, updatedValue); } })
        .catch(function(error) { console.error('Error: ' + error); });
}

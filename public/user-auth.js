let googleUser = null;      // The google user account
let dbUserObject = null;    // JSON Object representing the user's DB entry

// Set user variable on login & logout
firebase.auth().onAuthStateChanged(function(user) {

    // Login
    if(user) {
        googleUser = user;
        socket.emit('get user', googleUser);
    }

    //Logout
    else {
        googleUser = null;
        dbUserObject = null;
    }
});

// When window loads, let user sign in or redirect them to home page
window.onload = function() {

    initProfile();
    initUserAuth();
    loadLoginPage();

    // If user is already signed in, show home page
    if (firebase.auth().currentUser != null) {

        //initLeaderboard();
        console.log('User already signed in');
        // TODO hide login stuff, show home screen stuff
    }

    // Else show login page
    else {
        console.log('No user signed in yet');
    }
};

/**
 * Initialize User Authentication
 * Assigns a handler to the login button
 */
function initUserAuth() {
    document.getElementById("login-button-header").addEventListener('click', signIn, false);
    document.getElementById("login-button-unauthorized-user-container").addEventListener('click', signIn, false);

}

/**
 * Login with Google
 */
function signIn() {

    // No user is logged in
    if (firebase.auth().currentUser == null) {
        console.log('User is signing in');

        // Sign in with Google via Popup
        const google = new firebase.auth.GoogleAuthProvider();
        google.addScope('https://www.googleapis.com/auth/contacts.readonly');

        // Google popup sign up
        firebase.auth().signInWithPopup(google)

            // Success: register user
            .then(function (result) {
                googleUser = result.user;
                socket.emit('login', googleUser);
            })

            // Error
            .catch(function (error) {
                console.log('Error: ' + error);
                document.getElementById('login-button-header').disabled = false;
            });
    }

    // If a user is already signed in at this point, just redirect them
    else {
        googleUser = firebase.auth().currentUser;
        console.log('Cannot sign in, user is already signed in');
        // TODO show home screen
    }

    // Disable login button while sign-in popup is open
    document.getElementById('login-button-header').disabled = true;
}

/**
 * Initialize home page
 */
function initProfile() {
    console.log('setting up logout button');
    document.getElementById('log-out-button-header').addEventListener('click', logout, false);
    //document.getElementById('editNameBtn').disabled = true;
}

/**
 * Initialize the leaderboard
 */
// function initLeaderboard() {
//     $('#leaderboard').empty();      // Clear leaderboard
//     socket.emit('get leaderboard'); // Get leaderboard from db via server
// }

/**
 * Set up home page with user info
 * @param name of the active user
 * @param highscore of active user in single player mode
 */
// function setupHomePage(name, highscore) {
//     document.getElementById('name').innerText = name;
//     document.getElementById('score').innerText = highscore;
//     document.getElementById('editNameBtn').addEventListener('click', editUsername, false)
//     document.getElementById('editNameBtn').disabled = false;
// }

/**
 * Log user out
 */
function logout() {
    if (firebase.auth().currentUser != null) {
        firebase.auth().signOut();
        console.log('User signed out');
        document.getElementById('login-button-header').disabled = false;

    } else {
        console.log('Cannot sign out, no user is logged in');
    }
}

/**
 * We want  users to be able to change their username
 * TODO only change name if no other user has chosen that name
 */
// function editUsername() {
//
//     // Prompt user for new name
//     let newName = prompt('Please enter your new name', dbUserObject.name);
//
//     // Request name change from server
//     if (newName !== '') { socket.emit('new name', dbUserObject, newName); }
// }

//////////////////////////////////////////////////////////
// SOCKET EVENTS
//////////////////////////////////////////////////////////

// When login is done, redirect to given page
socket.on('login', function() { console.log('User signed in'); });

// Server sends user data, set up home page
socket.on('get user', function(obj) {
    dbUserObject = obj;
    //setupHomePage(obj.name, obj.singleHighScore);
});

// Server successfully updated user name in DB
// socket.on('new name', function(newName) {
//     googleUser.displayName = newName;
//     document.getElementById('name').innerText = newName;
//     dbUserObject.name = newName;
//     initLeaderboard();
// });

// Server is sending a leaderboard entry
// socket.on('get leaderboard', function(leaderboardEntry) {
//     let userName = leaderboardEntry.name;
//     let userScore = leaderboardEntry.singleHighScore;
//     $('#leaderboard').append('<li>' + userName + ': ' + userScore + '</li>');
// });
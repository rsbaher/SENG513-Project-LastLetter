//======================================================================================================================
//FIREBASE INIT:
// FIREBASE

const config = {
    apiKey: "AIzaSyCuhMqPaI2QCFxZCbvp1hOcduf3w0vSyK0",
    authDomain: "seng513-project-lastletter.firebaseapp.com",
    databaseURL: "https://seng513-project-lastletter.firebaseio.com",
    projectId: "seng513-project-lastletter",
    storageBucket: "seng513-project-lastletter.appspot.com",
    messagingSenderId: "4582407151"
};
firebase.initializeApp(config);

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

//==================================================================================================================
// GENERAL SET UP

const socket = io();        // Web socket
let googleUser = null;      // The google user account
let dbUserObject = null;    // JSON Object representing the user's DB entry

//=================================================================================================================
// COOKIES

/**
 * Return available cookies
 */
// function returnCookies() { console.log("TODO return cookies"); }

/**
 * Save a cookie
 * @param name of cookie to save
 */
//function setCookies(name) {
//  Cookies.set('cookieNickNameStr', name ,{ path: '' });
//}

//======================================================================================================================
// ON LOAD

// When window loads, let user sign in or redirect them to home page
window.onload = function() {

    // TODO fix this mess

    initProfile();
    initUserAuth();
    loadLoginPage();
    initLeaderboard();

    // User is already signed in
    if (firebase.auth().currentUser != null) {
        document.getElementById('login-button-header').disabled = true;
        document.getElementById('log-out-button-header').disabled = false;
        loadHomePage();
    }

    // No user is signed in
    else {
        document.getElementById('login-button-header').disabled = false;
        document.getElementById('log-out-button-header').disabled = true;
        loadLoginPage();
    }
};

//======================================================================================================================
// FUNCTIONS

/**
 * Initialize User Authentication
 * Assigns a handler to the login buttons
 */
function initUserAuth() {
    document.getElementById("login-button-header").addEventListener('click', signIn, false);
    document.getElementById("login-button-unauthorized-user-container").addEventListener('click', signIn, false);
}

/**
 * Login with Google
 */
function signIn() {

    // Disable login button while sign-in popup is open
    document.getElementById('login-button-header').disabled = true;

    // No user is logged in
    if (firebase.auth().currentUser == null) {

        // Sign in with Google via Popup
        const google = new firebase.auth.GoogleAuthProvider();
        google.addScope('https://www.googleapis.com/auth/contacts.readonly');

        // Google popup sign up
        firebase.auth().signInWithPopup(google)

            // Success: register user
            .then(function (result) {
                googleUser = result.user;
                socket.emit('login', googleUser);
                loadHomePage();
            })

            // Error
            .catch(function (error) {
                console.log('Error: ' + error);
                document.getElementById('login-button-header').disabled = false;
                document.getElementById('log-out-button-header').disabled = true;
            });
    }

    // A user is already signed in
    else {
        googleUser = firebase.auth().currentUser;
        // TODO show home screen
    }
}

/**
 * Initialize profile page
 */
function initProfile() {
    document.getElementById('log-out-button-header').addEventListener('click', logout, false);
    //document.getElementById('editNameBtn').disabled = true;
}

/**
 * Initialize the leaderboard
 */
function initLeaderboard() {
    $('#singleplayer-leaderboard').empty();
    $('#multiplayer-leaderboard').empty();
    socket.emit('get leaderboard');
}

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
        document.getElementById('login-button-header').disabled = false;
        document.getElementById('log-out-button-header').disabled = true;
        loadLoginPage();
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

//======================================================================================================================
// SOCKET EVENTS

// When login is done, redirect to given page
socket.on('login', function() {
    document.getElementById('login-button-header').disabled = true;
    document.getElementById('log-out-button-header').disabled = false;
});

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
socket.on('get leaderboard', function(single, leaderboardEntry) {
    let userName = leaderboardEntry.name;
    let userScoreSingle = leaderboardEntry.singleHighScore;
    let userScoreMulti = leaderboardEntry.multiHighScore;

    // Update the appropriate leaderboard
    if (single) { $('#singleplayer-leaderboard').append('<li>' + userName + ': ' + userScoreSingle + '</li>'); }
    else { $('#multiplayer-leaderboard').append('<li>' + userName + ': ' + userScoreMulti + '</li>'); }
});
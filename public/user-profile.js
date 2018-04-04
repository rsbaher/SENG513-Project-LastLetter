// JSON Object representing the user's DB entry
let dbUserObject = null;

// User logged in or out
firebase.auth().onAuthStateChanged(function(activeUser) {

    // On login, get user data from DB and initialize home page
    if(activeUser) {
        user = activeUser;
        socket.emit('get user', user);
    }

    // On logout, redirect user to index.html
    else {
        user = null;
        dbUserObject = null;
        window.location.href = '/index.html';
    }
});

// Initialize page when it loads
// TODO move window.onload into a separate init script
window.onload = function() {
    initProfile();
    initLeaderboard();
};

/**
 * Initialize home page
 */
function initProfile() {
    document.getElementById('logoutBtn').addEventListener('click', logout, false);
    document.getElementById('editNameBtn').disabled = true;
}

/**
 * Initialize the leaderboard
 */
function initLeaderboard() {

    // Clear leaderboard
    $('#leaderboard').empty();

    // Get leaderboard from db via server
    socket.emit('get leaderboard');
}

/**
 * Set up home page with user info
 * @param name of the active user
 * @param highscore of active user in single player mode
 */
function setupHomePage(name, highscore) {
    document.getElementById('name').innerText = name;
    document.getElementById('score').innerText = highscore;
    document.getElementById('editNameBtn').addEventListener('click', editUsername, false)
    document.getElementById('editNameBtn').disabled = false;
}

/**
 * Log user out
 */
function logout() { firebase.auth().signOut(); }

/**
 * We want  users to be able to change their username
 * TODO only change name if no other user has chosen that name
 */
function editUsername() {

    // Prompt user for new name
    let newName = prompt('Please enter your new name', dbUserObject.name);

    // Request name change from server
    if (newName !== '') { socket.emit('new name', dbUserObject, newName); }
}

// Server sends user data, set up home page
socket.on('get user', function(obj) {
    dbUserObject = obj;
    setupHomePage(obj.name, obj.singleHighScore);
});

// Server successfully updated user name in DB
socket.on('new name', function(newName) {
    user.displayName = newName;
    document.getElementById('name').innerText = newName;
    dbUserObject.name = newName;
    // TODO update name if its in leaderboard
});

// Server is sending a leaderboard entry
socket.on('get leaderboard', function(leaderboardEntry) {
    let userName = leaderboardEntry.name;
    let userScore = leaderboardEntry.singleHighScore;
    $('#leaderboard').append('<li>' + userName + ': ' + userScore + '</li>');
});
let googleUser = null;            // The google user account
let dbUserObject = null;    // JSON Object representing the user's DB entry

// Set user variable on login & logout
firebase.auth().onAuthStateChanged(function(user) {

    // Login
    if(user) {
        googleUser = user;
        socket.emit('get user', googleUser);
    }

    // Logout
    else {
        googleUser = null;
        dbUserObject = null;
        socket.emit('logout', dbUserObject);
        window.location.href = '/index.html';
    }
});

// When window loads, let user sign in or redirect them to home page
window.onload = function() {

    // If index.html was loaded and a user is already signed in, redirect them
    if (window.location.href === '/user-auth.html' && firebase.auth().currentUser != null) {
        window.location.href = '/home.html';
    }

    // Else initialize user authentication
    else { initUserAuth(); }
};

/**
 * Initialize User Authentication
 * Assigns a handler to the login button
 */
function initUserAuth() {
    document.getElementById('loginWithGoogleBtn').addEventListener('click', signIn, false);
}

/**
 * Login with Google
 */
function signIn() {

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
            })

            // Error
            .catch(function (error) {
                console.log('Error: ' + error);
                document.getElementById('loginWithGoogleBtn').disabled = false;
            });
    }

    // If a user is already signed in at this point, just redirect them
    else {
        googleUser = firebase.auth().currentUser;
        window.location.href = '/home.html';
    }

    // Disable login button while sign-in popup is open
    document.getElementById('loginWithGoogleBtn').disabled = true;
}

// When login is done, redirect to given page
socket.on('login', function(url) { window.location.href = url; });

// When user closes window, let server know
window.onbeforeunload = function() { socket.emit('exit', googleUser); };
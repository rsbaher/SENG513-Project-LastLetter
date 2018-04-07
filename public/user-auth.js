// The google user account
let user = null;

// Set user variable on login & logout
firebase.auth().onAuthStateChanged(function(user) {
    if(user) { this.user = user; }
    else { this.user = null; }
});

// When window loads, let user sign in or redirect them to home page
window.onload = function() {
    loadLoginPage();
    // If index.html was loaded and a user is already signed in, redirect them
    if (firebase.auth().currentUser != null) {
        console.log('User already signed in');
        // TODO hide login stuff, show home screen stuff
    }

    // Else initialize user authentication
    else { initUserAuth(); }
};

/**
 * Initialize User Authentication
 * Assigns a handler to the login button
 */
function initUserAuth() {
    console.log('test');
    document.getElementById("login-button-header").addEventListener('click', signIn, false);
    document.getElementById("login-button-unauthorized-user-container").addEventListener('click', signIn, false);

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
                user = result.user;
                socket.emit('login', user);
            })

            // Error
            .catch(function (error) {
                console.log('Error: ' + error);
                document.getElementById('loginWithGoogleBtn').disabled = false;
            });
    }

    // If a user is already signed in at this point, just redirect them
    else {
        user = firebase.auth().currentUser;
        window.location.href = '/home.html';
    }

    // Disable login button while sign-in popup is open
    document.getElementById('loginWithGoogleBtn').disabled = true;
}

// When login is done, redirect to given page
socket.on('login', function(url) { window.location.href = url; });
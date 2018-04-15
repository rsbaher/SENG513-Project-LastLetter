
//===============================================================================================================
// LOAD LOGIN PAGE:
/**
 * Display the login page
 */
function loadLoginPage() {
    $('.home').hide();
    $('.authorized').hide();
    $('.profile').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.wait-for-players').hide();

    $('#everything').show();
    $('.default').show();
    $('.unauthorized').show();

    // Set up login and logout buttons
    $("#login-button-header").on('click', signIn);
    $("#login-button-unauthorized-user-container").on('click', signIn);

    $('#login-button-header').prop('disabled', false);
    $('#log-out-button-header').prop('disabled', true);
}


//===============================================================================================================
// LOGIN WITH GOOGLE:

/**
 * Login with Google
 */
function signIn() {

    // Disable login button while sign-in popup is open
    document.getElementById('login-button-header').disabled = true;

    // No user is logged in
    if (firebase.auth().currentUser === null) {

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
                loadLoginPage();
            });
    }

    // A user is already signed in
    else {
        googleUser = firebase.auth().currentUser;
        loadHomePage();
    }
}

//==============================================================================================================

// On successful login, display home page
//socket.on('login', function () {  });

// Server sends user data
socket.on('get user', function(obj) {
    dbUserObject = obj;
    loadHomePage();
});
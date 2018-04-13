//==================================================================================================================
// GLOBAL VARIABLES

let googleUser = null;      // The google user account
let dbUserObject = null;    // JSON Object representing the user's DB entry
let category = null;        // The chosen game category
const socket = io();        // Web socket

// Wrap everything else in JQuery
$(function() {

//======================================================================================================================
// FIREBASE

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyCuhMqPaI2QCFxZCbvp1hOcduf3w0vSyK0",
        authDomain: "seng513-project-lastletter.firebaseapp.com",
        databaseURL: "https://seng513-project-lastletter.firebaseio.com",
        projectId: "seng513-project-lastletter",
        storageBucket: "seng513-project-lastletter.appspot.com",
        messagingSenderId: "4582407151"
    };
    firebase.initializeApp(config);

    // Load appropriate page depending on user auth status
    if (firebase.auth().currentUser === null) { loadLoginPage(); }
    else { loadHomePage(); }

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
// ON WINDOW CLOSE

    // TODO what if user opens window in two tabs???
    // TODO authorized user is on home page, he opens another link in his browser,
    // TODO then comes back, he sees a login page, but should see a page from which he left a game

    window.onbeforeunload = function() { socket.emit('exit', dbUserObject); };
});
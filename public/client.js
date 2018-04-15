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


    checkUserStatus();


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

    /**
     * Load appropriate page depending on user auth status
     */
    function checkUserStatus() {
        if (firebase.auth().currentUser === null) { loadLoginPage(); }
        else { loadHomePage(); }
    }

//=================================================================================================================
// COOKIES

    function returnCookiesEmail() {
        console.log(Cookies.get());
        socket.emit('receive-cookies-email', Cookies.get("email"));
    }

    socket.on('return-cookies-email', function () {
        returnCookiesEmail();
    });

    function setCookiesEmail(value) {
        Cookies.set("email", value ,{ path: '' });
    }

    socket.on('set-cookies-email', function (value) {
        setCookiesEmail(value);
    });

//======================================================================================================================
// ON WINDOW LOAD AND CLOSE

    window.onload = function() { checkUserStatus(); };
    window.onbeforeunload = function() { socket.emit('exit', dbUserObject); };
});
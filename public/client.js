// Wrap everything in JQuery
$(function() {

//==================================================================================================================
// GENERAL SET UP

    let googleUser = null;      // The google user account
    let dbUserObject = null;    // JSON Object representing the user's DB entry
    let category = null;        // The chosen game category

    // Web socket
    const socket = io();

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

    // Set up login and logout buttons
    document.getElementById("login-button-header").addEventListener('click', signIn, false);
    document.getElementById("login-button-unauthorized-user-container").addEventListener('click', signIn, false);
    document.getElementById('log-out-button-header').addEventListener('click', logout, false);

    // Set up navigation buttons
    document.getElementById('my-profile-button-header').addEventListener('click', loadMyProfilePage, false);
    document.getElementById('back-to-home-button-1').addEventListener('click', loadHomePage, false);
    document.getElementById('back-to-home-button-2').addEventListener('click', loadHomePage, false);
    document.getElementById('back-to-home-button-3').addEventListener('click', loadHomePage, false);

    // Set up edit username button
    //document.getElementById('editNameBtn').disabled = true;

    // Set up category and play mode buttons
    let citiesCategoryButton = document.getElementById('cities-button');
    let countriesCategoryButton = document.getElementById('countries-button');
    citiesCategoryButton.addEventListener('click', setCategoryCities, false);
    countriesCategoryButton.addEventListener('click', setCategoryCountries, false);
    let singlePlayerButton = document.getElementById('single-player-button');
    let multiPlayerButton = document.getElementById('multi-player-button');
    singlePlayerButton.addEventListener('click', startSinglePlayerGame, false);
    multiPlayerButton.addEventListener('click', startMultiPlayerGame, false);
    singlePlayerButton.disabled = true;
    multiPlayerButton.disabled = true;

    // Set up chat by assigning a form submit handler
    $('#chat-form').submit(function() {
        let m = $('#m');
        socket.emit('chat', dbUserObject, m.val());
        m.val('');
        m.focus().select();
        return false;
    });

    // Set up single player input by assigning a form submit handler
    $('#single-player-form').submit(function() {
        let m = $('#single-player-input');
        socket.emit('single-player-input', m.val(), dbUserObject);
        m.val('');
        m.focus().select();
        return false;
    });

    // Set up multi player input by assigning a form submit handler
    $('#multi-player-form').submit(function() {
        let m = $('#multi-player-input');
        socket.emit('multi-player-input', m.val(), dbUserObject);
        m.val('');
        m.focus().select();
        return false;
    });

    // Set up leaderboard
    $('#singleplayer-leaderboard').empty();
    $('#multiplayer-leaderboard').empty();
    socket.emit('get leaderboard');

    // Load appropriate page depending on user auth status
    if (firebase.auth().currentUser === null) { loadLoginPage(); }
    else { loadHomePage(); }

//======================================================================================================================
// FIREBASE

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

//======================================================================================================================
// FUNCTIONS

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

    /**
     * Log user out
     */
    function logout() {
        if (firebase.auth().currentUser != null) {
            firebase.auth().signOut();
            document.getElementById('login-button-header').disabled = false;
            document.getElementById('log-out-button-header').disabled = true;
            socket.emit('logout', dbUserObject);
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

    /**
     * Set category based on clicked button
     */
    function setCategoryCities() { setCategory('cities'); }
    function setCategoryCountries() { setCategory('countries'); }
    function setCategory(choice) {
        category = choice;
        singlePlayerButton.disabled = false;
        multiPlayerButton.disabled = false;
    }

    /**
     * Display the home page
     */
    function loadHomePage() {
        $('.unauthorized').hide();
        $('.profile').hide();
        $('.multi-player').hide();
        $('.single-player').hide();
        $('.default').show();
        $('.authorized').show();
        $('.home').show();

        document.getElementById('login-button-header').disabled = true;
        document.getElementById('log-out-button-header').disabled = false;
    }

    /**
     * Display the login page
     */
    function loadLoginPage() {
        $('.home').hide();
        $('.authorized').hide();
        $('.profile').hide();
        $('.multi-player').hide();
        $('.single-player').hide();
        $('#everything').show();
        $('.default').show();
        $('.unauthorized').show();

        document.getElementById('login-button-header').disabled = false;
        document.getElementById('log-out-button-header').disabled = true;
    }

    /**
     * Display the profile page
     */
    function loadMyProfilePage(){
        $('.unauthorized').hide();
        $('.home').hide();
        $('.single-player').hide();
        $('.multi-player').hide();
        $('.default').show();
        $('.authorized').show();
        $('.profile').show();
    }

    /**
     * User starts a single player game with a chosen category
     */
    function startSinglePlayerGame() {

        // Show only single player page
        $('.unauthorized').hide();
        $('.profile').hide();
        $('.home').hide();
        $('.multi-player').hide();
        $('.default').show();
        $('.authorized').show();
        $('.single-player').show();
        document.getElementById("single-player-messages").innerHTML = "";

        // Start game
        socket.emit('single-player-start-game', category, dbUserObject);
    }

    /**
     * User starts a multiplayer game with a chosen category
     * TODO
     */
    function startMultiPlayerGame() {
        $('.unauthorized').hide();
        $('.profile').hide();
        $('.home').hide();
        $('.single-player').hide();
        $('.default').show();
        $('.authorized').show();
        $('.multi-player').show();

        //TODO

        console.log('Clicked Multiplayer Game button');
    }

//======================================================================================================================
// SOCKET EVENTS

    // On successful login, display home page
    socket.on('login', function () { loadHomePage() });

    // Server sends user data
    socket.on('get user', function(obj) {
        dbUserObject = obj;
        socket.emit('add user', dbUserObject);
    });

    // Server successfully updated user name in DB
    // socket.on('new name', function(newName) {
    //     googleUser.displayName = newName;
    //     document.getElementById('name').innerText = newName;
    //     dbUserObject.name = newName;
    //     TODO update name if in leaderboard
    // });

    // Receive incoming chat message at datetime from a user
    socket.on('chat', function(msg, date, userName, color) {
        let messages = $('#messages');

        // If this message was sent by this user, make the name bold
        if (userName === dbUserObject.name) {
            messages.append($('<li>')
                .html(date + ' <b><span style="color:' + color + '">' + userName + ':</span> ' + msg + '</b>')
                .hide().fadeIn(1000));
        }

        // Else this message is from a different user, do not give the name any style
        else {
            messages.append($('<li>')
                .html(date + ' <span style="color:' + color + '">' + userName + ':</span> ' + msg)
                .hide().fadeIn(1000));
        }

        // Scroll to bottom of message container
        let messageContainer = $('#message-container');
        messageContainer.animate({ scrollTop: messageContainer.prop('scrollHeight')}, 0);
    });

    // Server is sending a leaderboard entry
    socket.on('get leaderboard', function (single, leaderboardEntry) {
        let userName = leaderboardEntry.name;
        let userScoreSingle = leaderboardEntry.singleHighScore;
        let userScoreMulti = leaderboardEntry.multiHighScore;

        // Update the appropriate leaderboard
        if (single) { $('#singleplayer-leaderboard').append('<li>' + userName + ': ' + userScoreSingle + '</li>'); }
        else { $('#multiplayer-leaderboard').append('<li>' + userName + ': ' + userScoreMulti + '</li>'); }
    });

    // Display single player message
    socket.on('single-player-display-message', function(message) {
        document.getElementById("single-player-messages").innerHTML = message;
    });

    // Update single player score
    socket.on('single-player-update-score', function(score) {
        document.getElementById("single-player-score").innerHTML = "Score: " + score;
    });

    // Update single player current letter
    socket.on('single-player-update-current-letter', function(currentLetter) {
        document.getElementById("single-player-current-letter").innerHTML = "Current Letter :" + currentLetter;
    });
});
//======================================================================================================================
//FIREBASE INIT:

// TODO find a safe place to store project credentials???
const config = {
    apiKey: "AIzaSyCuhMqPaI2QCFxZCbvp1hOcduf3w0vSyK0",
    authDomain: "seng513-project-lastletter.firebaseapp.com",
    databaseURL: "https://seng513-project-lastletter.firebaseio.com",
    projectId: "seng513-project-lastletter",
    storageBucket: "seng513-project-lastletter.appspot.com",
    messagingSenderId: "4582407151"
};
firebase.initializeApp(config);

//==================================================================================================================
//GENERAL SET UP:

var socket = io();      // auto-discovery, allows bidirectional communication between client and a server

//=================================================================================================================
// MIGHT BE USEFUL:


/*function returnCookies() {
    Cookies.get();

}*/

/*function setCookies(newName) {
    Cookies.set('cookieNickNameStr', newName ,{ path: '' });
}*/

//======================================================================================================================
//GET INFORMATION FROM THE SERVER:

// socket.on('update-online-users', function(numberOfOnlineUsers) {
//     document.getElementById('number-of-online-users').innerHTML = numberOfOnlineUsers.toString();
// });

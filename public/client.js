/* Shorthand for $(document).ready(...),
 The function will be executed only when the document has finished loading.
 This function contains JQuery Code inside.
 JQuery works on client side and does not require page reloading*/
$(function() {

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

    socket.on('update-online-users', function(numberOfOnlineUsers) {
        document.getElementById('number-of-online-users').innerHTML = numberOfOnlineUsers.toString();
    });
});


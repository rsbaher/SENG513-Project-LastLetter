// Wrap everything else in JQuery
$(function() {

    // Set up navigation buttons
    $('#log-out-button-header').on('click', logout);
    $('#my-profile-button-header').on('click', loadMyProfilePage);
    $('#back-to-home-button-1').on('click', loadHomePage);

    $('#back-to-home-button-3').on('click', loadHomePage);
});
/**
 * Display the profile page
 */
function loadMyProfilePage(){
    $('.unauthorized').hide();
    $('.home').hide();
    $('.single-player').hide();
    $('.multi-player').hide();
    $('.wait-for-players').hide();

    $('.default').show();
    $('.authorized').show();
    $('.profile').show();

    $('#user-email-text').html(dbUserObject.email);
    $('#user-name-text').html(dbUserObject.name);
    $('#user-color-text').html(dbUserObject.chatColor);
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
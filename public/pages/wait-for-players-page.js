
///==============================================================================================================
// JQUERY WRAP:

$(function() {

    // =========================================================================================================
    // BUTTONS REGISTRATION:

    $('#back-to-home-button-wait-for-players').on('click', backButtonWasClicked);

    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    function backButtonWasClicked(){
        loadHomePage();
        deleteMeFromTheWaitList();
    }

    //==========================================================================================================
    // SEND MESSAGES TO A SERVER:

    // TODO ask server to delete me from the wait list
    function deleteMeFromTheWaitList(){
        socket.emit('multiplayer-delete-me-from-wait-list', dbUserObject);
    }
});

//==============================================================================================================
// GLOBAL HTML EVENTS HANDLERS:

function loadWaitForPlayersPage() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.home').hide();
    $('.lost-game').hide();
    $('.won-game').hide();

    $('.default').show();
    $('.authorized').show();
    $('.wait-for-players').show();
}

function addMeToListOrGivePlayer(){
    console.log("Send message to the server asking to add to list");
    socket.emit('add-me-to-wait-list-or-give-a-player',category, dbUserObject);
}

function startLookingForOtherPlayers(categoryStr){
    loadWaitForPlayersPage();
    addMeToListOrGivePlayer();
}

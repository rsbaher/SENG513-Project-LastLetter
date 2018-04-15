
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

    }

    //===========================================================================================================
    // LISTEN TO A SERVER:
});

//==============================================================================================================
// GLOBAL HTML EVENTS HANDLERS:

function loadWaitForPlayersPage() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.home').hide();

    $('.default').show();
    $('.authorized').show();
    $('.wait-for-players').show();
}

// TODO ask server to look for players:
// TODO in the corresponding to the category list
function startLookingForOtherPlayers(categoryStr){
    loadWaitForPlayersPage();
    // TODO EMIT TO SERVER;
}

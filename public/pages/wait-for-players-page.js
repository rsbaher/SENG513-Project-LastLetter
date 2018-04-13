
//===============================================================================================================
// JQUERY WRAP:

$(function() {


    // =========================================================================================================
    // BUTTONS REGISTRATION:

    $('#back-to-home-button-single').on('click', backButtonWasClicked);
    $('#save-game-button-single').on('click', saveGame);


    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    function backButtonWasClicked(){
        loadHomePage();
        deleteGame();
    }

    //==========================================================================================================
    // SEND MESSAGES TO A SERVER:


    //===========================================================================================================
    // LISTEN TO A SERVER:


});

//==============================================================================================================
// GLOBAL HTML EVENTS HANDLERS:

function loadSinglePlayerPage() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();

    $('.default').show();
    $('.authorized').show();
    $('.single-player').show();
    document.getElementById("single-player-messages").innerHTML = "";
}

function startSinglePlayerGame() {
    loadSinglePlayerPage();
    socket.emit('single-player-start-game', category, dbUserObject);
}





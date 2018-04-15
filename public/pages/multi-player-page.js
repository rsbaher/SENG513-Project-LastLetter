
//======================================================================================================================
// WRAP EVERYTHING INTO JQUERY:

$(function() {

    // =================================================================================================================
    // FORM REGISTRATION:

    $('#multi-player-form').submit(function () {
        let m = $('#multi-player-input');
        acceptInput(m.val());
        m.val('');
        m.focus().select();
        return false;
    });

    //==================================================================================================================
    // BUTTON REGISTRATION:

    $('#back-to-home-button-multiplayer').on('click', backButtonWasClicked);


    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    function backButtonWasClicked(){
        loadHomePage();
        deleteGame();
    }
    //==========================================================================================================
    // SEND MESSAGES TO A SERVER:

    function deleteGame(){
        socket.emit('delete-multi-player-game', dbUserObject);
    }
    function acceptInput(input){
        socket.emit('multi-player-input', input, dbUserObject);
    }

    //===========================================================================================================
    // LISTEN TO A SERVER:

    socket.on('multi-player-display-message', function (message) {
        document.getElementById("multi-player-messages").innerHTML = message;
    });

    socket.on('multi-player-update-score', function (score) {
        document.getElementById("multi-player-score").innerHTML = "Score: " + score;
    });

    socket.on('multi-player-update-current-letter', function (currentLetter) {
        document.getElementById("multi-player-current-letter").innerHTML = "Current Letter :" + currentLetter;
    });

    socket.on('redirect-to-won-game', function (scoreInt) {
       loadWonGamePage(scoreInt);
    });

});
//======================================================================================================================
// GET MESSAGES FROM THE SERVER

function startMultiPlayerGame() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.wait-for-players').hide();
    $('.single-player').hide();
    $('.lost-game').hide();
    $('.won-game').hide();

    $('.default').show();
    $('.authorized').show();
    $('.multi-player').show();

    console.log('Clicked Multiplayer Game button');
}


socket.on('update-page-to-multi-player-game', function () {
    console.log("was asked to update the page");
    startMultiPlayerGame();
});



















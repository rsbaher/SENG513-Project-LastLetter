
//===============================================================================================================
// JQUERY WRAP:

$(function() {

    // =========================================================================================================
    // FORM REGISTRATION:

    $('#single-player-form').submit(function () {
        let m = $('#single-player-input');
        acceptInput(m.val());
        m.val('');
        m.focus().select();
        return false;
    });

    // =========================================================================================================
    // BUTTONS REGISTRATION:

    $('#back-to-home-button-single').on('click', backButtonWasClicked);
    $('#save-game-button-single').on('click', saveGame);


    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    // TODO IMplement save game for the single player
    function saveGame(){

    }

    function backButtonWasClicked(){
        loadHomePage();
        deleteGame();
    }

    //==========================================================================================================
    // SEND MESSAGES TO A SERVER:

    function deleteGame(){
        socket.emit('delete-single-player-game', dbUserObject);
    }

    function acceptInput(input){
        socket.emit('single-player-input', input, dbUserObject);
    }

    //===========================================================================================================
    // LISTEN TO A SERVER:

    socket.on('single-player-display-message', function (message) {
        document.getElementById("single-player-messages").innerHTML = message;
    });

    socket.on('single-player-update-score', function (score) {
        document.getElementById("single-player-score").innerHTML = "Score: " + score;
    });

    socket.on('single-player-update-current-letter', function (currentLetter) {
        document.getElementById("single-player-current-letter").innerHTML = "Current Letter :" + currentLetter;
    });
});

//==============================================================================================================
// GLOBAL HTML EVENT HANDLERS:

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





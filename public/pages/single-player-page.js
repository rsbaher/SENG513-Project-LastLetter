
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

    function backButtonWasClicked(){
        loadHomePage();
        deleteGame();
    }

    //==========================================================================================================
    // SEND MESSAGES TO A SERVER:

    function deleteGame() {
        let score = $("#single-player-score-text").text();
        socket.emit('delete-single-player-game', dbUserObject, score);
    }

    function acceptInput(input) {
        socket.emit('single-player-input', input, dbUserObject);
    }

    function saveGame() {
        socket.emit('save-single-player-game', dbUserObject);
        alert("Game Saved");
        $('#load-single-player-game-button').prop('disabled', false);
    }

    //===========================================================================================================
    // LISTEN TO A SERVER:

    socket.on('single-player-display-message', function (message) {
        document.getElementById("single-player-messages").innerHTML = message;
    });

    socket.on('single-player-update-score', function (score) {
        document.getElementById("single-player-score-text").innerHTML = score;
    });

    socket.on('single-player-update-current-letter', function (currentLetter) {
        document.getElementById("single-player-current-letter").innerHTML = "Current Letter: " + currentLetter;
    });


    socket.on('redirect-to-lost-game', function(score){
        console.log("received message about redirectjgkjgl");
        loadLostGamePage(score);
        });

    socket.on('load-single-player-game', function () {
        loadSinglePlayerPage();
    });

    socket.on('save-single-player-game', function (gameObj) {
        dbUserObject.savedGame = gameObj;
    });
});

//==============================================================================================================
// GLOBAL HTML EVENTS HANDLERS:

function loadSinglePlayerPage() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();
    $('.lost-game').hide();
    $('.won-game').hide();

    $('.default').show();
    $('.authorized').show();
    $('.single-player').show();
    document.getElementById("single-player-messages").innerHTML = "";
}

function startSinglePlayerGame() {
    loadSinglePlayerPage();
    socket.emit('single-player-start-game', category, dbUserObject);
}

/**
 * Load a single player game
 */
function loadGame() {
    socket.emit('load-single-player-game', dbUserObject);
}





//======================================================================================================================
// UPDATE HTML:

function loadHTMLSinglePlayerPage(){
    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();

    $('.default').show();
    $('.authorized').show();
    $('.single-player').show();

    document.getElementById("single-player-messages").innerHTML = "";
}


//======================================================================================================================
// HANDLE EVENTS FROM HTML:

function loadSinglePlayerPage(){
    loadHTMLSinglePlayerPage();
    startSinglePlayerGame();
}

//======================================================================================================================
// SEND INFO TO THE SERVER
var category;
function singlePlayerCategory(choice){
    category = choice;
}
function startSinglePlayerGame(){
    socket.emit('single-player-start-game', category);
}



//======================================================================================================================
// GET INFO FROM THE SERVER


socket.on('single-player-display-message', function(errorStr) {
    document.getElementById("single-player-messages").innerHTML = errorStr;
});


socket.on('single-player-update-score', function(errorStr) {
    document.getElementById("single-player-score").innerHTML = "Score: " + errorStr;
});


socket.on('single-player-update-current-letter', function(currentLetter) {
    document.getElementById("single-player-current-letter").innerHTML = "Current Letter :" + currentLetter;
});
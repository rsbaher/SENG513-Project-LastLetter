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
}


//======================================================================================================================
// HANDLE EVENTS FROM HTML:

function loadSinglePlayerPage(){
    loadHTMLSinglePlayerPage();
    startSinglePlayerGame();
}

//======================================================================================================================
// SEND INFO TO THE SERVER

function startSinglePlayerGame(){
    socket.emit('single-player-start-game', "cities");
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
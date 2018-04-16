//===============================================================================================================
// JQUERY WRAP:

$(function() {

    // =========================================================================================================
    // BUTTONS REGISTRATION:

    $('#back-to-home-won-game').on('click', backButtonWasClicked);


    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    function backButtonWasClicked() {
        loadHomePage();
    }
});



function loadWonGamePage(score) {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.lost-game').hide();


    $('.default').show();
    $('.authorized').show();
    $('.won-game').show();


    document.getElementById("won-game-score").innerHTML = "Score:" + score;

}



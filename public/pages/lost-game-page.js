
//===============================================================================================================
// JQUERY WRAP:

$(function() {

    // =========================================================================================================
    // BUTTONS REGISTRATION:

    $('#back-to-home-lost-game').on('click', backButtonWasClicked);


    //==========================================================================================================
    // PRIVATE HTML HANDLERS:

    function backButtonWasClicked() {
        loadHomePage();
    }
});



function loadLostGamePage(score) {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.won-game').hide();

    $('.default').show();
    $('.authorized').show();
    $('.lost-game').show();

    document.getElementById("lost-game-score").innerHTML = "Score:" + score;

}



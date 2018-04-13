
//==============================================================================================================
// LOAD HOME PAGE IN HTML:

/**
 * Display the home page
 */
function loadHomePage() {
    $('.unauthorized').hide();
    $('.profile').hide();
    $('.multi-player').hide();
    $('.single-player').hide();
    $('.wait-for-players').hide();

    $('.default').show();
    $('.authorized').show();
    $('.home').show();

    document.getElementById('login-button-header').disabled = true;
    document.getElementById('log-out-button-header').disabled = false;
}


//============================================================================================================
// LOAD JQUERY ELEMENTS:

// Wrap everything else in JQuery
$(function() {

    // Set up leaderboard
    $('#singleplayer-leaderboard').empty();
    $('#multiplayer-leaderboard').empty();
    socket.emit('get leaderboard');

    // Set up category and play mode buttons
    $('#cities-button').on('click', setCategoryCities);
    $('#countries-button').on('click', setCategoryCountries);
    $('#single-player-button').on('click', startSinglePlayerGame).prop('disabled', true);
    $('#multi-player-button').on('click', loadWaitForPlayersPage).prop('disabled', true);
});








/**
 * User starts a multiplayer game with a chosen category
 * TODO
 */
function startMultiPlayerGame() {

    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.wait-for-players').hide();
    $('.single-player').hide();

    $('.default').show();
    $('.authorized').show();
    $('.multi-player').show();

    //TODO

    console.log('Clicked Multiplayer Game button');
}

/**
 * Set category based on clicked button
 */
function setCategoryCities() { setCategory('cities'); }
function setCategoryCountries() { setCategory('countries'); }
function setCategory(choice) {
    category = choice;
    $('#single-player-button').prop('disabled', false);
    $('#multi-player-button').prop('disabled', false);
}

// Server is sending a leaderboard entry
socket.on('get leaderboard', function (single, leaderboardEntry) {
    let userName = leaderboardEntry.name;
    let userScoreSingle = leaderboardEntry.singleHighScore;
    let userScoreMulti = leaderboardEntry.multiHighScore;

    // Update the appropriate leaderboard
    if (single) { $('#singleplayer-leaderboard').append('<li>' + userName + ': ' + userScoreSingle + '</li>'); }
    else { $('#multiplayer-leaderboard').append('<li>' + userName + ': ' + userScoreMulti + '</li>'); }
});




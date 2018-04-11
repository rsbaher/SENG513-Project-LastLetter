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
    $('#multi-player-button').on('click', startMultiPlayerGame).prop('disabled', true);
});
/**
 * User starts a single player game with a chosen category
 */
function startSinglePlayerGame() {

    // Show only single player page
    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
    $('.multi-player').hide();
    $('.default').show();
    $('.authorized').show();
    $('.single-player').show();
    document.getElementById("single-player-messages").innerHTML = "";

    // Start game
    socket.emit('single-player-start-game', category, dbUserObject);
}

/**
 * User starts a multiplayer game with a chosen category
 * TODO
 */
function startMultiPlayerGame() {
    $('.unauthorized').hide();
    $('.profile').hide();
    $('.home').hide();
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
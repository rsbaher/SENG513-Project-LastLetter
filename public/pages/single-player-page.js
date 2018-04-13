// Wrap everything else in JQuery
$(function() {

    // Set up single player input by assigning a form submit handler
    $('#single-player-form').submit(function () {
        let m = $('#single-player-input');
        socket.emit('single-player-input', m.val(), dbUserObject);
        m.val('');
        m.focus().select();
        return false;
    });

    // Display single player message
    socket.on('single-player-display-message', function (message) {
        document.getElementById("single-player-messages").innerHTML = message;
    });

    // Update single player score
    socket.on('single-player-update-score', function (score) {
        document.getElementById("single-player-score").innerHTML = "Score: " + score;
    });

    // Update single player current letter
    socket.on('single-player-update-current-letter', function (currentLetter) {
        document.getElementById("single-player-current-letter").innerHTML = "Current Letter :" + currentLetter;
    });
});
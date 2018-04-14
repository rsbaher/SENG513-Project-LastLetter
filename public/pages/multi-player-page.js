// Wrap everything else in JQuery
$(function() {

    // Set up multi player input by assigning a form submit handler
    $('#multi-player-form').submit(function () {
        let m = $('#multi-player-input');
        socket.emit('multi-player-input', m.val(), dbUserObject);
        m.val('');
        m.focus().select();
        return false;
    });
});
//======================================================================================================================
// GET MESSAGES FROM THE SERVER

// TODO: multi-player-update-score, message.....
socket.on('update-page-to-multi-player-game', function () {
    console.log("was asked to update the page");
    startMultiPlayerGame();
});
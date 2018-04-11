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
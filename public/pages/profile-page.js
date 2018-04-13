// Wrap everything else in JQuery
$(function() {

    // Assign button handlers
    $('#edit-name-button').on('click', editUsername);
    $('#edit-color-button').on('click', editColor);
});

/**
 * We want  users to be able to change their username
 * TODO only change name if no other user has chosen that name
 */
function editUsername() {

    // Prompt user for new name and request new info from server
    let newName = prompt('Please enter your new name', dbUserObject.name);
    if (newName !== '') { socket.emit('new name', dbUserObject, newName); }
}

/**
 * We want users to be able to change their chat color
 */
function editColor() {

    // Prompt user for new color and request new info from server
    let newColor = prompt('Please enter your new color', dbUserObject.chatColor);
    if (newColor !== '') { socket.emit('new color', dbUserObject, newColor); }
}

// Server successfully updated user name in DB
socket.on('new name', function(newName) {
    $('#user-name-text').html(newName);
    dbUserObject.name = newName;
});

// Server successfully updated user color in DB
socket.on('new color', function(newColor) {
    $('#user-color-text').html(newColor);
    dbUserObject.chatColor = newColor;
});
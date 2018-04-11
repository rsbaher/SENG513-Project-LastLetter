// Set up edit username button
//document.getElementById('editNameBtn').disabled = true;

/**
 * We want  users to be able to change their username
 * TODO only change name if no other user has chosen that name
 */
// function editUsername() {
//
//     // Prompt user for new name
//     let newName = prompt('Please enter your new name', dbUserObject.name);
//
//     // Request name change from server
//     if (newName !== '') { socket.emit('new name', dbUserObject, newName); }
// }

// Server successfully updated user name in DB
// socket.on('new name', function(newName) {
//     googleUser.displayName = newName;
//     document.getElementById('name').innerText = newName;
//     dbUserObject.name = newName;
//     TODO update name if in leaderboard
// });
// Wrap everything else in JQuery
$(function() {

// Set up chat by assigning a form submit handler
    $('#chat-form').submit(function () {
        let m = $('#m');
        socket.emit('chat', dbUserObject, m.val());
        m.val('');
        m.focus().select();
        return false;
    });

// Receive incoming chat message at datetime from a user
    socket.on('chat', function (msg, date, userName, color) {
        let messages = $('#messages');

        // If this message was sent by this user, make the name bold
        if (userName === dbUserObject.name) {
            messages.append($('<li>')
                .html(date + ' <b><span style="color:' + color + '">' + userName + ':</span> ' + msg + '</b>')
                .hide().fadeIn(1000));
        }

        // Else this message is from a different user, do not give the name any style
        else {
            messages.append($('<li>')
                .html(date + ' <span style="color:' + color + '">' + userName + ':</span> ' + msg)
                .hide().fadeIn(1000));
        }

        // Scroll to bottom of message container
        var userListElement = document.getElementById("messages");
        let messageContainer = $('#message-container');
        userListElement.scrollTop = userListElement.scrollHeight;
       // messageContainer.animate({scrollTop: messageContainer.prop('scrollHeight')}, 0);
    });
});
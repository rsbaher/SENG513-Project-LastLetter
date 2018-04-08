const datetime = require('node-datetime');

let activeUsers = new Map();// map of active users (name -> {email, color}) TODO create user class for more clarity
let log = [];               // chat log
const LOG_SIZE = 200;       // max chat log size

module.exports = {

    /**
     * When a user signs in, add them to list of active users
     */
    addUser: function(user) {
        let name = user.name;
        let email = user.email;
        let color = user.chatColor;
        console.log('Adding user: ' + name + ': ' + email + ': ' + color);
        activeUsers.set(email, {name, color});
    },

    /**
     * When a user signs out, remove them from the list of active users
     */
    removeUser: function(user) {
        console.log("Removing user: " + user.email);
        activeUsers.delete(user.email)
    },

    /**
     * Send a message to a user
     */
    sendMessage: function(socket, msg, userName, color) {
        socket.emit('message', createMessage(msg, userName, color));
    },

    /**
     * Send a message to all active users
     */
    broadcastMessage: function(io, msg, userName, color) {
        io.emit('message', createMessage(msg, userName, color));
    }
};

/**
 * Create a message
 * @param msg to send
 * @param user sending the message
 * @param color of user messages
 * @return message object
 */
function createMessage(msg, userName, color) {
    let message = {
        text: msg,
        date: getCurrentDateTime(),
        from: userName,
        color: color
    };

    // If log is full, discard oldest message
    if (log.length >= LOG_SIZE) { log.shift(); }
    log.push(message);
}

// Get current date time
function getCurrentDateTime() {
    let dt = datetime.create();
    return dt.format('d.m.Y at H:M:S');
}
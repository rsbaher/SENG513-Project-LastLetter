const datetime = require('node-datetime');

let activeUsers = new Map();// map of active users (email -> {name, color}) TODO create user class for more clarity
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
        activeUsers.set(email, {name, color});
    },

    /**
     * When a user signs out, remove them from the list of active users
     */
    removeUser: function(user) { if (user !== null) activeUsers.delete(user.email) },

    /**
     * Send a message to a user
     */
    sendMessage: function(socket, msg, userName, color) { socket.emit('message', msg, getCurrentDateTime(), userName, color); },

    /**
     * Send a message to all active users
     */
    broadcastMessage: function(io, msg, userName, color) {
        let date = getCurrentDateTime();
        io.sockets.emit('chat', msg, date, userName, color);
        console.log("Broadcasting message from " + userName + " at " + date + " in " + color + ": " + msg);
        logChatMessage(msg, date, userName, color)
    }
};

/**
 * Create a message
 * @param msg to send
 * @param date at which message was sent
 * @param userName sending the message
 * @param color of user messages
 */
function logChatMessage(msg, date, userName, color) {
    let message = {
        text: msg,
        date: date,
        from: userName,
        color: color
    };

    // If log is full, discard oldest message
    if (log.length >= LOG_SIZE) { log.shift(); }
    log.push(message);
}

/**
 * Get current datetime
 * @return datetime as a formatted string
 */
function getCurrentDateTime() { return datetime.create().format('d.m.Y at H:M:S'); }
const datetime = require('node-datetime');

module.exports = {

    /**
     * When a user signs out, remove them from the list of active users
     */
    removeUser: function(user, activeUsers) {
        if (user !== null && activeUsers !== undefined) activeUsers.delete(user.email)
    },

    /**
     * Send a message to a user
     */
    sendMessage: function(socket, msg, userName, color) {
        if (msg !== '') socket.emit('message', msg, getCurrentDateTime(), userName, color);
    },

    /**
     * Send a message to all active users
     */
    broadcastMessage: function(io, msg, userName, color) {
        if (msg !== '') io.sockets.emit('chat', msg, getCurrentDateTime(), userName, color);
    }
};

/**
 * Get current datetime
 * @return datetime as a formatted string
 */
function getCurrentDateTime() { return datetime.create().format('d.m.Y at H:M:S'); }
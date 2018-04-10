module.exports = {
    UserObject: function(userNameStr, colorStr, email, socketID) {
        this.userNameStr = userNameStr;
        this.colorStr = colorStr;
        this.email = email;
        this.socketID = socketID;
    }
};
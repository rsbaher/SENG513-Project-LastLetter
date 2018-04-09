module.exports = {
    UserObject: function(userNameStr, colorStr, socketID) {
        this.userNameStr = userNameStr;
        this.colorStr = colorStr;
        this.socketID = socketID;
        console.log("User was created");
    }
};
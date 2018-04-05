module.exports = {

     GameObject: function(listOfPlayers, categoryStr , io) {
        console.log(listOfPlayers);
        this.player1 = listOfPlayers[0];

        if (listOfPlayers.length > 1){
            this.player2 = listOfPlayers[1];
            this.mode = "multiPlayer";

        }else{
            this.player1 = listOfPlayers[0];
            this.mode = "singlePlayer";
        }
        this.turn = this.player1;
        this.category = categoryStr;
        this.score = 0;
        this.gameKeys = [];
        this.currentLetter = returnRandomLetter(io);

        console.log( "Object was created");
    },
};

function returnRandomLetter(io){
    var alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    updateOnlineUsers(5, io);


    return Math.floor(Math.random()*alphabetArray.length);


}

function updateOnlineUsers(number, io){
    io.emit('update-online-users',number);
}

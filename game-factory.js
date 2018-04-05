module.exports = {

     GameObject: function(listOfPlayers, categoryStr) {
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
        this.currentLetter = returnRandomLetter();

        console.log( "Object was created");
    },
};

function returnRandomLetter(){
    var alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabetArray[Math.floor(Math.random()*alphabetArray.length)];
}


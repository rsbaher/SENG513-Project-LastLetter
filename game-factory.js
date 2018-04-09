module.exports = {

     GameObject: function(listOfPlayers, categoryStr) {
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
        this.gameAnswers = [];
        this.currentLetter = returnRandomLetter();
    }
};

// TODO rempve comment from random
function returnRandomLetter(){
    var alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //return alphabetArray[Math.floor(Math.random()*alphabetArray.length)];
    return "C";
}


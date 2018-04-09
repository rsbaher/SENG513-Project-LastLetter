module.exports = {

     GameObject: function(listOfPlayers, categoryStr) {
        this.listOfPlayers = listOfPlayers;
        this.player1 = listOfPlayers[0];

        if (listOfPlayers.length > 1){
            this.player2 = listOfPlayers[1];
            this.mode = "multiPlayer";
        } else{
            this.player1 = listOfPlayers[0];
            this.mode = "singlePlayer";
        }
        this.turn = 0;
        this.category = categoryStr;
        this.score = 0;
        this.gameAnswers = [];
        this.currentLetter = returnRandomLetter();
    },

    gameObjects: [],

    returnGameObjBasedOnSocket: function (socketID) {
        var i = 0;
        while(i<this.gameObjects.length){
            var j = 0;
            while(j<this.gameObjects[i].listOfPlayers.length){

                if (this.gameObjects[i].listOfPlayers[j].socketID === socketID){
                    return this.gameObjects[i];

                }
                j++;
            }
               i++;
        }
    },
};



// TODO remove comment from random
function returnRandomLetter(){
    var alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabetArray[Math.floor(Math.random()*alphabetArray.length)];
    //return "C";
}




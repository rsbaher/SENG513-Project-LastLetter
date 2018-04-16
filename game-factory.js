module.exports = {

     GameObject: function(listOfPlayers, categoryStr, emailToSocket) {
        this.listOfPlayers = listOfPlayers;
        this.player1 = this.listOfPlayers[0];
        this.emailToSocket = emailToSocket;

        if (this.listOfPlayers.length > 1){
            this.player2 = this.listOfPlayers[1];
            this.mode = "multiPlayer";
        } else{
            this.mode = "singlePlayer";
        }
        this.turn = 0;
        this.category = categoryStr;
        this.score = 0;
        this.gameAnswers = [];
        if(this.category === "countries"){
            this.currentLetter = returnRandomLetterCountries();
        }
        else {
            this.currentLetter = returnRandomLetter();
        }

    },

    // Map of game objects (user email -> game object)
    // For multiplayer games, there will be two entries (one for each player)
    gameObjects: new Map(),

    returnGameObject: function (user) {
         return this.gameObjects.get(user.email);
    },

    removeGameObject: function (user){
         this.gameObjects.delete(user.email);
    },
};

function returnRandomLetter(){
    const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabetArray[Math.floor(Math.random()*alphabetArray.length)];
}


function returnRandomLetterCountries() {
    const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
    return alphabetArray[Math.floor(Math.random() * alphabetArray.length)];
}




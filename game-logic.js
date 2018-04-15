
//======================================================================================================================
// EXPORT METHODS:

module.exports = {

    doLogic: function(gameObj, inputStr, socket, user) {

        if(isValid(gameObj, inputStr, socket, user)) {
            performGeneralLogic(gameObj, inputStr, socket);
        }
    },

    sendMessageMultiPlayer(outputStr, socket, gameObj ){
        displayMessageHTML(outputStr, socket, gameObj.mode)

    },

    updateCurrentLetterSinglePlayer: function (gameObj) {
        updateCurrentLetterHTMLSinglePlayer(gameObj);
    },

    updateCurrentScoreSinglePlayer: function (gameObj) {
        updateScoreHTMLSinglePlayer (gameObj);
    },

    updateCurrentLetterMultiPlayer: function (gameObj) {
        updateCurrentLetterHTMLMultiPlayer(gameObj);
    },

    updateCurrentScoreMultiPlayer: function (gameObj) {
        updateScoreHTMLMultiPlayer (gameObj);
    },

    updatePageToGame: function(socket){
        updatePageHTMLMultiPlayer(socket);
    }
};

//======================================================================================================================
// GENERAL VALIDITY OF INPUT:

function isValid(gameObj, inputStr, socket, user){

    if(!rightTurn(gameObj, user.email)){
        displayMessageHTML("It is not your turn. Please Wait", socket, gameObj.mode);
        return false;
    }

    if (inputIsEmptyStr(inputStr)){
        displayMessageHTML("Invalid input: empty string", socket, gameObj.mode);
        return false;
    }

    inputStr = formatInput(inputStr);

    if (!currentLetterIsTheSameAsFirstLetter(gameObj, inputStr)){
        displayMessageHTML("Input does not start from the right letter. Please try again", socket, gameObj.mode);
        return false;
    }

    if(repetitionsExist(gameObj, inputStr)) {
        displayMessageHTML("This word have already been used", socket, gameObj.mode);
        return false;
    }

    if (!existInDictionary(gameObj, inputStr)) {
        displayMessageHTML("This is not valid " + gameObj.category + " entry" , socket, gameObj.mode);
        return false;
    }
    return true;
}

function rightTurn(gameObj, email) {
    console.log(gameObj);
    return gameObj.listOfPlayers[gameObj.turn].email === email;
}


function inputIsEmptyStr(inputStr){
    return (inputStr.length < 1);
}


function currentLetterIsTheSameAsFirstLetter(gameObj, inputStr){
    const currentLetter = gameObj.currentLetter;
    const inputFirstLetterStr = inputStr.charAt(0);
    return (currentLetter === inputFirstLetterStr);
}


function repetitionsExist(gameObj, inputStr){
    return gameObj.gameAnswers.includes(inputStr);
}


function existInDictionary(gameObj, inputStr) {
    const category = gameObj.category;
    if (category === "cities") { return inputIsValidCitiesDatabase(inputStr); }
    else if(category === "countries") { return inputIsValidCountriesDatabase(inputStr); }
    return false;
}

//======================================================================================================================
// VALIDITY IN DATABASES:

function inputIsValidCitiesDatabase(inputStr) {
    const cities = require("all-the-cities");
    let outputList = cities.filter(function(city) {
        return(city.name === (inputStr));
    });

    return outputList.length > 0;
}


function inputIsValidCountriesDatabase(inputStr){
    const countries = require('db-country');
    const outputList = countries.findBy('name', inputStr);
    return outputList.length > 0;
}

//======================================================================================================================
// GENERAL GAME LOGIC:

function returnSocketCurrentUser(gameObj){
    let turn = gameObj.turn;
    console.log(turn);
    let currentEmail = gameObj.listOfPlayers[turn].email;
    return gameObj.emailToSocket.get(currentEmail);
}

function returnSocketOtherUser(gameObj){
    let turn = gameObj.turn;
    let otherEmail = gameObj.listOfPlayers[(turn+1)%2].email;
    return gameObj.emailToSocket.get(otherEmail);
}


function performGeneralLogic(gameObj, inputStr, socket) {
    updateScore(gameObj);
    changeTurn(gameObj);
    updateCurrentLetter(gameObj, inputStr);
    updateCurrentLetterHTML(gameObj);
    updateGameAnswers(gameObj, inputStr);
    displayMessageHTML("Last entry: " + inputStr + "\n" +
        "Your letter is: " + gameObj.currentLetter, socket, gameObj.mode);
}

function updateScore(gameObj){
    gameObj.score++;
    if(gameObj.mode === "multiPlayer"){
        updateScoreHTMLMultiPlayer(gameObj);
    }else{
        updateScoreHTMLSinglePlayer (gameObj);
    }
}

function changeTurn(gameObj){
    if (gameObj.mode === "multiPlayer"){
        displayMessageHTML("", returnSocketCurrentUser(gameObj),gameObj.mode);
        displayMessageHTML("This is your turn", returnSocketOtherUser(gameObj),gameObj.mode);
    }
    gameObj.turn = (gameObj.turn + 1)%gameObj.listOfPlayers.length;
}

function updateCurrentLetter(gameObj, inputStr){
    gameObj.currentLetter = inputStr.charAt(inputStr.length - 1).toUpperCase();
}

function updateGameAnswers(gameObj, inputStr){
    gameObj.gameAnswers.push(inputStr);
}

//======================================================================================================================
// FORMAT INPUT/ FORMAT OUTPUT:

function formatInput(inputStr) {
    return inputStr.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//======================================================================================================================
// COMMUNICATION WITH THE CLIENT:

function displayMessageHTMLSingle (outputStr, socket){
    socket.emit('single-player-display-message', outputStr);
}

function displayMessageHTMLMulti (outputStr, socket){
    socket.emit('multi-player-display-message', outputStr);
}

function displayMessageHTML (outputStr, socket, modeStr){
    console.log(modeStr);
    if (modeStr === "multiPlayer"){
        displayMessageHTMLMulti(outputStr,socket);
    } else{
        displayMessageHTMLSingle(outputStr, socket);
    }

}

function updateScoreHTMLSinglePlayer(gameObj){
    returnSocketCurrentUser(gameObj).emit('single-player-update-score', gameObj.score);
}

function updateScoreHTMLMultiPlayer(gameObj){
    returnSocketOtherUser(gameObj).emit('multi-player-update-score', gameObj.score);
    returnSocketCurrentUser(gameObj).emit('multi-player-update-score', gameObj.score);
}


function updateCurrentLetterHTMLSinglePlayer(gameObj){
    returnSocketCurrentUser(gameObj).emit('single-player-update-current-letter', gameObj.currentLetter);
}
function updateCurrentLetterHTMLMultiPlayer(gameObj){
    returnSocketCurrentUser(gameObj).emit('multi-player-update-current-letter', gameObj.currentLetter);
    returnSocketOtherUser(gameObj).emit('multi-player-update-current-letter', gameObj.currentLetter);
}
function updateCurrentLetterHTML(gameObj){
    if(gameObj.mode === "multiPlayer"){
        updateCurrentLetterHTMLMultiPlayer(gameObj);
    }
    updateCurrentLetterHTMLSinglePlayer(gameObj)
}


function updatePageHTMLMultiPlayer(socket){
    socket.emit('update-page-to-multi-player-game');
}




//======================================================================================================================
// EXPORT METHODS:

module.exports = {

    doLogic: function(gameObj, inputStr, socket, user) {

        if(isValid(gameObj, inputStr, socket, user)) {
            performGeneralLogic(gameObj, inputStr, socket);
        }
    },

    updateCurrentLetter: function (currentLetter, socket) {
        updateCurrentLetterHTML(currentLetter,socket);
    }

};

//======================================================================================================================
// GENERAL VALIDITY OF INPUT:

function isValid(gameObj, inputStr, socket, user){

    if(!rightTurn(gameObj, user.email)){
        displayMessageHTML("It is not your turn. Please Wait", socket);
        return false;
    }

    if (inputIsEmptyStr(inputStr)){
        displayMessageHTML("Invalid input: empty string", socket);
        return false;
    }

    inputStr = formatInput(inputStr);

    if (!currentLetterIsTheSameAsFirstLetter(gameObj, inputStr)){
        displayMessageHTML("Input does not start from the right letter. Please try again", socket);
        return false;
    }

    if(repetitionsExist(gameObj, inputStr)) {
        displayMessageHTML("This word have already been used", socket);
        return false;
    }

    if (!existInDictionary(gameObj, inputStr)) {
        displayMessageHTML("This is not valid " + gameObj.category + " entry" , socket);
        return false;
    }
    return true;
}

function rightTurn(gameObj, email) {
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

function performGeneralLogic(gameObj, inputStr, socket) {
    updateScore(gameObj,socket);
    changeTurn(gameObj);
    updateCurrentLetter(gameObj,inputStr);
    updateCurrentLetterHTML(gameObj.currentLetter, socket);
    updateGameAnswers(gameObj, inputStr);
    displayMessageHTML("Last entry: " + inputStr + "\n" +
        "Your letter is: " + gameObj.currentLetter, socket);
}

function updateScore(gameObj, socket){
    gameObj.score++;
    updateScoreHTML(gameObj.score,socket);
}

function changeTurn(gameObj){
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

function displayMessageHTML (outputStr, socket){
    socket.emit('single-player-display-message', outputStr);
}

function updateScoreHTML(score, socket){
    socket.emit('single-player-update-score', score);
}

function updateCurrentLetterHTML(currentLetter, socket){
    socket.emit('single-player-update-current-letter', currentLetter);
}


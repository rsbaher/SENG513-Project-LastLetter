//======================================================================================================================
// EXPORT METHODS:

module.exports = {

    doLogic: function(gameObj, inputStr, io) {
     if (inputIsValid(gameObj,inputStr )){
        updateOnlineUsers("valid", io);
     }
     else{updateOnlineUsers("invalid", io);}
    },
};

//======================================================================================================================
// CHECK VALIDITY OF INPUT:

function inputIsValid(gameObj, inputStr){

    if (!inputNotEmptyStr(inputStr)){ return false;}

    inputStr = formatInput(inputStr);

    if (!currentLetterIsTheSameAsFirstLetter(gameObj, inputStr)) {return false;}

    var category = gameObj.category;
    if (category === "cities"){
        return inputIsValidCitiesDatabase(inputStr);
    }

    return false;
}


function inputNotEmptyStr(inputStr){
    return (inputStr.length > 0);
}


function currentLetterIsTheSameAsFirstLetter(gameObj, inputStr){
    var currentLetter = gameObj.currentLetter;
    var inputFirstLetterStr = inputStr.charAt(0);
    return (currentLetter === input);
}

//======================================================================================================================
// VALIDITY IN DATABASES:

function inputIsValidCitiesDatabase(inputStr){
    const cities = require("all-the-cities");
    var outputList = cities.filter(function(city) {
        return(city.name === (inputStr));
    });

    if (outputList.length > 0){
        return true;
    }
    return false;
}

// TODO add inputIsValidCountriesDatabase
// TODO add inputIsValidAnimalsDatanbase

//======================================================================================================================
// FORMAT INPUT:

function formatInput(inputStr){
    var lastLettersAreLowerCase = inputStr.slice(1).toLowerCase();
    var firstLetterIsUpperCase = varinputStr[0].toUpperCase();
    return firstLetterIsUpperCase + lastLettersAreLowerCase;
}

//======================================================================================================================
// COMMUNICATION WITH THE CLIENT:

function updateOnlineUsers(outputStr, io){
    io.emit('update-online-users', outputStr);
}
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

    var category = gameObj.category;
    var currentLetter = gameObj.currentLetter;

    if (category === "cities"){
        return inputIsValidCitiesDatabase(inputStr);
    }

    return false;
}

//======================================================================================================================
// DATABASES:

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


//======================================================================================================================
// COMMUNICATION WITH THE CLIENT:

function updateOnlineUsers(outputStr, io){
    io.emit('update-online-users', outputStr);
}
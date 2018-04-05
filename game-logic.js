module.exports = {

    doLogic: function(gameObj, inputStr, io) {
     if (inputIsValid(gameObj,inputStr )){
        updateOnlineUsers("valid", io);
     }
     else{updateOnlineUsers("invalid", io);}
    },
};

function inputIsValid(gameObj, inputStr){

    var category = gameObj.category;
    var currentLetter = gameObj.currentLetter;

    var output;
    if (category === "cities"){
        output = lookInCitiesDatabase(inputStr);
    }


    if (output.length > 0){
        return true;
    }
    return false;
}


function lookInCitiesDatabase(inputStr){
    const cities = require("all-the-cities");
    var outputStr = cities.filter(function(city) {
        return(city.name === (inputStr));
    });
    console.log(outputStr);
    return outputStr;
}



function updateOnlineUsers(outputStr, io){
    io.emit('update-online-users', outputStr);
}
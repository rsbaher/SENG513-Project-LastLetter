module.exports = {
    returnRandomLetter: function() {
        var alphabetArray = "abcdefghijklmnopqrstuvwxyz";
        return Math.floor(Math.random()*alphabetArray.length);
    }

    GameObject: function (msg){
        this.currentLetter = returnRandomLetter();
        console.log(currentLetter);
    }
}








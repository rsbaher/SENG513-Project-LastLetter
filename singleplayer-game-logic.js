<<<<<<< HEAD
/*module.exports = {
    test2: function() { console.log( "Hello World"); }
}

export function test(){
    console.log( "Hello World");
}
*/
var spGameLogic = (function() {
    function _test () {
        console.log('Hello World1!');
    }
    function _test2 () {
        console.log('Hello World2!');
    }

    return {
        test1: _test,
        test2: _test2
    };
})();

module.exports = spGameLogic
=======
module.exports = {

    test2: function() { console.log( "Hello World");},
    test1: function () { console.log("Bye");}
};

>>>>>>> 5eebe0a4771f961119f0dd21054044716cc1e8b1

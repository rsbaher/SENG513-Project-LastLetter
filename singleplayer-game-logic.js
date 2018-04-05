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
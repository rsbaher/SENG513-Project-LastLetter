

//======================================================================================================================
// LOGIN:

function loadLoginPage() {
    $('.home').hide();
    $('.authorized').hide();
    $('.profile').hide();
    $('.multi-player').hide();
    $('.single-player').hide();

    $('#everything').show();
    $('.default').show();
    $('.unauthorized').show();
}

//=======================================================================================================================
// MY PROFILE

function loadMyProfilePage(){

    $('.unauthorized').hide();
    $('.home').hide();

    $('.default').show();
    $('.authorized').show();
    $('.profile').show();
}



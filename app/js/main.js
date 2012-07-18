function showLoading() {
    $('#loading').hide();
    //$('#loading').show();
    //$("#navbar").hide();
    //$("#content").hide();
}

function stopLoading() {
    $('#loading').hide();
    //$("#navbar").show();
    //$("#content").show();
}

$(document).ready(function() {
    initRotate();
    showLoading();
    dbInit();
    page_main();
    
    $("#content").css("display", "none");

    $("#content").slideDown(1000);
});


// Gestion des cookies
function createCookie(name,value) {
    var date = new Date();
    date.setTime(date.getTime()+(60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
    
    console.debug("cookies create: " + name + "=" + value);
    console.debug("cookies create: " + document.cookie);
}

function readCookie(name) {
    var nameEQ = name + "=";
    
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) {
            value = nameEQ.length,c.length;
            console.debug("cookies read: " + name + "=" + value);
            return c.substring(value);
        }
    }
    return null;
}

function eraseCookie(name) {
    console.debug("cookies erase: " + name);
    createCookie(name,"",-1);
}
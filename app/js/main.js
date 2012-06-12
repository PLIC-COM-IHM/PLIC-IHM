function showLoading() {
    $('#loading').show();
    $("#navbar").hide();
    $("#content").hide();
}

function stopLoading() {
    $('#loading').hide();
    $("#navbar").show();
    $("#content").show();
}

$(document).ready(function() {
    showLoading();
    dbInit();
    page_main();
});

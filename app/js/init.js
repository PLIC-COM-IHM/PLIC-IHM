function showLoading() {
    $("#content").empty()
    .append('<img class"loading" src="images/loading.gif" alt="Loading..."/>');
}

$(document).ready(function() {
    showLoading();
    dbInit();
    $('html').bind('db_initialized', function () {
        parseProjects();
        homepage();
    });
});
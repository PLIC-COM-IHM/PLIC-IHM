function showLoading(where) {
    $(where).empty()
    .append('<img class"loading" src="images/loading.gif" alt="Loading..."/>');
}

$(document).ready(function() {
    showLoading("#content");
    databaseInit();
    parseProjects();
});
$(document).ready(function() {
    console.log('Initialize application');
    dbReinit();
});

$('html').bind('db_initialized', function () {
    parseProjects();
    testProjects();
});

function testProjects()
{
    dbGetAllCategories(hpInstantiateCategorie);
}

function hpInstantiateCategorie(categories) {
    if (categories.length == 0) { window.setTimeout(testProjects, 1000); return; }
    window.location = 'homepage.html';
}

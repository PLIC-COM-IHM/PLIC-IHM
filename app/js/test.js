var _projects = new Array();

// TESTING : parseproject.ParseProject(htmldata)
function testParseFolder(folder) {
    console.debug("Testing parse folder...");
    $('#test1').append('<h3>Testing parseFolder...</h3>');
    $.ajax({ 
        type: "GET", 
        url: folder,
        success: function (htmldata) {
            var results = parseFolder(htmldata);
            $('#test1').append('Folder contains:<em> ' + results + '</em><br/>');
        }
    });
}

// TESTING : database.addProject(project)
function testAddProject() {
    console.debug("Testing add project...");
    
    // Add project.json
    $.getJSON("test/project.json", function(project) {
        mtiapp.webdb.addProject(project);
        //$('#test').append('<h4>Adding</h4><p>Added:<em> ' + JSON.stringify(project) + '</em></p>');
    });
    
    
    // Add project2.json
    $.getJSON("test/project2.json", function(project) {
        mtiapp.webdb.addProject(project);
        //$('#test').append('<h4>Adding</h4><p>Added:<em> ' + JSON.stringify(project) + '</em></p>');
    });
}

$(document).ready(function() {
    testParseFolder('projects/');

    db();
    $('html').bind('db_initialized', function () {
        //testAddProject();
        parseProjects();
    });
});

window.setInterval(function(){
    console.debug('Refreshing...');
    // get project
    dbGetAllProjects(function(projects) {
        _projects = projects;
    });
    
    $('#test2').empty();
    $('#test2').append('<h3>Testing add project...</h3>');
    $('#test2').append('<h4>Getting</h4>');
    for (i=0; i<_projects.length;i++) {
        $('#test2').append('<p>Got:<em> ' + JSON.stringify(_projects[i]) + '</em></p>');
    }
}, 2000);
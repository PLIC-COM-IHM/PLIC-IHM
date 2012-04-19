function testParseFolder(folder) {
    console.debug("Testing parse folder...");
    $('#test').append('<h3>Testing parseFolder...</h3>');
    $.ajax({ 
        type: "GET", 
        url: folder,
        success: function (htmldata) {
            var results = parseFolder(htmldata);
            $('#test').append('Folder contains:<em> ' + results + '</em><br/>');
        }
    });
}

function testAddProject() {
    console.debug("Testing add project...");
    $('#test').append('<h3>Testing add project...</h3>');
    $.getJSON("test/project.json", function(data) {
        mtiapp.webdb.addProject(data);
        $('html').bind('db_project_add', function () {
            console.debug("Project added...");
            $('#test').append('Added:<em> ' + JSON.stringify(data) + '</em><br/>');
            
            // get project
            var db = mtiapp.webdb.db;
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM project",
                    [],
                    function(tx, rs) {
                        for (i=0; i<rs.rows.length;i++) {
                            $('#test').append('Got:<em> ' + JSON.stringify(rs.rows.item(i)) + '</em><br/>');
                        }
                    },
                    function(tx, e) {
                        alert("There has been an error: " + e.message);
                    });
            });
        });
    });
    /*
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM projects",
            [],
            function(tx, rs) {
                for (i=0; i<rs.rows.length;i++) {
                    $('body').append('<p>Test</p>');
                }
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    }
    */
}

$(document).ready(function() {
    testParseFolder('projects/');

    databaseInit();
    $('html').bind('db_initialized', function () {
        testAddProject();
    });
});
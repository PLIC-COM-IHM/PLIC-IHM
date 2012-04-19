function testAddProject() {
    console.debug("Testing add project...");
    $('#test').append('<h3>Testing add project...</h3><ul div="test1"></ul>');
    $.getJSON("test/project.json", function(data) {
        mtiapp.webdb.addProject(data);
        $('html').bind('db_project_add', function () {
            console.debug("Project added...");
            $('#test').append('<em><b>Added:</b> ' + JSON.stringify(data) + '</em><br/>');
            
            // get project
            var db = mtiapp.webdb.db;
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM project",
                    [],
                    function(tx, rs) {
                        for (i=0; i<rs.rows.length;i++) {
                            $('#test').append('<em><b>Got:</b> ' + JSON.stringify(rs.rows.item(i)) + '</em><br/>');
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
    databaseInit();
    $('html').bind('db_initialized', function () {
        testAddProject();
    });
});
var mtiapp = {};
mtiapp.webdb = {};
mtiapp.webdb.db = null;


// open database
mtiapp.webdb.open = function() {
    // open database
    var dbSize = 64 * 1024 * 1024; // 64MB
    mtiapp.webdb.db = openDatabase("App", "1.0", "MTI App", dbSize);
}


// Initialise database (create table)
mtiapp.webdb.init = function() {
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        var q = "CREATE TABLE IF NOT EXISTS " +
                "project(id INTEGER PRIMARY KEY, folder TEXT, name TEXT, " +
                "year INTEGER, shortDescription TEXT, description TEXT, " +
                "logoPath TEXT, headerPath TEXT, module TEXT)";
        tx.executeSql(q, []);
     
        q = "CREATE TABLE IF NOT EXISTS " +
                "image(id INTEGER PRIMARY KEY, projectId INTEGER, path TEXT)";
        tx.executeSql(q, []);
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "video(id INTEGER PRIMARY KEY, projectId INTEGER, path TEXT)";
        tx.executeSql(q, []);
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "technology(id INTEGER PRIMARY KEY, name TEXT, logoPath TEXT)";
        tx.executeSql(q, []);
   
        q = "CREATE TABLE IF NOT EXISTS " +
                "projectTechnology(id INTEGER PRIMARY KEY, projectId INTEGER, technologyId INTEGER)";
        tx.executeSql(q, []);
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "category(id INTEGER PRIMARY KEY, name TEXT)";
        tx.executeSql(q, []);
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "projectCategory(id INTEGER PRIMARY KEY, projectId INTEGER, categoryId INTEGER)";
        tx.executeSql(q, []);
        
        q = "CREATE TABLE IF NOT EXISTS " +
                "member(id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, " +
                "login TEXT, photoPath TEXT, projectId INTEGER)";
        tx.executeSql(q, []);
        
        // empty tables
        tx.executeSql("TRUNCATE TABLE project", []);
        tx.executeSql("TRUNCATE TABLE image", []);
        tx.executeSql("TRUNCATE TABLE video", []);
        tx.executeSql("TRUNCATE TABLE technology", []);
        tx.executeSql("TRUNCATE TABLE projectTechnology", []);
        tx.executeSql("TRUNCATE TABLE category", []);
        tx.executeSql("TRUNCATE TABLE projectCategory", []);
        tx.executeSql("TRUNCATE TABLE members", []);
    });
}


// add a new project
mtiapp.webdb.addProject = function(project) {
    var db = mtiapp.webdb.db;
    var insertId = -1;
    db.transaction(function(tx) {
    var addedOn = new Date();
    tx.executeSql("INSERT INTO project(folder, name, year, shortDescription, " +
                                        "description, logoPath, headerPath, module) " +
                                        "VALUES (?,?,?,?,?,?,?,?)",
            [project.folder, project.name, project.year,
             project.short_description, project.description,
             project.logoPath, project.headerPath, projecT.module],
            function(tx, r) {
                insertId = r.insertId;
                // insert images
                for (i=0; i<project.images.length; i++) {
                    mtiapp.webdb.addImage(project.images[i], insertId);
                }
                // insert videos
                for (i=0; i<project.videos.length; i++) {
                    mtiapp.webdb.addVideo(project.videos[i], insertId);
                }
                // insert members
                for (i=0; i<project.members.length; i++) {
                    mtiapp.webdb.addVideo(project.members[i], insertId);
                }
                // insert technologies
                for (i=0; i<project.technologies.length; i++) {
                    mtiapp.webdb.addCategory(project.technologies[i], insertId);
                }
                // insert categories
                for (i=0; i<project.categories.length; i++) {
                    mtiapp.webdb.addCategory(project.categories[i], insertId);
                }
            },
            function(tx, e) { alert("There has been an error: " + e.message); });
    });
    return insertId;
}


// add a new member to a project
mtiapp.webdb.addMember = function(member, projectId) {
    var db = mtiapp.webdb.db;
    var insertId = -1;
    db.transaction(function(tx) {
    var addedOn = new Date();
    tx.executeSql("INSERT INTO member(firstname, lastname, login, " +
                                        "photoPath, projectId) " +
                                        "VALUES (?,?,?,?,?)",
            [member.firstname, member.lastname, member.login,
             member.photoPath, projectId],
            function(tx, r) { insertId = r.insertId; },
            function(tx, e) { alert("There has been an error: " + e.message); });
    });
    return insertId;
}


// add new image to a project
mtiapp.webdb.addImage = function(path, projectId) {
    var db = mtiapp.webdb.db;
    var insertId = -1;
    tx.executeSql("INSERT INTO image(projectId, path) VALUES(?, ?)",
                  [projectId, path],
                  function(tx, r) { insertId = r.insertId; },
                  function(tx, e) {
                    alert("There has been an error: " + e.message);
                  });
    return insertId;
}


// add new video to a project
mtiapp.webdb.addVideo = function(path, projectId) {
    var db = mtiapp.webdb.db;
    var insertId = -1;
    tx.executeSql("INSERT INTO video(projectId, path) VALUES(?, ?)",
                  [projectId, path],
                  function(tx, r) { insertId = r.insertId; },
                  function(tx, e) {
                    alert("There has been an error: " + e.message);
                  });
    return insertId;
}


// add technology to a project
mtiapp.webdb.addTechnology = function(technology, projectId) {
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM technology WHERE name = ?",
            [technology],
            function(tx, rs) {
                // found, add it
                mtiapp.webdb.addProjectTechnology(rs.rows.item(i).id, projectId);
            },
            function(tx, e) {
                tx.executeSql("INSERT INTO technology(name) VALUES(?)",
                [technology],
                function(tx, r) {
                    // inserted, add it
                    mtiapp.webdb.addProjectTechnology(r.insertId, projectId);
                },
                function(tx, e) {
                    alert("There has been an error: " + e.message);
                });
            });
    });
}

// add projectTechnology
mtiapp.webdb.addProjectTechnology = function(technoId, projectId) {
    tx.executeSql("INSERT INTO projectTechnology(technologyId, projectId) " +
                  "VALUES(?, ?)",
                  [technoId, projectId],
                  function(tx, r) { },
                  function(tx, e) {
                      alert("There has been an error: " + e.message);
                  });
}


// add category to a project
mtiapp.webdb.addCategory = function(category, projectId) {
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM category WHERE name = ?",
            [category],
            function(tx, rs) {
                // found, add it
                mtiapp.webdb.addProjectCategory(rs.rows.item(i).id, projectId);
            },
            function(tx, e) {
                tx.executeSql("INSERT INTO category(name) VALUES(?)",
                [category],
                function(tx, r) {
                    // inserted, add it
                    mtiapp.webdb.addProjectCategory(r.insertId, projectId);
                },
                function(tx, e) {
                    alert("There has been an error: " + e.message);
                });
            });
    });
}

// add projectTechnology
mtiapp.webdb.addProjectCategory = function(categoryId, projectId) {
    tx.executeSql("INSERT INTO projectCategory(categoryId, projectId) " +
                  "VALUES(?, ?)",
                  [technoId, projectId],
                  function(tx, r) { },
                  function(tx, e) {
                      alert("There has been an error: " + e.message);
                  });
}


function databaseInit() {
  mtiapp.webdb.open();
  mtiapp.webdb.init();
}

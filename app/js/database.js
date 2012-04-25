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
    console.debug("Initialise database...");
    
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // clear database
        // should be truncate, but it does not work
        console.debug("Clearing tables...");
        tx.executeSql('DROP TABLE project;', [], 
            function(tx, e) { console.debug('Cleared project table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE image', [], 
            function(tx, e) { console.debug('Cleared image table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE video', [], 
            function(tx, e) { console.debug('Cleared video table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE technology', [], 
            function(tx, e) { console.debug('Cleared technology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE projectTechnology', [], 
            function(tx, e) { console.debug('Cleared projectTechnology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE category', [], 
            function(tx, e) { console.debug('Cleared category table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE projectCategory', [], 
            function(tx, e) { console.debug('Cleared projectCategory table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        tx.executeSql('DROP TABLE member', [], 
            function(tx, e) { console.debug('Cleared member table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        
        // create table
        console.debug("Creating tables...");
        var q = "CREATE TABLE IF NOT EXISTS " +
                "project(id INTEGER PRIMARY KEY, folder TEXT, name TEXT, " +
                "year INTEGER, shortDescription TEXT, description TEXT, " +
                "logoPath TEXT, headerPath TEXT, module TEXT)";
        tx.executeSql(q, []);
     
        q = "CREATE TABLE IF NOT EXISTS " +
                "image(imageId INTEGER PRIMARY KEY, projectId INTEGER, imagePath TEXT)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created image table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "video(videoId INTEGER PRIMARY KEY, projectId INTEGER, videoPath TEXT)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created video table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "technology(technoId INTEGER PRIMARY KEY, technoName TEXT, logoPath TEXT)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created technology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
   
        q = "CREATE TABLE IF NOT EXISTS " +
                "projectTechnology(pTechnoId INTEGER PRIMARY KEY, projectId INTEGER, technologyId INTEGER)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created projectTechnology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "category(categoryId INTEGER PRIMARY KEY, categoryName TEXT)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created category table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "projectCategory(pCategoryId INTEGER PRIMARY KEY, projectId INTEGER, categoryId INTEGER)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created projectCategory table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
        
        q = "CREATE TABLE IF NOT EXISTS " +
                "member(memberId INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, " +
                "login TEXT, photoPath TEXT, projectId INTEGER)";
        tx.executeSql(q, [],
            function(tx, e) {
                console.debug('Created member table');
                console.debug('Database initialized');
                $('html').trigger('db_initialized');
            },
            function(tx, e) { alert("There has been an error: " + e.message); });
    });
}


// add a new project
mtiapp.webdb.addProject = function(project) {
    console.debug("AddProject(" + project.name + ")");
        
    var db = mtiapp.webdb.db;
    var insertId = -1;
    db.transaction(function(tx) {
        var addedOn = new Date();
        tx.executeSql("INSERT INTO project(folder, name, year, shortDescription, " +
                                            "description, logoPath, headerPath, module) " +
                                            "VALUES (?,?,?,?,?,?,?,?)",
            [project.folder, project.name, project.year,
             project.short_description, project.description,
             project.logoPath, project.headerPath, project.module],
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
                    mtiapp.webdb.addMember(project.members[i], insertId);
                }
                // insert technologies
                for (i=0; i<project.technologies.length; i++) {
                    mtiapp.webdb.addTechnology(project.technologies[i], insertId);
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
    console.debug("AddMember(" + member.login + ")");
    var db = mtiapp.webdb.db;
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
}


// add new image to a project
mtiapp.webdb.addImage = function(path, projectId) {
    console.debug("AddImage(" + path + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO image(projectId, imagePath) VALUES(?, ?)",
                      [projectId, path],
                      function(tx, r) { insertId = r.insertId; },
                      function(tx, e) {
                        alert("There has been an error: " + e.message);
                    });
    });
}


// add new video to a project
mtiapp.webdb.addVideo = function(path, projectId) {
    console.debug("AddVideo(" + path + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    var insertId = -1;
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO video(projectId, videoPath) VALUES(?, ?)",
                      [projectId, path],
                      function(tx, r) { insertId = r.insertId; },
                      function(tx, e) {
                        alert("There has been an error: " + e.message);
                      });
    });
    return insertId;
}


// add technology to a project
mtiapp.webdb.addTechnology = function(technology, projectId) {
    console.debug("AddTechnology(" + technology + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM technology WHERE technoName = ?",
            [technology],
            function(tx, rs) {
                if (rs.rows.length > 0) {
                    // Found, add it
                    mtiapp.webdb.addProjectTechnology(rs.rows.item(0).id, projectId);
                } else {
                    // Does not exist, create it
                    tx.executeSql("INSERT INTO technology(technoName) VALUES(?)",
                        [technology],
                        function(tx, r) {
                            // created, now add it
                            mtiapp.webdb.addProjectTechnology(r.insertId, projectId);
                        },
                        function(tx, e) {
                            alert("There has been an error: " + e.message);
                        });
                }
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}

// add projectTechnology
mtiapp.webdb.addProjectTechnology = function(technoId, projectId) {
    console.debug("AddProjectTechnology(" + technoId + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO projectTechnology(technologyId, projectId) " +
                      "VALUES(?, ?)",
                      [technoId, projectId],
                      function(tx, r) { console.debug("AddProjectTechnology:ok"); },
                      function(tx, e) {
                          alert("There has been an error: " + e.message);
                      });
    });
}


// add category to a project
mtiapp.webdb.addCategory = function(category, projectId) {
    console.debug("AddCategory(" + category + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM category WHERE categoryName = ?",
            [category],
            function(tx, rs) {
                if (rs.rows.length > 0) {
                    // Found, add it
                    mtiapp.webdb.addProjectCategory(rs.rows.item(0).id, projectId);
                }
                else {
                    // Does not exist, add it
                    tx.executeSql("INSERT INTO category(categoryName) VALUES(?)",
                        [category],
                        function(tx, r) {
                            // inserted, add it
                            mtiapp.webdb.addProjectCategory(r.insertId, projectId);
                        },
                        function(tx, e) {
                            alert("There has been an error: " + e.message);
                        });
                }
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}

// add projectCategory
mtiapp.webdb.addProjectCategory = function(categoryId, projectId) {
    console.debug("AddProjectCategory(" + categoryId + ", " + projectId + ")");
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO projectCategory(categoryId, projectId) " +
                      "VALUES(?, ?)",
                      [categoryId, projectId],
                      function(tx, r) { },
                      function(tx, e) {
                          alert("There has been an error: " + e.message);
                      });
    });
}


// Initialise database
function databaseInit() {
  mtiapp.webdb.open();
  mtiapp.webdb.init();
}

// get all projects
// onSuccessCallback(Array : projects)
function databaseGetAllProjects(onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, project.year, " +
                "project.shortDescription, project.description, " +
                "project.logoPath, project.headerPath, project.module, " +
                "image.imagePath, video.videoPath, member.firstname, " +
                "member.lastname, member.login, member.photoPath, " +
                "projectTechnology.technologyId, technology.technoName, " +
                "projectCategory.categoryId, category.categoryName ";
        q += "FROM project ";
        q += "LEFT JOIN image ON project.id = image.projectId ";
        q += "LEFT JOIN video ON project.id = video.projectId ";
        q += "LEFT JOIN member ON project.id = member.projectId ";
        q += "LEFT JOIN projectTechnology ON project.id = projectTechnology.projectId ";
        q += "LEFT JOIN technology ON projectTechnology.technologyId = technology.technoId ";
        q += "LEFT JOIN projectCategory ON project.id = projectCategory.projectId ";
        q += "LEFT JOIN category ON projectCategory.categoryId = category.categoryId ";
        tx.executeSql(q, [],
            function(tx, rs) {
                console.debug('Getting all projects...');
                var results = new Array();
                for (i=0; i<rs.rows.length; i++) {
                    results = addToProjectList(results, rs.rows.item(i));
                }
                
                onSuccessCallback(results);
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}

// from a database project object, create or edit an application project object
// add it into projectList
// return projectList
function addToProjectList(projectList, project) {
    var member = new Object();
    member.firstname = project.firstname;
    member.lastname = project.lastname;
    member.login = project.login
    member.photoPath = project.photoPath;
    
    for (j=0; j<projectList.length; j++) {
        if (projectList[j].id == project.id) {
            var k = 0;
            
            // adding image ?
            for (k=0; k<projectList[j].images.length; k++) {
                if (projectList[j].images[k] == project.imagePath) { break; }
            }
            if (k == projectList[j].images.length) {
                projectList[j].images.push(project.imagePath);
            }
            
            // adding video ?
            for (k=0; k<projectList[j].videos.length; k++) {
                if (projectList[j].videos[k] == project.videoPath) { break; }
            }
            if (k == projectList[j].videos.length) {
                projectList[j].videos.push(project.videoPath);
            }
            
            // adding member ?
            for (k=0; k<projectList[j].members.length; k++) {
                if (projectList[j].members[k].login == member.login) { break; }
            }
            if (k == projectList[j].members.length) {
                projectList[j].members.push(member);
            }
            
            // adding technology ?
            for (k=0; k<projectList[j].technologies.length; k++) {
                if (projectList[j].technologies[k] == project.technoName) { break; }
            }
            if (k == projectList[j].technologies.length) {
                projectList[j].technologies.push(project.technoName);
            }
            
            // adding category ?
            for (k=0; k<projectList[j].categories.length; k++) {
                if (projectList[j].categories[k] == project.categoryName) { break; }
            }
            if (k == projectList[j].categories.length) {
                projectList[j].categories.push(project.categoryName);
            }
            
            return projectList;
        }
    }
    
    project.images = new Array(project.imagePath);
    project.videos = new Array(project.videoPath);
    project.members = new Array(member);
    project.technologies = new Array(project.technoName);
    project.categories = new Array(project.categoryName);
    projectList.push(project);
    
    return projectList;
}
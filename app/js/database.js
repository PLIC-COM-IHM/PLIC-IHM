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
mtiapp.webdb.reinit = function() {
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
                "technology(technoId INTEGER PRIMARY KEY, name TEXT, logoPath TEXT)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created technology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
   
        q = "CREATE TABLE IF NOT EXISTS " +
                "projectTechnology(pTechnoId INTEGER PRIMARY KEY, projectId INTEGER, technologyId INTEGER)";
        tx.executeSql(q, [],
            function(tx, e) { console.debug('Created projectTechnology table'); },
            function(tx, e) { alert("There has been an error: " + e.message); });
    
        q = "CREATE TABLE IF NOT EXISTS " +
                "category(categoryId INTEGER PRIMARY KEY, name TEXT)";
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
        tx.executeSql("SELECT * FROM technology WHERE name = ?",
            [technology],
            function(tx, rs) {
                if (rs.rows.length > 0) {
                    // Found, add it
                    mtiapp.webdb.addProjectTechnology(rs.rows.item(0).technoId, projectId);
                } else {
                    // Does not exist, create it
                    tx.executeSql("INSERT INTO technology(name) VALUES(?)",
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
        tx.executeSql("SELECT * FROM category WHERE name = ?",
            [category],
            function(tx, rs) {
                if (rs.rows.length > 0) {
                    // Found, add it
                    mtiapp.webdb.addProjectCategory(rs.rows.item(0).categoryId, projectId);
                }
                else {
                    // Does not exist, add it
                    tx.executeSql("INSERT INTO category(name) VALUES(?)",
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
function dbInit() {
  mtiapp.webdb.open();
}


function dbReinit() {
  mtiapp.webdb.open();
  mtiapp.webdb.reinit();
}



/***
 *
 *  GET FUNCTIONS
 *
 */


// get all projects
// onSuccessCallback(Array : projects)
function dbGetAllProjects(onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, project.year, " +
                "project.shortDescription, project.description, " +
                "project.logoPath, project.headerPath, project.module, " +
                "image.imagePath, video.videoPath, member.firstname, " +
                "member.lastname, member.login, member.photoPath, " +
                "projectTechnology.technologyId, technology.name, " +
                "projectCategory.categoryId, category.name ";
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
            if (projectList[j].images != null) {
                for (k=0; k<projectList[j].images.length; k++) {
                    if (projectList[j].images[k] == project.imagePath) { break; }
                }
                if (k == projectList[j].images.length) {
                    projectList[j].images.push(project.imagePath);
                }
            }
            
            // adding video ?
            if (projectList[j].videos != null) {
                for (k=0; k<projectList[j].videos.length; k++) {
                    if (projectList[j].videos[k] == project.videoPath) { break; }
                }
                if (k == projectList[j].videos.length) {
                    projectList[j].videos.push(project.videoPath);
                }
            }
            
            // adding member ?
            if (projectList[j].members != null) {
                for (k=0; k<projectList[j].members.length; k++) {
                    if (projectList[j].members[k].login == member.login) { break; }
                }
                if (k == projectList[j].members.length) {
                    projectList[j].members.push(member);
                }
            }
            
            // adding technology ?
            if (projectList[j].technologies != null) {
                for (k=0; k<projectList[j].technologies.length; k++) {
                    if (projectList[j].technologies[k] == project.name) { break; }
                }
                if (k == projectList[j].technologies.length) {
                    projectList[j].technologies.push(project.name);
                }
            }
            
            // adding category ?
            if (projectList[j].categories != null) {
                for (k=0; k<projectList[j].categories.length; k++) {
                    if (projectList[j].categories[k] == project.name) { break; }
                }
                if (k == projectList[j].categories.length) {
                    projectList[j].categories.push(project.name);
                }
            }
            
            return projectList;
        }
    }
    
    project.images = new Array(project.imagePath);
    project.videos = new Array(project.videoPath);
    project.members = new Array(member);
    project.technologies = new Array(project.name);
    project.categories = new Array(project.name);
    projectList.push(project);
    
    return projectList;
}



// get all categories
// onSuccessCallback(Array : projects)
function dbGetAllCategories(onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT category.categoryId, category.name, count(projectCategory.projectId) as nbProjects " +
                "FROM category " +
                "JOIN projectCategory on category.categoryId = projectCategory.categoryId " +
                "GROUP BY category.name";
        tx.executeSql(q, [],
            function(tx, rs) {
                var results = new Array();
                for (i=0; i<rs.rows.length; i++) {
                    results.push(rs.rows.item(i));
                }
                
                onSuccessCallback(results);
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}


// get all technologies
// onSuccessCallback(Array : projects)
function dbGetAllTechnologies(onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT technology.technoId, technology.name, count(projectTechnology.projectId) as nbProjects " +
                "FROM technology " +
                "JOIN projectTechnology ON technology.technoId = projectTechnology.technologyId " +
                "GROUP BY technology.name";
        tx.executeSql(q, [],
            function(tx, rs) {
                var results = new Array();
                for (i=0; i<rs.rows.length; i++) {
                    results.push(rs.rows.item(i));
                }
                
                onSuccessCallback(results);
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}


// get all data (images & videos)
// onSuccessCallback(Array : projects)
function dbGetAllData(onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, " +
                "image.imagePath, video.videoPath " +
                "FROM project " +
                "LEFT JOIN image ON project.id = image.projectId " +
                "LEFT JOIN video ON project.id = video.projectId ";
        tx.executeSql(q, [],
            function(tx, rs) {
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


// getProjectById (projectId, onFoundCallback)
function dbGetProjectById(projectId, onFoundCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT * FROM project " +
                "LEFT JOIN image ON project.id = image.projectId " +
                "LEFT JOIN video ON project.id = video.projectId " +
                "LEFT JOIN member ON project.id = member.projectId " +
                "WHERE project.id = " + projectId;
        tx.executeSql(q, [],
            function(tx, rs) {
                var results = new Array();
                for (i=0; i<rs.rows.length; i++) {
                    results = addToProjectList(results, rs.rows.item(i));
                }
                if (results.length > 0)
                {
                    onFoundCallback(results[0]);
                }
                else
                {
                    alert("Project does not exist anymore.");
                }
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}

// search(searchKey, onFoundCallback)
// onFoundCallback(projectFound)
function dbSearch(searchKey, onFoundCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, project.year, " +
                "project.shortDescription, project.description, " +
                "project.logoPath, project.headerPath, project.module, " +
                "image.imagePath, video.videoPath, member.firstname, " +
                "member.lastname, member.login, member.photoPath, " +
                "projectTechnology.technologyId, technology.name, " +
                "projectCategory.categoryId, category.name ";
        q += "FROM project ";
        q += "LEFT JOIN image ON project.id = image.projectId ";
        q += "LEFT JOIN video ON project.id = video.projectId ";
        q += "LEFT JOIN member ON project.id = member.projectId ";
        q += "LEFT JOIN projectTechnology ON project.id = projectTechnology.projectId ";
        q += "LEFT JOIN technology ON projectTechnology.technologyId = technology.technoId ";
        q += "LEFT JOIN projectCategory ON project.id = projectCategory.projectId ";
        q += "LEFT JOIN category ON projectCategory.categoryId = category.categoryId ";
        q +=  "WHERE project.name LIKE '%" + searchKey + "%' OR ";
        q +=  " project.description LIKE '%" + searchKey + "%'";
        tx.executeSql(q, [],
            function(tx, rs) {
                var results = new Array();
                for (i=0; i<rs.rows.length; i++) {
                    results = addToProjectList(results, rs.rows.item(i));
                }
                
                onFoundCallback(results);
            },
            function(tx, e) {
                alert("There has been an error: " + e.message);
            });
    });
}

// getProjectOfTechnology(technoId, onSuccessCallback)
// onFoundCallback(projectFound)
function dbGetProjectOfTechnology(technoId, onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, project.year, " +
                "project.shortDescription, project.description, " +
                "project.logoPath, project.headerPath, project.module, " +
                "image.imagePath, video.videoPath, member.firstname, " +
                "member.lastname, member.login, member.photoPath, " +
                "projectTechnology.technologyId, technology.name, " +
                "projectCategory.categoryId, category.name ";
        q += "FROM project ";
        q += "LEFT JOIN image ON project.id = image.projectId ";
        q += "LEFT JOIN video ON project.id = video.projectId ";
        q += "LEFT JOIN member ON project.id = member.projectId ";
        q += "LEFT JOIN projectTechnology ON project.id = projectTechnology.projectId ";
        q += "LEFT JOIN technology ON projectTechnology.technologyId = technology.technoId ";
        q += "LEFT JOIN projectCategory ON project.id = projectCategory.projectId ";
        q += "LEFT JOIN category ON projectCategory.categoryId = category.categoryId ";
        q +=  "WHERE technology.technoId =" + technoId + "";
        tx.executeSql(q, [],
            function(tx, rs) {
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

// dbGetProjectOfCategory(categoryId, onSuccessCallback)
// onFoundCallback(projectFound)
function dbGetProjectOfCategory(categoryId, onSuccessCallback) {
    // get project
    var db = mtiapp.webdb.db;
    db.transaction(function(tx) {
        // creating query with all join
        var q = "SELECT project.id, project.folder, project.name, project.year, " +
                "project.shortDescription, project.description, " +
                "project.logoPath, project.headerPath, project.module, " +
                "image.imagePath, video.videoPath, member.firstname, " +
                "member.lastname, member.login, member.photoPath, " +
                "projectTechnology.technologyId, technology.name, " +
                "projectCategory.categoryId, category.name ";
        q += "FROM project ";
        q += "LEFT JOIN image ON project.id = image.projectId ";
        q += "LEFT JOIN video ON project.id = video.projectId ";
        q += "LEFT JOIN member ON project.id = member.projectId ";
        q += "LEFT JOIN projectTechnology ON project.id = projectTechnology.projectId ";
        q += "LEFT JOIN technology ON projectTechnology.technologyId = technology.technoId ";
        q += "LEFT JOIN projectCategory ON project.id = projectCategory.projectId ";
        q += "LEFT JOIN category ON projectCategory.categoryId = category.categoryId ";
        q +=  "WHERE category.categoryId =" + categoryId + "";
        tx.executeSql(q, [],
            function(tx, rs) {
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
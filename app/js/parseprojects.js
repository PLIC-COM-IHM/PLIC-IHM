// Parse projects folder and insert results in database
function parseProjects() {
    console.debug("parseProject()");
    
    $.ajax({ 
        type: "GET", 
        url: "projects/",
        success: parseProjectsHtml
    });
}

// Parse 'projects' folder
function parseProjectsHtml(data) {
    //console.debug('parseProjectHtml(' + data + ')');
    
    var results = new Array(), intd = false;
    HTMLParser(data, {
        start: function(tag, attrs, unary) {
            if (tag == "td") {
                intd = true;
            } else if (intd && tag == "a") {
                // find href attributes in <a>
                for (var i = 0; i < attrs.length; i++) {
                    if (attrs[i].name == "href") {
                        results.push(attrs[i].value);
                    }
                }
            }
        },
        
        end: function(tag) {
            if (tag == "td") {
                intd = false;
            }
        }
    });
    
    // remove back link
    results.shift();
    
    console.debug(results.length + ' result(s) found');
    
    for (var i = 0; i < results.length; i++) {
        parseProjectFolder('projects/' + results[i]);
    }
}

// parse a project folder and put extracted data in database 
function parseProjectFolder(folder) {
    var json = folder + 'project.json'
    //console.debug('parseProjectFolder(' + json + ')');
    
    $.getJSON(json, function(data) {
        // get images
        $.ajax({ 
            type: "GET", 
            url: folder + "media/images/",
            success: function (media) {
                data.images = parseMediaFolder(media);
            },
            async: false
        });
        
        // get videos
        $.ajax({ 
            type: "GET", 
            url: folder + "media/videos/",
            success: function (media) {
                data.videos = parseMediaFolder(media);
            },
            async: false
        });
        
        console.debug('project: ' + data.name);
        console.debug('project-images: ' + data.images);
        console.debug('project-videos: ' + data.videos);
        
        // add to database
        mtiapp.webdb.addProject(data);
    });
}


// Parse media folder. Return an array
function parseMediaFolder(media) {
    //console.debug('parseMediaFolder(' + media + ')');
    
    var results = new Array(), intd = false;
    HTMLParser(media, {
        start: function(tag, attrs, unary) {
            if (tag == "td") {
                intd = true;
            } else if (intd && tag == "a") {
                // find href attributes in <a>
                for (var i = 0; i < attrs.length; i++) {
                    if (attrs[i].name == "href") {
                        results.push(attrs[i].value);
                    }
                }
            }
        },
        
        end: function(tag) {
            if (tag == "td") {
                intd = false;
            }
        }
    });
    
    // remove back link
    results.shift();
    
    console.debug(results.length + ' media found');

    return results; 
}
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
function parseProjectsHtml(htmldata) {
    var results = parseFolder(htmldata);
    
    for (var i = 0; i < results.length; i++) {
        parseProjectFolder('projects/' + results[i] + '/');
    }
}

// parse a project folder and put extracted data in database 
function parseProjectFolder(folder) {
    var json = folder + 'project.json'
    
    $.getJSON(json, function(data) {
        // get images
        $.ajax({ 
            type: "GET", 
            url: folder + "media/images/",
            success: function (media) {
                data.images = parseFolder(media);
        
                // get videos
                $.ajax({ 
                    type: "GET", 
                    url: folder + "media/videos/",
                    success: function (media) {
                        data.videos = parseFolder(media);
                        
                        // add to database
                        console.debug(JSON.stringify(data));
                        mtiapp.webdb.addProject(data);
                    }
                });
            }
        });
    });
}


// Parse folder. Return an array which contains all elements (like ls)
function parseFolder(htmldata) {
    var results = new Array();
    
    // parse html string
    while (htmldata != "") {
        // search '<script>addRow("'
        var pos = htmldata.indexOf('<script>addRow("');
        if (pos < 0) {
            htmldata = ""
        } else {
            pos += 16; // remove '<script>addRow("'
            htmldata = htmldata.substring(pos);
            
            // search '","'
            pos = htmldata.indexOf('","');
            if (pos > 0) {
                var value = htmldata.substring(0, pos);
                
                // add it
                results.push(value);
            } else {
                htmldata = "";
            }
        }
    }
    
    results.shift();
    
    console.debug('Folder contains: ' + results);

    return results; 
}
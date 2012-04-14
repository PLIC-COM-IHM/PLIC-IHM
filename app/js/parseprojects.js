// Parse projects folder and insert results in database
function parseProjects() {
    if (debug) {
        $('#debug').append("parseProject()<br/>");
    }
    
    $.ajax({ 
        type: "GET", 
        url: "projects/",
        success: parseProjectsHtml
    });
}

function parseProjectsHtml(data)
{
    if (debug) {
        $('#debug').append('parseProjectHtml(' + data + ')<br/>');
    }
    
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
    
    if (debug) {
        $('#debug').append(results.length + ' result(s) found');
    }
    
    $('#test').append("<ul>"); 
    for (var i = 0; i < results.length; i++) {
        $('#test').append("<li>" + results[i] + "</li>"); 
    }
    $('#test').append("</ul>"); 
}
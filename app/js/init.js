var debug=false;

$(document).ready(function() {
    if (debug) {
        $('#debug').append("init()<br/>");
    }
    
    parseProjects();
});
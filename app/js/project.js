var project = null;

function page_main() {
    projectId = location.search.substring(2);
    dbGetProjectById(parseInt(projectId), createPage);
    
    $('.image').attr('id', 'p' + projectId);
}

function createPage(p)
{
    stopLoading();
    
    project = p;
    
    $('#content h1').text(project.name);
    $('#content p').text(project.shortDescription);
    $('.pres p').text(project.description);
}
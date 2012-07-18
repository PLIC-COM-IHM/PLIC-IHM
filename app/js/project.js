var project = null;

function page_main() {
    projectId = location.search.substring(2);
    dbGetProjectById(parseInt(projectId), createPage);
    
    $('.image').attr('id', 'p' + projectId);
    $('.pres a').attr('href', '#?p' + projectId);
    $('.image a').attr('href', 'gallery.html?p' + projectId);
    $('.video a').attr('href', 'video.html?v' + projectId);
}

function createPage(p)
{
    stopLoading();
    
    project = p;
    
    $('#content h1').text(project.name);
    $('#content p').text(project.shortDescription);
    $('.pres p').text(project.description);
    
    $('.video video').attr('src', p.folder + 'media/videos/' + p.videoPath);
}
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
    $('#content h6').text("Promotion " + p.year);
    
    if (p.members != null && p.members.length > 0 && p.members[0].firstname != null) {
        membersStr = ""
        for (i=0; i<p.members.length; ++i) {
            membersStr += ", " + p.members[i].firstname + " " + p.members[i].lastname;
        }
        $('#content h5').text(membersStr.substring(2));
    }
    $('#content #desc').html(project.description);
    
    $('.video video').attr('src', p.folder + 'media/videos/' + p.videoPath);
}
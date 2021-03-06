var project = null;

function page_main() {
    filter = location.search.substring(1, 2);
    filterId = location.search.substring(2);
    
    if (filter == "t") {
        dbGetProjectOfTechnology(filterId, createPage);
    }
    else if (filter == "c") {
        dbGetProjectOfCategory(filterId, createPage);
    }
    else if (filter == "p") {
        window.location = 'project.html' + location.search;
    }
}

function createPage(projectList)
{
    stopLoading();
    
    $('#resultList').empty();
    for (i=0; i<projectList.length; i++) {
            id = 'p' + projectList[i].id;
            if (projectList[i].images.length > 0) {
                    image = '<img width="128" height="128" src="' + projectList[i].folder + 'media/images/' + projectList[i].images[0] + '" alt="" />';
            }
            else {
                    '<img src="" alt="" />';
            }
            title = '<strong>' + projectList[i].name + '</strong>';
            desc = '<em>' + projectList[i].shortDescription + '</em>';
            projectHtml = '<li><a href="project.html?' + id + '">' + image + title + desc + '</a></li>';
            $('#resultList').append(projectHtml);
    }
}
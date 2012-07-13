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
}

function createPage(projectList)
{
    stopLoading();
    
    $('#resultList').empty();
    for (i=0; i<projectList.length; i++) {
            if (projectList[i].images.length > 0) {
                    image = '<img width="128" height="128" src="' + projectList[i].folder + 'media/images/' + projectList[i].images[0] + '" alt="" />';
            } else {
                    '<img src="" alt="" />';
            }
            title = '<strong>' + projectList[i].name + '</strong>';
            desc = '<em>' + projectList[i].shortDescription + '"</em>';
            projectHtml = '<li>' + image + title + desc + '</li>';
            $('#resultList').append(projectHtml);
    }
}
var projectList = null;

function page_main() {
    console.debug('Trying to instanciate homepage...');
    dbGetAllTechnologies(hpInstantiateTechnologies);
}

function hpInstantiateTechnologies(technologies) {
    // Is database ready ?
    if (technologies.length == 0) { window.setTimeout(page_main, 500); return; }

    stopLoading();
    $('#arrowleft').hide();
    $('#videoTileList').hide();
    $('#imageTileList').hide();
    
    console.debug('Instanciate home page categories');
    
    // For eatch technologoie, we are going to generate a tile
    for (i = 0; i < technologies.length; i++) {
        id = 't' + technologies[i].technoId;
        imagePath = 'data/technologies/' + technologies[i].name + '.png';
        nbProjects = technologies[i].nbProjects + (technologies[i].nbProjects <= 1 ? ' projet' : ' projets');
        htmlTile = '<div class="tile flippable" id="' + id + '">' + 
                        '<div><img src="' + imagePath + '" alt="' + capitaliseFirstLetter(technologies[i].name) + '" /></div>' + 
                        '<p><strong>' + capitaliseFirstLetter(technologies[i].name) + '</strong><em>' + nbProjects + '</em></p>' +
                    '</div>';
        $('#technologiesTileList').append(htmlTile);
    }
    
    
    // Get technologies
    dbGetAllCategories(hpInstantiateCategorie);
}

function hpInstantiateCategorie(categories) {
    console.debug('Instanciate home page categories');
    
    for (i=0; i<categories.length; i++) {
        id = 'c' + categories[i].categoryId;
        nbProjects = categories[i].nbProjects + (categories[i].nbProjects <= 1 ? ' projet' : ' projets');
        htmlTile = '<a data-transition="slide" href="projectList.html?' + id + '"><li width="128" height="128" id="' + id + '"><strong>' + categories[i].name + '</strong><em>' + nbProjects + '</em></a></li>';
        htmlTile = '<div class="tile" id="' + id + '">' + 
                '<p><strong>' + categories[i].name + '</strong><em>' + nbProjects + '</em></p>' +
            '</div>';
        $("#categoryTileList").append(htmlTile);
    }
    
    // Get technologies
    dbGetAllData(hpInstantiateData);
}

function hpInstantiateData(projects) {
    console.debug('Instanciate home page videos');
    
    // save list
    projectList = projects;
    
    console.debug('Instanciate home page videos');
    // Create images tiles
    for (i=0; i<projects.length; i++) {
        if (projects[i].videoPath != null)
        {
            pid = 'p' + projects[i].id;
            video = '<video class="vtuile" width="128" height="128" loop src="' + projects[i].folder + 'media/videos/' + projects[i].videoPath + '">';
            htmlTile = '<li><a href="project.html?' + pid + '">'+ video + '</a></li>';
            $("#videoTileList").append(htmlTile);
        }
    }
    
    console.debug('Instanciate home page images');
    // Create images tiles
    for (i=0; i<projects.length; i++) {
        if (projects[i].images != null && projects[i].images.length > 0)
        {
            pid = 'p' + projects[i].id;
            htmlTile = '<li><a href="project.html?' + pid + '"><img width="128" height="128" id="' + pid + '" class="ituile" src="" alt="" /></a></li>';
            $("#imageTileList").append(htmlTile);
        }
    }
    
    animateTiles();
    bindClicks();
}

function bindClicks() {
    $('.tile').bind("click",function(){
	window.location = 'projectList.html?' + $(this).attr('id');
    });
}



function nextTitles()
{
    $('#arrowleft').show();
    $('#arrowright').hide();
    $('#technologyTileList').hide(500);
    $('#categoryTileList').hide(500);
    $('#videoTileList').show(1000);
    $('#imageTileList').show(1000);
    
    flipAvailable = false;
}


function prevTitles()
{
    $('#arrowleft').hide();
    $('#arrowright').show();
    $('#technologyTileList').show(1000);
    $('#categoryTileList').show(1000);
    $('#videoTileList').hide(500);
    $('#imageTileList').hide(500);
    
    flipAvailable = true;
}



function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
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
        $('#technologyTileList').append(htmlTile);
    }
    
    
    // Get technologies
    dbGetAllCategories(hpInstantiateCategorie);
}

function hpInstantiateCategorie(categories) {
    console.debug('Instanciate home page categories');
    
    for (i=0; i<categories.length; i++) {
        id = 'c' + categories[i].categoryId;
        nbProjects = categories[i].nbProjects + (categories[i].nbProjects <= 1 ? ' projet' : ' projets');
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
            id = 'p' + projects[i].id;
            video = '<video class="vtuile" width="160" height="160" loop src="' + projects[i].folder + 'media/videos/' + projects[i].videoPath + '">';
            htmlTile = '<div class="tile video" id="' + id + '">' +
                            '<div>' + video + '</div>' +
                            '<p><strong>' + projects[i].name + '</strong></p>' +
                        '</div>';
            $("#videoTileList").append(htmlTile);
        }
    }
    
    console.debug('Instanciate home page images');
    // Create images tiles
    for (i=0; i<projects.length; i++) {
        if (projects[i].images != null && projects[i].images.length > 0)
        {
            id = 'p' + projects[i].id;
            imagePath = projects[i].folder + 'media/images/' + projects[i].images[0];
            htmlTile = '<div class="tile image" id="' + id + '">' + 
                        '<div><img style="max-width:128px;max-height:128px;" src="' + imagePath + '" alt="' + projects[i].name + '" /></div>' + 
                        '<p><strong>' + projects[i].name + '</strong></p>' +
                    '</div>';
            $("#imageTileList").append(htmlTile);
        }
    }
    
    animateTiles();
    bindClicks();
    
    flipAvailable = true;
    changePictureAvailable = false;
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
    changePictureAvailable = true;
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
    changePictureAvailable = false;
}



function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
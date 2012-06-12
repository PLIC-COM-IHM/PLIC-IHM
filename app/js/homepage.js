var projectList = null;

function page_main() {
    console.debug('Trying to instanciate homepage...');
    dbGetAllCategories(hpInstantiateCategorie);

    $('.tilelist li').click(tileClick);
}

function hpInstantiateCategorie(categories) {
    // db filled ?
    if (categories.length == 0) { window.setTimeout(page_main, 500); return; }

    stopLoading();
    $('#previouspage').hide();
    $('#videoTileList').hide();
    $('#imageTileList').hide();

    console.debug('Instanciate home page categories');
    
    for (i=0; i<categories.length; i++) {
        var id = 'c' + categories[i].categoryId;
        var nbProjects = categories[i].nbProjects + (categories[i].nbProjects <= 1 ? ' projet' : ' projets');
        var htmlTile = '<li id="' + id + '"><strong>' + categories[i].name + '</strong><em>' + nbProjects + '</em></li>';
        $("#categorytilelist").append(htmlTile);
    }
    
    // Get technologies
    dbGetAllTechnologies(hpInstantiateTechnologies);
}

function hpInstantiateTechnologies(technologies) {
    console.debug('Instanciate home page categories');
    
    for (i=0; i<technologies.length; i++) {
        var id = 't' + technologies[i].technoId;
        var imagePath = 'data/technologies/' + technologies[i].name + '.png';
        var nbProjects = technologies[i].nbProjects + (technologies[i].nbProjects <= 1 ? ' projet' : ' projets');
        var htmlTile = '<li id="' + id + '"><img src="' + imagePath + '" alt="" /><em>' + nbProjects + '</em></li>'
        $('#technologiestilelist').append(htmlTile);
    }
    
    
    // Get technologies
    dbGetAllData(hpInstantiateData);
}

function hpInstantiateData(projects) {
    console.debug('Instanciate home page videos');
    
    // save list
    projectList = projects;
    
    $("#videostilelist").append('<li><video class="vtuile" width="128" height="128" loop src="projects/plic-comihm-2013/media/videos/IHM.mp4"></li>');
    $("#videostilelist").append('<li><video class="vtuile" width="128" height="128" loop src="projects/plic-comihm-2013/media/videos/plic_social_network.mp4"></li>');
    
    console.debug('Instanciate home page images');
    // Create images tiles
    for (i=0; i<projects.length; i++) {
        if (projects[i].images != null && projects[i].images.length > 0)
        {
            var pid = 'p' + projects[i].id;
            var htmlTile = '<li id="' + pid + '"><img width="128" height="128" class="ituile" src="" alt="" /></li>';
            $("#imageTileList").append(htmlTile);
        }
    }
}



function nextTitles()
{
    $('#previouspage').show();
    $('#nextpage').hide(1000);
    $('#technologyTileList').hide(1000);
    $('#categoryTileList').hide(1000);
    $('#videoTileList').show(1000);
    $('#imageTileList').show(1000);
}


function prevTitles()
{
    $('#previouspage').hide(1000);
    $('#nextpage').show();
    $('#technologyTileList').show(1000);
    $('#categoryTileList').show(1000);
    $('#videoTileList').hide(1000);
    $('#imageTileList').hide(1000);
}


/* Navigation */
function tileClick()
{
    alert('toto');
    console.debug('Clicked on homepage tile');
    parentId = $(this).parent().attr('id');
    if (parentId == 'imageTileList')
    {
        window.location = 'project.html?' + $(this).attr('id');
    }
}
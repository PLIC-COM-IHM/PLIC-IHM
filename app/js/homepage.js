function homepage() {
    console.debug('Trying to instanciate homepage...');
    dbGetAllCategories(hpInstantiateCategorie);
    
    
    $('#previouspage').hide();
}

function hpInstantiateCategorie(categories) {
    // db filled ?
    if (categories.length == 0) { window.setTimeout(homepage, 500); return; }

    console.debug('Instanciate home page categories');
    $("#content").empty()
    .append('<div class="tilelist" id="categoryTileList">' +
                '<h3>Categories</h3>' +
                '<ul id="categorytilelist"></ul>' +
            '</div>');
    
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
    $("#content").append('<div class="tilelist" id="technologyTileList">' +
                            '<h3>Technologies</h3>' +
                            '<ul id="technologiestilelist"></ul>' +
                        '</div>');
    
    for (i=0; i<technologies.length; i++) {
        var id = 't' + technologies[i].technoId;
        var imagePath = 'data/technologies/' + technologies[i].name + '.png';
        var nbProjects = technologies[i].nbProjects + (technologies[i].nbProjects <= 1 ? ' projet' : ' projets');
        var htmlTile = '<li id="' + id + '"><img src="' + imagePath + '" alt="" /><em>' + nbProjects + '</em></li>'
        $('#technologiestilelist').append(htmlTile);
    }
    
    // Get videos
    hpInstantiateVideos(null);
}

function hpInstantiateVideos(technologies) {
    console.debug('Instanciate home page videos');
    $("#content").append('<div class="tilelist" id="videoTileList">' +
                            '<h3>Videos</h3>' +
                            '<ul id="videostilelist"></ul>' +
                        '</div>');
    
    $("#videostilelist").append('<li><video class="vtuile" width="128" height="128" loop src="projects/plic-comihm-2013/media/videos/IHM.mp4" onclick="set_controls(this);" ></li>');
    $("#videostilelist").append('<li><video class="vtuile" width="128" height="128" loop src="projects/plic-comihm-2013/media/videos/plic_social_network.mp4" onclick="set_controls(this);" ></li>');
    
    // hide it
    $(".tilelist:last").hide();
    
    // Get images
    hpInstantiateImages(null);
}

function hpInstantiateImages(images) {
    console.debug('Instanciate home page images');
    $("#content").append('<div class="tilelist" id="imageTileList">' +
                            '<h3>Images</h3>' +
                            '<ul id="imagestilelist"></ul>' +
                        '</div>');
    
    // hide it
    $(".tilelist:last").hide();
}


function nextTitles()
{
    $('#previouspage').show(1000);
    $('#nextpage').hide(1000);
    $('#categoryTileList').hide(1000);
    $('#technologyTileList').hide(1000);
    $('#videoTileList').show(1000);
    $('#imageTileList').show(1000);
}


function prevTitles()
{
    $('#previouspage').hide(1000);
    $('#nextpage').show(1000);
    $('#categoryTileList').show(1000);
    $('#technologyTileList').show(1000);
    $('#videoTileList').show(1000);
    $('#imageTileList').hide(1000);
}

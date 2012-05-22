function homepage() {
    console.debug('Trying to instanciate homepage...');
    dbGetAllCategories(hpInstantiateCategorie);
}

function hpInstantiateCategorie(categories) {
    // db filled ?
    if (categories.length == 0) { window.setTimeout(homepage, 500); return; }

    console.debug('Instanciate home page categories');
    $("#content").empty()
    .append('<div class="tilelist"><h3>Categories</h3><ul id="categorytilelist"></ul></div>');
    
    for (i=0; i<categories.length; i++) {
        $("#categorytilelist").append("<li>" + categories[i].categoryName + "</li>");
    }
    
    // Get technologies, images and videos
    dbGetAllTechnologies(hpInstantiateTechnologies);
}

function hpInstantiateTechnologies(technologies) {
    console.debug('Instanciate home page categories');
    $("#content").append('<div class="tilelist"><h3>Technologies</h3><ul id="technologiestilelist" ></ul></div>');
    
    for (i=0; i<technologies.length; i++) {
        $('#technologiestilelist').append("<li><img src=\"data/technologies/" + technologies[i].technoName + ".png\" alt=\"\" /></li>");
    }
}

function hpInstantiateImages(images) {
    console.debug('Instanciate home page images');
    $("#content").append('<div class="tilelist"><h3>Images</h3><ul id="imagestilelist"></ul></div>');
    
    for (i=0; i<images.length; i++) {
        $("#imagestilelist").append("<li>" + technologies[i].technoName + "</li>");
    }
}

function hpInstantiateVideos(technologies) {
    console.debug('Instanciate home page videos');
    $("#content").append('<div class="tilelist"><h3>Videos</h3><ul id="videostilelist"></ul></div>');
    
    for (i=0; i<technologies.length; i++) {
        $("#videostilelist").append("<li>" + technologies[i].technoName + "</li>");
    }
    
}
function homepage() {
    console.debug('Trying to instanciate homepage...');
    dbGetAllCategories(hpInstantiateCategorie);
}

function hpInstantiateCategorie(categories) {
    // db filled ?
    if (categories.length == 0) { window.setTimeout(homepage, 500); return; }

    console.debug('Instanciate home page categories');
    $("#content").empty()
    .append('<div id="categorytilelist" class="tilelist"><h3>Categories</h3></div>');
    
    for (i=0; i<categories.length; i++) {
        $("#categorytilelist").append(categories[i].categoryName);
    }
    
    dbGetAllTechnologies(hpInstantiateTechnologies);
}

function hpInstantiateTechnologies(technologies) {
    console.debug('Instanciate home page categories');
    $("#content").append('<div id="technologiestilelist" class="tilelist"><h3>Technologies</h3></div>');
    
    for (i=0; i<technologies.length; i++) {
        $("#technologiestilelist").append(technologies[i].technoName);
    }
    
    //dbGetAllTechnologies(hpInstantiateCategorie);
}

function hpInstantiateImages(images) {
    console.debug('Instanciate home page images');
    $("#content").append('<div id="imagestilelist" class="tilelist"><h3>Technologies</h3></div>');
    
    for (i=0; i<images.length; i++) {
        $("#imagestilelist").append(technologies[i].technoName);
    }
    
    //dbGetAllTechnologies(hpInstantiateCategorie);
}

function hpInstantiateVideos(technologies) {
    console.debug('Instanciate home page videos');
    $("#content").append('<div id="videostilelist" class="tilelist"><h3>Technologies</h3></div>');
    
    for (i=0; i<technologies.length; i++) {
        $("#videostilelist").append(technologies[i].technoName);
    }
    
    //dbGetAllTechnologies(hpInstantiateCategorie);
}
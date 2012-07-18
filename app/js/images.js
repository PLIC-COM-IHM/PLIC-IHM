var project;
var index;

function page_main()
{
	mediaType = location.search.substring(1, 2);
	
        // TODO: real parse
	projectId = location.search.substring(2, 3);
	index = location.search.substring(4, 5);
        
	dbGetProjectById(parseInt(projectId), createPage);
}

function createPage(p)
{
	stopLoading();
	
	project = p;
	
        $('#media').attr('src', project.folder + "media/images/" + project.images[index]);
}

function ileft ()
{
        index = (index - 1 + project.images.length) % project.images.length;
        $('#media').attr('src', project.folder + "media/images/" + project.images[index]);
}
function iright()
{
        index = (index + 1) % project.images.length;
        $('#media').attr('src', project.folder + "media/images/" + project.images[index]);
}
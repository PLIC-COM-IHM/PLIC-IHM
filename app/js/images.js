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
	
	/*
	for (i=0; i<project.images.length; ++i) {
		image = project.folder + "media/images/" + project.images[i];
		item = '<li><img src="' + image + '" alt="" style="height:600px; width:800px;" /></li>';
		$('ul').append(item);
		console.debug(item);
	}
	*/
        $('#media').attr('src', project.folder + "media/images/" + project.images[index]);
}

function ileft ()
{
        index = (index - 1 + project.images.length) % project.images.length;
	$('#media').fadeOut('fast', function () {
		$('#media').attr('src', project.folder + "media/images/" + project.images[index]);
		$('#media').fadeIn();
	});
}
function iright()
{
        index = (index + 1) % project.images.length;
	$('#media').fadeOut('fast', function () {
		$('#media').attr('src', project.folder + "media/images/" + project.images[index]);
		$('#media').fadeIn();
	});
}
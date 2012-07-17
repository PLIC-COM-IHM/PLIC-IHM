var project ;

function page_main()
{
	projectId = location.search.substring(2);
	dbGetProjectById(parseInt(projectId), createPage);
    
	$('.image').attr('id', 'p' + projectId);
}

function createPage(p)
{
	stopLoading();
	
	project = p;
	
		for (i=0; i < project.images.length; i++)
		{
			src = project.folder + "media/images/" + project.images[i];
			html = '<img class="media" width="132" heigth="132" src="' + src + '" alt="" onclick="" />';
			$("#gallery").append(html);
		}
}
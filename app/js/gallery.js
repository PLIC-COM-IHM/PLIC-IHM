var project;
var mediaType;

function page_main()
{
	mediaType = location.search.substring(1, 2);
	
	projectId = location.search.substring(2);
	dbGetProjectById(parseInt(projectId), createPage);
    
	$('.image').attr('id', 'p' + projectId);
	
	if (mediaType == "p") {
		$('h1').text("Photos");
	}
	else if (mediaType == "v") {	
		$('h1').text("Videos");
	}
}

function createPage(p)
{
	stopLoading();
	
	project = p;
	
	if (mediaType == "p") {
		for (i=0; i < project.images.length; i++)
		{
			src = project.folder + "media/images/" + project.images[i];
			img = '<img class="media" width="132" heigth="132" src="' + src + '" alt="" onclick="" />';
			html = '<a href="images.html?p' + project.id + 'i' + i + '">' + img + '</a>';
			$("#gallery").append(html);
		}
	}
}

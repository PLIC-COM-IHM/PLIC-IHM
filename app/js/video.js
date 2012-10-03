function page_main()
{
	projectId = location.search.substring(2);
        
	dbGetProjectById(parseInt(projectId), createPage);
}

function createPage(p)
{
	stopLoading();	
	$('#vmedia').attr('src', p.folder + 'media/videos/' + p.videoPath);
}

function videoread ()
{
	//alert("vread");
}

function imedia ()
{
	//alert ("media");
}
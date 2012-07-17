function page_main()
{
	reloadResults();
	stopLoading();
}

function addkey (text)
{
	document.getElementById("searchfield").value += text.innerHTML;
	reloadResults()
}

function spacekey ()
{
	document.getElementById("searchfield").value += " ";
}

function remkey ()
{
	document.getElementById("searchfield").value =
		document.getElementById("searchfield").value.slice(
			0, document.getElementById("searchfield").value.length - 1);
	reloadResults()
}

function enterkey ()
{
	console.debug('Enter key');
	reloadResults()
	$('#keyzone').hide(1000);
}

function reloadResults()
{
	result = document.getElementById("searchfield").value;
	dbSearch(result, showResults);
}

function showResults(projectList)
{
	$('#resultList').empty();
	for (i=0; i<projectList.length; i++) {
		id = 'p' + projectList[i].id;
		if (projectList[i].images.length > 0) {
			image = '<img width="128" height="128" src="' + projectList[i].folder + 'media/images/' + projectList[i].images[0] + '" alt="" />';
		}
		else {
			'<img src="" alt="" />';
		}
		title = '<strong>' + projectList[i].name + '</strong>';
		desc = '<em>' + projectList[i].shortDescription + '"</em>';
		projectHtml = '<li><a href="project.html?' + id + '">' + image + title + desc + '</a></li>';
		$('#resultList').append(projectHtml);
	}
}
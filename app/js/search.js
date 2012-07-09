function page_main()
{
	
}

function addkey (text)
{
	document.getElementById("searchfield").value += text.innerHTML;
	//result = document.getElementById("champ").value;
	//dbSearch(result, showResults);
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
}

function enterkey ()
{
	console.debug('Enter key');
	result = document.getElementById("searchfield").value;
	dbSearch(result, showResults);
	$('#keyzone').hide(1000);
}

function showResults(projectList)
{
	console.debug('Showing results...');
	$('#resultList').empty();
	for (i=0; i<projectList.length; i++) {
		console.debug('Showing result: ' + projectList[i].name);
		projectHtml = '<li>' + projectList[i].name + '</li>';
		$('#resultList').append(projectHtml);
	}
}
function page_main()
{
	
}

function addkey (text)
{
	document.getElementById("champ").value += text.innerHTML;
	//result = document.getElementById("champ").value;
	//dbSearch(result, showResults);
}

function spacekey ()
{
	document.getElementById("champ").value += " ";
}

function remkey ()
{

	document.getElementById("champ").value =
		document.getElementById("champ").value.slice(
			0, document.getElementById("champ").value.length - 1);
}

function enterkey ()
{
	console.debug('Enter key');
	result = document.getElementById("champ").value;
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
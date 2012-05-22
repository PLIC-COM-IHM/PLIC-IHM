$(document).ready(
	function()
	{

	}
);

function addkey (text)
{
	document.getElementById("champ").value += text.innerHTML;
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
	result = document.getElementById("champ").value;

}
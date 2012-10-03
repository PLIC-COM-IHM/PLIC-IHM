
function back ()
{
	//alert ("back");
}

function videoread ()
{
	//alert("vread");
}

function imedia ()
{
	//alert ("media");
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

/*
** Class vidéo pour tuiles vidéos
*/


/*
** Constantes
*/

// delay and offset videos
VDELAY = 2000; //ms
VOFFSET = 6; //s

// delay pictures
PDELAY = 3000; //ms


/*
** Fonctions
*/

$(document).ready(
	function()
	{
		var timer = null;
		
		timer = setTimeout(displayPictures,1000);
		timer = setTimeout(displayUniPictures,1000);
		timer = setTimeout(displayVideo, 1000);
	}
);

function getElementsByClass(classe,tag)
{
     var divs = document.getElementsByTagName(tag);
     var resultats = new Array();
     for(var i=0; i<divs.length; i++)
          if(divs[i].className == classe)
               resultats.push(divs[i]);
     return resultats;
}

//TODO
function lister (path)
{
	var resultats = new Array();
	
	
	return resultats;
}


/* Video */

function displayVideo()
{
	videos = getElementsByClass("vtuile", "video");
	for (i = 0 ; i < videos.length; i++)
		changeOffset(videos[i]);
	timer = setTimeout(displayVideo, VDELAY);
}

function changeOffset(video)
{
	video.currentTime = video.currentTime + VOFFSET;
}


/* Pictures */
function displayPictures ()
{
	imgs = getElementsByClass("ituile", "img");
	for (i = 0 ; i < imgs.length; i++)
		changePicture(imgs[i]);

	timer = setTimeout(displayPictures, PDELAY);
}

//
function changePicture (img)
{
	projectId = img.id.substring(1);
	project = getProjectById(parseInt(projectId));
	if (project != null)
	{
		random = Math.floor(Math.random() * (project.images.length));
		imgUrl = project.folder + 'media/images/' + project.images[random];
		console.debug('Changing image of project #' + project.id + ' by ' + imgUrl);
		img.src = imgUrl;
	}
}


function displayUniPictures ()
{
	imgs = getElementsByClass("iunituile", "img");
	for (i = 0 ; i < imgs.length; i++)
		changeUniPicture(imgs[i]);

	timer = setTimeout(displayUniPictures, PDELAY);
}

//
function changeUniPicture (img)
{
	projectId = img.parentNode.id.substring(1);
	if (project != null)
	{
		random = Math.floor(Math.random() * (project.images.length));
		imgUrl = project.folder + 'media/images/' + project.images[random];
		console.debug('Changing image of project #' + project.id + ' by ' + imgUrl);
		img.src = imgUrl;
	}
}


function getProjectById(id)
{
	if (projectList == null)
		return null;

	for (i=0; i<projectList.length; ++i)
	{
		if (projectList[i].id == id)
		{
			return projectList[i];
		}
	}
	
	return null;
}

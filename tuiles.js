/*
** Class vid�o pour tuiles vid�os
*/


/*
** Constantes
*/

// delay and offset videos
VDELAY = 2000; //ms
VOFFSET = 6; //s

// delay pictures
PDELAY = 2000; //ms


/*
** Fonctions
*/

$(document).ready(
	function()
	{
		var timer = null;
		
		timer = setTimeout(displayPictures,1000);
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

//TODO
function changePicture (img)
{
	//liste = lister(img.alt);
	//img.src = ;
}



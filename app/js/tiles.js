/* Tiles animation core */
var flipAvailable = false;
var changePictureAvailable = false;

function animateTiles() {
    animateVideo();
    animateFlippableTiles();
    animateImageTiles();
}


/* Video */
VDELAY = 2000; //ms
VOFFSET = 6; //s

function getElementsByClass(classe,tag)
{
     var divs = document.getElementsByTagName(tag);
     var resultats = new Array();
     for(var i=0; i<divs.length; i++)
          if(divs[i].className == classe)
               resultats.push(divs[i]);
     return resultats;
}

function animateVideo()
{
    setTimeout(displayVideo, 1000);
}

function displayVideo()
{
	videos = getElementsByClass("vtuile", "video");
	for (i = 0 ; i < videos.length; i++)
		changeOffset(videos[i]);
		
	if (videos.length > 0)
		timer = setTimeout(displayVideo, VDELAY);
}

function changeOffset(video)
{
	video.currentTime = video.currentTime + VOFFSET;
}

/* Flipping tiles */
function animateFlippableTiles() {
    // add trigger
    $('.tile.flippable').bind("flip",function() {
        // $(this) point to the clicked .sponsorFlip element (caching it in elem for speed):
        var elem = $(this);
            
        if (flipAvailable) {
            
            // data('flipped') is a flag we set when we flip the element:
            if(elem.data('flipped'))
            {
                // If the element has already been flipped, use the revertFlip method
                // defined by the plug-in to revert to the default state automatically:
                elem.revertFlip();
                
                // Unsetting the flag:
                elem.data('flipped',false)
            }
            else
            {
                // Using the flip method defined by the plugin:
                elem.flip({
                        direction:'lr',
                        speed: 350,
                        onBefore: function(){
                                // Insert the contents of the .sponsorData div (hidden from view with display:none)
                                // into the clicked .sponsorFlip div before the flipping animation starts:
                                
                                elem.html(elem.children('p').html());
                        }
                });
                
                // Setting the flag:
                elem.data('flipped',true);
            }
        }
        
        // set timer
        setTimeout(function () { elem.trigger('flip'); }, 4000 + Math.floor(Math.random() * 6000));
    });
    
    $('.tile.flippable').each(function() {
	$(this).trigger('flip');
    });
    
    flipAvailable = true;
}


function animateImageTiles() {
    // add trigger
    $('.tile.image').bind("changePicture",function() {
        // $(this) point to the clicked .sponsorFlip element (caching it in elem for speed):
        var elem = $(this);
        
        if (changePictureAvailable && projectList != null) {
            
            // get project
            projectId = parseInt(elem.attr("id").substring(1));
            project = getProjectById(projectId);
            
            // get next picture
            if (project) {
                n = (parseInt(elem.data('displayPictureId')) + 1) % project.images.length;
                imgUrl = project.folder + 'media/images/' + project.images[n];
                
                elem.data('displayPictureId', n);    

                // transition
                //elem.fadeOut(100);
                elem.children('div').children('img').attr("src", imgUrl);
                //elem.fadeIn(800);
            
                directions = new Array('tb', 'bt', 'lr', 'rl');
            
                elem.flip({
                        direction: directions[Math.floor(Math.random() * 4)],
                        speed: 350,
                        onBefore: function(){
                                // Insert the contents of the .sponsorData div (hidden from view with display:none)
                                // into the clicked .sponsorFlip div before the flipping animation starts:
                                
                                elem.html(elem.html());
                        }
                });
            }
        }
        
        // set timer
        setTimeout(function () { elem.trigger('changePicture'); }, 4000 + Math.floor(Math.random() * 6000));
    });
    
    $('.tile.image').each(function() {
        $(this).data('displayPictureId', 0);
	$(this).trigger('changePicture');
    });
    
    changePictureAvailable = true;
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
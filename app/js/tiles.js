/* Tiles animation core */
var flipAvailable = false;

function animateTiles() {
    animateFlippableTiles();
}

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
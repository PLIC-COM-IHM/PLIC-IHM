INIT_TOP_TEXT_TILE = null;
TILE_TEXT_SCROLL_DELAY = 10000;
FLIP_TILE_PASSAGE = {};

function scroll(tile)
{
	var content = tile.find('.content');
	var innerMaskTop = tile.find('.mask-top');
	
	var tileHeight = parseInt(tile.css('height'));
	var contentHeight = parseInt(content.css('height'));
	var contentTop = parseInt(content.css('top'));
	var maskTopHeight = parseInt(innerMaskTop.css('height'));
	
	// alert(tile.hasClass('scroll') && contentHeight > tileHeight
	// 		&& content.css('top') >= (contentHeight - tileHeight - maskTopHeight));
	// alert(contentHeight - tileHeight - maskTopHeight + contentTop + ' ' + (contentHeight - tileHeight - maskTopHeight + contentTop + 25 > 0));
	
	if (tile.hasClass('scroll') && contentHeight > tileHeight)
	{
		if (contentHeight - tileHeight - maskTopHeight + contentTop - INIT_TOP_TEXT_TILE > 0)
		{
			content.animate({
				top: '-=' + (tileHeight - maskTopHeight)
			}, 700, function() {
				setTimeout(function() { scroll(tile); }, TILE_TEXT_SCROLL_DELAY);
			});
		}
		else
		{
			content.animate({
				top: INIT_TOP_TEXT_TILE
			}, 700, function() {
			
			});
			setTimeout(function() { scroll(tile); }, TILE_TEXT_SCROLL_DELAY);
		}
	}
}

function animateTextTile(tile)
{
	var innerMaskTop = tile.find('.mask-top');
	var content = tile.find('.content');
	
	if (INIT_TOP_TEXT_TILE == null)
		INIT_TOP_TEXT_TILE = parseInt(content.css('top'));
	
	//  CSS Adjustments
	innerMaskTop.css('top', tile.css('width'));
	tile.css('height', tile.css('width'));
	
	setTimeout(function() { scroll(tile); }, TILE_TEXT_SCROLL_DELAY);
}

function flipTileContent(tile)
{
	var card = tile.find('.card');
	
	if (card.hasClass('flipped'))
		card.removeClass('flipped');
	else
	{
		card.addClass('flipped');
		setTimeout(function() { flipTileContent(tile) }, 3000);
	}
}

function animateFlipTiles()
{
	$.each(FLIP_TILE_PASSAGE, function(key) {
		
		// Regenerates the tiles array
		if (FLIP_TILE_PASSAGE[key].length == 0)
		{
			var tiles = $('#'+key + ' .tile.flip');
			tiles.each(function(index, tile) {
				FLIP_TILE_PASSAGE[key].push(tile);
			});
		}
		
		var randomIndex = Math.floor(Math.random() * FLIP_TILE_PASSAGE[key].length);
		
		var tile = FLIP_TILE_PASSAGE[key][randomIndex];
		
		FLIP_TILE_PASSAGE[key].splice(randomIndex, 1);
		
		flipTileContent($(tile));
	
		setTimeout(function() { animateFlipTiles() }, 5000);
	});
	
}

$(document).ready(function($) {
	
	$('.tile.text').each(function(index, tile) {
		animateTextTile($(this));
	});
	
	$('.tile.flip').each(function(index, tile) {
		var tileWidth = $(this).css('width');
		$(this).css('height', tileWidth);
		$(this).find('.back').css('width', tileWidth);
		$(this).find('.back').css('height', tileWidth);
	});

	$('div.tilegroup').each(function(index) {
		var availableTiles = [];
		$(this).find('.tile.flip').each(function(index, tile) {
			availableTiles.push(tile);
		});
		if (availableTiles.length)
			FLIP_TILE_PASSAGE[$(this).attr('id')] = availableTiles;
	});
	
	// Starts to randomly flip tiles
	setTimeout(function () { animateFlipTiles() }, 1000);
});

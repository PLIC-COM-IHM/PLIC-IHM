
DEBUG = true;

// Data Objects
INIT_TOP_TEXT_TILE = null;
TILE_TEXT_SCROLL_DELAY = 10000;
FLIP_TILE_PASSAGE = {};

// Timings
PAGE_SLIDE_SPEED = 500;
TILE_BOUNCING_SPEED = 100;
ARROW_BOUNCING_SPEED = 100;


function computeArrayButtonsForCurrentPage(page, withAnimation)
{
	console.log(withAnimation);
	
	var previousPageButton = $('#previous-page');
	var nextPageButton = $('#next-page');
	
	if (!nextPageButton.is(':visible') && page.next('.page').length > 0)
	{
		if (withAnimation === true || withAnimation === undefined)
			$('#next-page').fadeIn();
		else
			$('#next-page').show();
	}
	else if (nextPageButton.is(':visible') && page.next('.page').length == 0)
	{
		if (withAnimation === true || withAnimation === undefined)
			$('#next-page').fadeOut();
		else
			$('#next-page').hide();
	}
	
	if (!previousPageButton.is(':visible') && page.prev('.page').length > 0)
	{
		if (withAnimation === true || withAnimation === undefined)
			$('#previous-page').fadeIn();
		else
			$('#previous-page').show();
	}
	else if (previousPageButton.is(':visible') && page.prev('.page').length == 0)
	{
		if (withAnimation === true || withAnimation === undefined)
			$('#previous-page').fadeOut();
		else
			$('#previous-page').hide();
	}
}

function scroll(tile)
{
	var content = tile.find('.content');
	var innerMaskTop = tile.find('.mask-top');
	
	var tileHeight = parseInt(tile.css('height'));
	var contentHeight = parseInt(content.css('height'));
	var contentTop = parseInt(content.css('top'));
	var maskTopHeight = parseInt(innerMaskTop.css('height'));
	
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
	innerMaskTop.css('top', tile.css('width') - 10);
	tile.css('height', tile.css('width'));
	
	setTimeout(function() { scroll(tile); }, TILE_TEXT_SCROLL_DELAY);
}

function flipTileContent(tile)
{
	// Gets the "flippable" bloc inside the tile
	var card = tile.find('.card');
	
	if (card.hasClass('flipped'))
		card.removeClass('flipped');
	else
	{
		// Flips the tile
		card.addClass('flipped');
		// Sets a callback to flip the tile back
		setTimeout(function() { flipTileContent(tile) }, 3000);
	}
}

function animateFlipTiles()
{
	$.each(FLIP_TILE_PASSAGE, function(key) {
		
		// Regenerates the tiles array which is empty
		if (FLIP_TILE_PASSAGE[key].length == 0)
		{
			var tiles = $('#'+key + ' .tile.flip');
			tiles.each(function(index, tile) {
				FLIP_TILE_PASSAGE[key].push(tile);
			});
		}
		
		// Gets a random index of an object in the flippable tiles array
		var randomIndex = Math.floor(Math.random() * FLIP_TILE_PASSAGE[key].length);
		var tile = FLIP_TILE_PASSAGE[key][randomIndex];
		
		// Removes the selected tile from the flippable tile array
		FLIP_TILE_PASSAGE[key].splice(randomIndex, 1);
		
		// Flips the tile
		flipTileContent($(tile));
		
		// Flip another tile within the specified delay
		setTimeout(function() { animateFlipTiles() }, 5000);
	});
	
}

$(document).ready(function($) {
	
	computeArrayButtonsForCurrentPage($('section.page:visible'), false);
	
	// Starts animating text tiles
	$('.tile.text').each(function(index, tile) {
		animateTextTile($(this));
	});
	
	// Fixes flips tiles styles properties
	$('.tile.flip').each(function(index, tile) {
		var tileWidth = parseInt($(this).css('width'));
		$(this).css('height', tileWidth);
		console.log(tileWidth);
		var back = $(this).find('.back');
		back.css('width', tileWidth - 20);
		back.css('height', tileWidth - 20);
		back.css('left', 0);
		back.css('top', 0);
	});
	
	// Builds flipping tiles arrays per columns (one per column can flip at a time)
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
	
	// Handles a tap on arrows buttons
	$('section').delegate('.arrow', 'tap', function() {
		var section = $('section.page:visible');
		
		var newPage = null;
		if ($(this).attr('id') == 'next-page')
		{
			newPage = section.next('.page');
			var oldDirection = 'left';
			var newDirection = 'right';
		}
		else if ($(this).attr('id') == 'previous-page')
		{
			newPage = section.prev('.page');
			var oldDirection = 'right';
			var newDirection = 'left';
		}
		
		if (newPage != null && !$(this).is(':animated'))
		{
			$(this).effect('bounce', { times: 2, direction: newDirection, distance: 10 }, ARROW_BOUNCING_SPEED, function() {
				if (newPage.length)
				{
					// console.log('New Page : ');
					// console.log(newPage);
					// console.log('Next Page : ');
					// console.log(newPage.next('.page'));
					// console.log('Prev Page : ');
					// console.log(newPage.prev('.page'));
					computeArrayButtonsForCurrentPage(newPage, true);
					
					section.hide('slide', { direction: oldDirection }, PAGE_SLIDE_SPEED, function() {
						newPage.show('slide', { direction: newDirection }, PAGE_SLIDE_SPEED, function() {
						});
					});
				}
			});
		}
	});
	
	// Handles a tap on a tile
	$('.tilegroup').delegate('.tile', 'tap', function() {
		// Prevents bouncing if the tile is already being animated
		if (!$(this).is(':animated'))
		{
			$(this).effect('bounce', { times: 4, direction: 'left', distance: 10 }, 100, function() {
				// Handle functional actions here
			});
		}
	});
});

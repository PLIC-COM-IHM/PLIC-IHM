// 

var DEBUG = true;

var TAP_DURATION = 550;
var TAP_HOLD_DURATION = 4 * TAP_DURATION;
var SCROLL_ENABLED = false;
var SCROLL_MIN_DELTA = 1;
var SCROLL_ACCELERATION_POINTS_TO_WATCH = 15;
var SCROLL_ACCELERATION_MIN_STD_DEVIATION = 0.03;

var IS_PERFORMING_DECELERATION = false;
var SCROLL_DECELERATION_TIME = 500;

var UPDATE_INTERVAL = 20;

// Sets Gestures Identifiers
var GESTURE_TAP = 'gestureTap';
var GESTURE_TAP_HOLD = 'gestureTapHold';
var GESTURE_SCROLL = 'gestureScroll';

var ongoingGestures = [
	GESTURE_TAP_HOLD,
	GESTURE_SCROLL
];

var isUpdating = false;
var gestures = {};


function getLastCoordinates(numberOfPoints, gesture, index) {
	var pathLength = gesture.object.path.length;
	
	if (pathLength < numberOfPoints)
		numberOfPoints = pathLength;
	
	result = [];
	for (var i = 1; i <= numberOfPoints; i++) {
		result.push(gesture.object.path[pathLength - i][index]);
	}
	
	return result;
}

function getLastXCoordinates(numberOfPoints, gesture) {
	return getLastCoordinates(numberOfPoints, gesture, 0);;
}

function getLastYCoordinates(numberOfPoints, gesture) {
	return getLastCoordinates(numberOfPoints, gesture, 1);
}

function getAveragePoint(gesture) {
	var len = gesture.object.path.length;
	var x = 0;
	var y = 0;
	
	for (var i = 0; i < len; i++)
		x += gesture.object.path[i][0];
	for (var i = 0; i < len; i++)
		y += gesture.object.path[i][1];
	
	x = (x / len) * BODY_WIDTH;
	y = (y / len) * BODY_HEIGHT;
	
	return [x, y];
}

function isTapGesture(gestureLength, point) {
	return (gestureLength < TAP_DURATION && point.object.path.length < 13);
}

function isTapHoldGesture(gestureLength, point) {
	return (gestureLength > TAP_HOLD_DURATION && point.object.path.length < 13);
}

function performTapGesture(x, y) {
	var element = document.elementFromPoint(x, y);
	console.log('TAP GESTURE — ' + x + ', '+ y + ' : ' + element);
	// $(element).trigger('tap');
	$(element).trigger('click');
}

function performTapHoldGesture(x, y) {
	var element = document.elementFromPoint(x, y);
	console.log('TAP-HOLD GESTURE — ' + x + ', '+ y + ' : ' + element);
	$(element).trigger('taphold');
}

function performScrollGesture(gesture) {
	if (!SCROLL_ENABLED)
		return false;
	
	var pathLength = gesture.object.path.length;
	var lastPoint = gesture.object.path[pathLength - 1];
	var penultimatePoint = gesture.object.path[pathLength - 2];
	
	if (penultimatePoint && lastPoint) {
		var y1 = parseInt(penultimatePoint[1] * BODY_HEIGHT);
		var y2 = parseInt(lastPoint[1] * BODY_HEIGHT);
		var delta = y2 - y1;
	}
	else
		return false;
	
	if (y1 != y2 && Math.abs(delta) > SCROLL_MIN_DELTA) {
		var lastPoints = getLastYCoordinates(SCROLL_ACCELERATION_POINTS_TO_WATCH, gesture);
		var standardDeviation = getStandardDeviation(lastPoints);
		
		var coeff = 1;
		if (standardDeviation >= SCROLL_ACCELERATION_MIN_STD_DEVIATION) {
			var coeff = (1 / SCROLL_ACCELERATION_MIN_STD_DEVIATION) * standardDeviation;
		}
		
		var top = $(window).scrollTop();
		$(window).scrollTop(top - delta * coeff);
		return true;
	}
	else {
		return false;
	}
}

function decelerateScroll(currentDecelerationTime, speed) {
	if (IS_PERFORMING_DECELERATION && currentDecelerationTime < SCROLL_DECELERATION_TIME) {
		var sampledTime = ((Math.PI / 2) / SCROLL_DECELERATION_TIME) * currentDecelerationTime;
		var sign = (speed > 0) ? 1 : -1;
		var newSpeed = Math.cos(sampledTime) * speed;
		
		// console.log(sign * Math.cos(sampledTime));
	
		var top = $(window).scrollTop();
		$(window).scrollTop(top + newSpeed * BODY_HEIGHT); 
		
		// console.log(sign * newSpeed * BODY_HEIGHT);
	
		setTimeout(
			function() {
				decelerateScroll(currentDecelerationTime + UPDATE_INTERVAL, newSpeed);
			},
			UPDATE_INTERVAL
		);
	}
	else
		IS_PERFORMING_DECELERATION = false;
}

function performEndScrollGesture(gesture) {
	var points = getLastYCoordinates(40, gesture);
	var pointsCount = points.length;
	
	if (pointsCount >= 2) {
		var firstPointY = points[0];
		var lastPointY = points[pointsCount - 1];
		
		var speed = (lastPointY- firstPointY) / (pointsCount - 1);
		console.log(speed);
		
		IS_PERFORMING_DECELERATION = true;
		
		var standardDeviation = getStandardDeviation(points);
		
		var coeff = 1;
		if (standardDeviation >= SCROLL_ACCELERATION_MIN_STD_DEVIATION) {
			var coeff = (1 / SCROLL_ACCELERATION_MIN_STD_DEVIATION) * standardDeviation;
		}
		decelerateScroll(0, coeff * speed);
	}
	else {
		console.log("END SCROLL ABORTED");
	}
}

function analyseEndedGesture(gesture) {
	var currentDate = new Date();
	var gestureDuration = currentDate.getTime() - gesture.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	var averagePoint = getAveragePoint(gesture);
	var x = averagePoint[0];
	var y = averagePoint[1];
	
	if (gesture.activeGestures.GESTURE_SCROLL) {
		performEndScrollGesture(gesture);
	}
	else {
		if (isTapGesture(gestureDuration, gesture)) {
			performTapGesture(x, y);
			gesture.activeGestures.GESTURE_TAP = true;
		}
	}
}

function invalidateOngoingGestures() {
	$.each(gestures, function(key, value) {
		var activeGestures = $(this)['activeGestures'];
		$.each(activeGestures, function(key, value) {
			$(this) = false;
		});
	});
}

function analyseOngoingGesture(gesture) {
	var currentDate = new Date();
	var gestureDuration = currentDate.getTime() - gesture.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	var averagePoint = getAveragePoint(gesture);
	var x = averagePoint[0];
	var y = averagePoint[1];
	
	
	if (performScrollGesture(gesture)) {
		gesture.activeGestures.GESTURE_SCROLL = true;
	}
	else {
		// The gesture did not scroll (usefull if the touch finishes without scrolling)
		gesture.activeGestures.GESTURE_SCROLL = false;
		
		if (gesture.activeGestures.GESTURE_TAP_HOLD == false
			&& isTapHoldGesture(gestureDuration, gesture)) {
		performTapHoldGesture(x, y);
		gesture.activeGestures.GESTURE_TAP_HOLD = true;
		}
	}
}

function update() {
	if (isUpdating)
		return;
	
	// Updates the current touches status
	isUpdating = true;
	
	// Gets the number of fingers currently touching the screen
	var len = tuio.cursors.length;
	// Creates an empty object to hold those fingers IDs
	var currents = {};
	if (len) {
		for (var i = 0; i < len; i++) {
			var gesture = tuio.cursors[i];
			var x = gesture.x;
			var y = gesture.y;
			// console.log(x, ', ', y);
			// console.log(y);
			
			// Gesture unique ID
			var sid = gesture.sid
			// console.log(sid);
			
			// Stores the IDs to keep track of the current gestures
			currents[sid] = sid;
			
			// Stores the newly detected finger in the Gestures global repository
			if (!gestures[sid]) {
				gestures[sid] = {
					'object' : gesture,
					'date' : new Date(),
					'lastPositionSeen' : gesture.path[gesture.path.length - 1],
					'activeGestures' : {
						GESTURE_TAP : false,
						GESTURE_TAP_HOLD : false,
						GESTURE_SCROLL : false
					}
				};
				if (IS_PERFORMING_DECELERATION)
					IS_PERFORMING_DECELERATION = false;
				
				// Displays the taps locations on the UI
				if (DEBUG == true) {
					var x = x * BODY_WIDTH;
					var y = y * BODY_HEIGHT;
					// $('body').append('<div id="touch-'+sid+'" class="touch-debug" style="top: '+y+'; left: '+x+';"> </div>');
					var touch = $('#touch-0').clone();
					touch.attr('id', 'touch-'+sid);
					touch.css('left', x);
					touch.css('top', y);
					touch.show();
					touch.appendTo('body');
				}
			}
			// The object has alreaady been detected
			else {
				// Updates the last position seen of the touch input
				gestures[sid].lastPositionSeen = gesture.path[gesture.path.length - 1]
				if (DEBUG == true) {
					var x = x * BODY_WIDTH;
					var y = y * BODY_HEIGHT;
					var touch = $('#touch-'+sid);
					touch.css('left', x);
					touch.css('top', y);
				}
			}
		};
		// console.log(tuio.cursors);
	}
	
	$.each(gestures, function(key, value) {
		// Analyses possible gestures when a finger disappears from the screen
		if (currents[key] == undefined) {
			// console.log(key);
			
			// Analyse gesture when it disapears
			analyseEndedGesture(value);
			// Removes the gesture of the gestures repository
			delete gestures[key];
			if (DEBUG == true) {
				var touch = $('#touch-'+key);
				touch.remove();
			}
		}
		// Analyses possible gestures while a finger is on the screen
		else {
			analyseOngoingGesture(value);
		}
	});
	
	// Stops to update the current touches status
	isUpdating = false;
}

$(document).ready(function() {
	var body = $('body');
	
	BODY_WIDTH = body.width();
	BODY_HEIGHT = body.height();
	
	$('#rotate').bind('tap', function() {
		if (body.hasClass('up'))
		{
			body.addClass('down');
			body.removeClass('up');
		}
		else
		{
			body.addClass('up');
			body.removeClass('down');
		}
	});
	
	$('#rotate').bind('taphold', function() {
		$(this).hide();
	});
	
	
	tuio.start();
	timer = setInterval(update, UPDATE_INTERVAL);
});

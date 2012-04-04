var TAP_DURATION = 250;
var TAP_HOLD_DURATION = 4 * TAP_DURATION;

// Sets Gestures Identifiers
var GESTURE_TAP = 'gestureTap';
var GESTURE_TAP_HOLD = 'gestureTapHold';


var isUpdating = false;

var gestures = {};

function isTapGesture(gestureLength, point) {
	return (gestureLength < TAP_DURATION && point.object.path.length < 13);
}

function isTapHoldGesture(gestureLength, point) {
	return (gestureLength > TAP_HOLD_DURATION && point.object.path.length < 13);
}

function performTapGesture(x, y) {
	var element = document.elementFromPoint(x, y);
	console.log('TAP GESTURE — ' + x + ', '+ y + ' : ' + element);
	$(element).trigger('tap');
}

function performTapHoldGesture(x, y) {
	var element = document.elementFromPoint(x, y);
	console.log('TAP-HOLD GESTURE — ' + x + ', '+ y + ' : ' + element);
	$(element).trigger('taphold');
}

function getAveragePoint(gesture) {
	var len = gesture.object.path.length;
	var x = 0;
	var y = 0;
	
	for (var i = 0; i < len; i++)
		x += gesture.object.path[i][0];
	for (var i = 0; i < len; i++)
		y += gesture.object.path[i][1];
	
	x = (x / len) * $('body').width();
	y = (y / len) * $('body').height();
	
	return [x, y];
}

function analyseEndedGesture(gesture) {
	var currentDate = new Date();
	var gestureDuration = currentDate.getTime() - gesture.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	var averagePoint = getAveragePoint(gesture);
	var x = averagePoint[0];
	var y = averagePoint[1];
	
	if (isTapGesture(gestureDuration, gesture)) {
		performTapGesture(x, y);
		gesture.activeGestures.GESTURE_TAP = true;
	}
}

function analyseOngoingGesture(gesture) {
	var currentDate = new Date();
	var gestureDuration = currentDate.getTime() - gesture.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	var averagePoint = getAveragePoint(gesture);
	var x = averagePoint[0];
	var y = averagePoint[1];
	
	if (gesture.activeGestures.GESTURE_TAP_HOLD == false
			&& isTapHoldGesture(gestureDuration, gesture)) {
		performTapHoldGesture(x, y);
		gesture.activeGestures.GESTURE_TAP_HOLD = true;
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
		for (var i=0; i < len; i++) {
			var gesture = tuio.cursors[i];
			var x = gesture.x;
			var y = gesture.y;
			// Gesture unique ID
			var sid = gesture.sid
			// console.log(sid);
			
			// Stores the IDs to keep track of the current gestures
			currents[sid] = sid;
			
			// Stores the newly detected finger in the Gestures global repository
			if (!gestures[sid]) {
				gestures[gesture.sid] = {
					'object' : gesture,
					'date' : new Date(),
					'lastPositionSeen' : gesture.path[gesture.path.length - 1],
					'activeGestures' : {
						GESTURE_TAP : false,
						GESTURE_TAP_HOLD : false
					}
				};
			}
			else {
				// Updates the last position seen
				gestures[sid].lastPositionSeen = gesture.path[gesture.path.length - 1]
			}
		};
		// console.log(tuio.cursors);
	}
	
	$.each(gestures, function(key, value) {
		// A finger disappeared from the touch screen
		if (currents[key] == undefined) {
			// console.log(key);
			// Analyse gesture when it disapears
			analyseEndedGesture(value);
			// Removes the gesture of the gestures repository
			delete gestures[key];
		}
		else {
			analyseOngoingGesture(value);
		}
	});
	
	// Stops the update the current touches status
	isUpdating = false;
}

$(document).ready(function() {
	var body = $('body');
	
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
	timer = setInterval(update, 15);
});

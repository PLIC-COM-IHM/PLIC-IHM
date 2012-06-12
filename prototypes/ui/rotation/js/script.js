var isUpdating = false;

var gestures = {};

function isTapGesture(gestureLength, point) {
	return (gestureLength < 250 && point.object.path.length < 13);
}

function performTapGesture(x, y) {
	var element = document.elementFromPoint(x, y);
	console.log(x + ', '+ y + ' : ' + element);
	$(element).trigger('tap');
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

function analyseGesture(gesture) {
	var currentDate = new Date();
	var gestureDuration = currentDate.getTime() - gesture.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	var averagePoint = getAveragePoint(gesture);
	var x = averagePoint[0];
	var y = averagePoint[1];
	
	if (isTapGesture(gestureDuration, gesture))
		performTapGesture(x, y);
}

function update() {
	if (isUpdating)
		return;
	
	isUpdating = true;
	
	var len = tuio.cursors.length;
	var currents = {};
	if (len) {
		for (var i=0; i < len; i++) {
			var gesture = tuio.cursors[i];
			var x = gesture.x;
			var y = gesture.y;
			var sid = gesture.sid
			
			// console.log(sid);
			
			currents[sid] = sid;
			
			if (!gestures[sid]) {
				gestures[gesture.sid] = {
					'object' : gesture,
					'date' : new Date()
				};
			}
		};
		// console.log(tuio.cursors);
	}
	
	$.each(gestures, function(key, value) {
		if (currents[key] == undefined) {
			console.log(key);
			analyseGesture(value);
			delete gestures[key];
		}
	});
	
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
	
	tuio.start();
	timer = setInterval(update, 15);
});

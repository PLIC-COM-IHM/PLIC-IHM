var isUpdating = false;
var count = 0;

var points = {};

function analysePoint(point) {
	var currentDate = new Date();
	var timePointing = currentDate.getTime() - point.date.getTime();
	// console.log("time : " + timePointing + " / paths : " + point.object.path.length);
	
	if (timePointing < 250 && point.object.path.length < 13) {
		var p = point.object.path[0];
		// console.log('click('+ p[0] + ', '+ p[1] +')');
		var x = p[0] * screen.width;
		var y = p[1] * screen.height;
		var element = document.elementFromPoint(x, y);
		console.log(x + ', '+ y + ' : ' + element);
		$(element).click();
	}
}

function update() {
	if (isUpdating)
		return;
	
	isUpdating = true;
	
	var len = tuio.cursors.length;
	var currents = {};
	if (len) {
		for (var i=0; i < len; i++) {
			var pointer = tuio.cursors[i];
			var x = pointer.x;
			var y = pointer.y;
			var sid = pointer.sid
			
			// console.log(sid);
			
			currents[sid] = sid;
			
			if (points[sid]) {
			
			}
			else {
				points[pointer.sid] = {
					'object' : pointer,
					'date' : new Date()
				};
			}
		};
		console.log(tuio.cursors);
		// console.log(x + " - " + y);
	}
	
	$.each(points, function(key, value) {
		if (currents[key] == undefined) {
			analysePoint(value);
			delete points[key];
		}
	});
	
	isUpdating = false;
}

$(document).ready(function() {
	var body = $('body');
	
	$('#rotate').bind('click', function() {
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

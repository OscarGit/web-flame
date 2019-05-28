var canvas;
var gc;

var START_RADIUS = 5;
var GROW_RADIUS = 0.3;
var DT = 0.01;
var GRAVITY = 0.05;

var mouseX = 0;
var mouseY = 0;
var prevX = 0;
var prevY = 0;
var hasMoved = false;

var circles = [];

$(function() {
	canvas = $("#canvas").get(0);
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	gc = canvas.getContext("2d");
	window.addEventListener('mousemove', mouseMove, false);
	draw();
});

function mouseMove(e) {
	var rect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
	mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
	if (!hasMoved) {
		prevX = mouseX;
		prevY = mouseY;
		hasMoved = true;
	}
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var draw = function() {
	gc.fillStyle = rgbToHex(48, 48, 48);
	gc.fillRect(0, 0, canvas.width, canvas.height);


	if (hasMoved)
		calcMovement(mouseX, mouseY, prevX, prevY);

	for (var i = 0; i < circles.length; i++) {
		var c = circles[i];
		gc.fillStyle = rgbToHex(48 + c.t * (255 - 48), 48 + c.t * c.t * (200 - 48), 48);
		gc.beginPath();
		gc.ellipse(c.x, c.y, c.r * 2, c.r * 1.5, c.a, 0, Math.PI * 2);
		gc.fill();

		c.x += c.vx;
		c.y += c.vy;
		c.vy -= GRAVITY;
		c.r += GROW_RADIUS;
		c.a += 0.05 * c.f;
		c.t -= DT;
		if (c.t < 0)
			circles.splice(i--, 1);

	}

	prevX = mouseX;
	prevY = mouseY;
	window.requestAnimationFrame(draw);
};
var calcMovement = function(mX, mY, pX, pY) {
	var dX = mX - pX;
	var dY = mY - pY;
	var dist = Math.sqrt(dX * dX + dY * dY);
	if (dist > 10) {
		dX /= dist;
		dY /= dist;
		for (var d = 0; d < dist; d += 10) {
			addCircle(pX + d * dX, pY + d * dY);
			addCircle(pX + d * dX, pY + d * dY);
		}
	} else {
		addCircle(mX, mY);
		addCircle(mX, mY);
	}
}
var addCircle = function(x, y) {
	circles.push({
		x: x,
		y: y,
		vx: Math.random() * 2 - 1,
		vy: Math.random() * 2 - 1,
		r: START_RADIUS,
		a: Math.random() * Math.PI * 2,
		f: Math.round(Math.random()) * 2 - 1,
		t: 1
	});
}
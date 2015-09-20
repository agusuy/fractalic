"use strict";
require('source-map-support').install();

var imagejs = require("imagejs"),
	capataz = require('capataz'),
    base = capataz.__dependencies__.base,
    server = capataz.Capataz.run({
        port: 80,
		customFiles: './modules',
		logFile: base.Text.formatDate(null, '"./logs/mandelbrot-log-"yyyymmdd-hhnnss".txt"'),
		workerCount: 2
    });

function jobFunction(fractal, width, height, maxIterations, imMax, imMin, reMax, reMin, x0, y0, x1, y1) {
	var f = new fractal.Fractal(width, height, maxIterations, imMax, imMin, reMax, reMin),
		result = { x0: x0, y0: y0, x1: x1, y1: y1, pixels: [] },
		pixel, rgb, color;
	for (var x = x0; x < x1; x++) {
		for (var y = y0; y < y1; y++) {
			pixel = f.calculatePixel(x,y),
			rgb = f.coloring(pixel.iteration, maxIterations, pixel.z_re, pixel.z_im);
			color = (rgb[0] & 0xFF) << 16 | (rgb[1] & 0xFF) << 8 | (rgb[2] & 0xFF);
			result.pixels.push(color);
		}
	}
	return result;
}

function linearInterpolation(x0, y0, xf, yf){
	var result = [];
	var y = y0;
	var m = (yf-y0) / (xf-x0);
	for(var x = x0; x <= xf; x++){
		result.push(y);
		y = y + m;
	}
	return result;
}

// var WIDTH = 3000,
// HEIGHT = WIDTH / (16/9),
// IM_MAX = 1.2, IM_MIN = -1.2, RE_MIN = -2.3,
// IM_MAX = -0.6398513222935779, IM_MIN = -0.6430265448571086, RE_MIN = 0.35054173901892893,
// MAX_ITERATIONS = 5000;

var	FRAME_COUNT = 30*60*5,
	MAX_ITERATIONS = 1000, 
	CANVAS_WIDTH = 2000,
	CANVAS_HEIGHT = CANVAS_WIDTH / (16/9);

// initial
//var	IM_MAX = 1.0, IM_MIN = -1.4, RE_MIN = -3.3, RE_MAX = CANVAS_WIDTH * ((IM_MAX - IM_MIN) / CANVAS_HEIGHT) + RE_MIN;
var IM_MAX = -0.6398513222935779, IM_MIN = -0.6430265448571086, RE_MIN = 0.35054173901892893, RE_MAX = CANVAS_WIDTH * ((IM_MAX - IM_MIN) / CANVAS_HEIGHT) + RE_MIN;

// end
var IM_MAX_f = -0.6398513222935779, IM_MIN_f = -0.6430265448571086, RE_MIN_f = 0.35054173901892893,
	RE_MAX_f = CANVAS_WIDTH * ((IM_MAX_f - IM_MIN_f) / CANVAS_HEIGHT) + RE_MIN_f;

/*
// zoom
var ZOOM_FACTOR = 1/10
var W_ZOOM = CANVAS_WIDTH * ZOOM_FACTOR,
	H_ZOOM = CANVAS_HEIGHT * ZOOM_FACTOR;
//center
var X0 = CANVAS_WIDTH/2, Y0 = CANVAS_HEIGHT/2;
// calculate bounds
var	RE_MAX_ZOOM = (X0 + W_ZOOM / 2) * (RE_MAX - RE_MIN) / CANVAS_WIDTH + RE_MIN,
	RE_MIN_ZOOM = (X0 - W_ZOOM / 2) * (RE_MAX - RE_MIN) / CANVAS_WIDTH + RE_MIN,
	IM_MAX_ZOOM = (Y0 - H_ZOOM / 2) * (IM_MIN - IM_MAX) / CANVAS_HEIGHT + IM_MAX,
	IM_MIN_ZOOM = (Y0 + H_ZOOM / 2) * (IM_MIN - IM_MAX) / CANVAS_HEIGHT + IM_MAX;
*/

var IM_MAX_Array = linearInterpolation(0, IM_MAX, FRAME_COUNT, IM_MAX_f),
	IM_MIN_Array = linearInterpolation(0, IM_MIN, FRAME_COUNT, IM_MIN_f),
	RE_MAX_Array = linearInterpolation(0, RE_MAX, FRAME_COUNT, RE_MAX_f),
	RE_MIN_Array = linearInterpolation(0, RE_MIN, FRAME_COUNT, RE_MIN_f);

IM_MAX = IM_MAX_Array[0];
IM_MIN = IM_MIN_Array[0];
RE_MAX = RE_MAX_Array[0];
RE_MIN = RE_MIN_Array[0];

/*
base.Future.sequence(<<generator de los parámetros>>, function (imgParams)  {
	// Lo que está abajo
});
*/

var jobs = base.Iterable.range(0, CANVAS_HEIGHT).map(function (y) {
		var x0 = 0, y0 = y, x1 = CANVAS_WIDTH-1, y1 = y + 1;
		return {
			info: "From ["+ x0 +","+ y0 +"] to ["+ x1 +","+ y1 +"]",
			imports: ['mandelbrot'],
			fun: jobFunction,
			args: [CANVAS_WIDTH, CANVAS_HEIGHT, MAX_ITERATIONS, IM_MAX, IM_MIN, RE_MAX, RE_MIN, x0, y0, x1, y1]
		}
	}),
	bitmap = new imagejs.Bitmap({width: CANVAS_WIDTH, height: CANVAS_HEIGHT});


server.scheduleAll(jobs, 2000, function (scheduled) {
	return scheduled.then(function (result) {
		var i = 0,
			pixel;
		for (var x = result.x0; x < result.x1; x++) {
			for (var y = result.y0; y < result.y1; y++) {
				pixel = result.pixels[i++];
				bitmap.setPixel(x, y, {r: pixel >> 16, g: (pixel >> 8) & 0xFF, b: pixel & 0xFF});
			}
		}
	});
}).then(function () {
	return bitmap.writeFile("logs/result.png", { type: imagejs.ImageType.PNG }).then(function () {
		server.logger.info("Finished. Stopping server.");
		process.exit();
	});
});
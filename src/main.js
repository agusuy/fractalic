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

function jobFunction(fractal, width, height, maxIterations, imMax, imMin, reMin, x0, y0, x1, y1) {
	var f = new fractal.Fractal(width, height, maxIterations, imMax, imMin, reMin),
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

var WIDTH = 3840,
	HEIGHT = WIDTH / (16/9),
	IM_MAX = 1.2, IM_MIN = -1.2, RE_MIN = -2.3,
	//IM_MAX = -0.6398513222935779, IM_MIN = -0.6430265448571086, RE_MIN = 0.35054173901892893,
	MAX_ITERATIONS = 5000;

var jobs = base.Iterable.range(0, HEIGHT).map(function (y) {
		var x0 = 0, y0 = y, x1 = WIDTH-1, y1 = y + 1;
		return {
			info: "From ["+ x0 +","+ y0 +"] to ["+ x1 +","+ y1 +"]",
			imports: ['mandelbrot'],
			fun: jobFunction,
			args: [WIDTH, HEIGHT, MAX_ITERATIONS, IM_MAX, IM_MIN, RE_MIN, x0, y0, x1, y1]
		}
	}),
	bitmap = new imagejs.Bitmap({width: WIDTH, height: HEIGHT});
	
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
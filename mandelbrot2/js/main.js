
require(['./js/mandelbrot', './js/color', './js/canvas'], function(mandelbrot, color, canvas){

	var myCanvas = new canvas.Canvas(w,h,canvasId);

	for(x=0;x<w;x++){
		for(y=0;y<h;y++){

			var result = mandelbrot.mandelbrotSet(x, y, maxIterations);

			var iteration = result.iteration;
			var z_re = result.z_re;
			var z_im = result.z_im;

			var rgb = color.coloring(iteration, maxIterations, z_re, z_im);

			myCanvas.putPixel(rgb[0],rgb[1],rgb[2], x,y);
		}
	}

	myCanvas.render();
});


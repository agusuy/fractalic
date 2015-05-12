require(['./js/image', './js/canvas'], function(image, canvas){

	/*canvas dimensions*/
	var canvasId = "myCanvas";
	var w = 5500;
	var h = 5000;

	/*iterations*/
	var maxIterations = 500;

	/*bounds*/
	var imMax = 1.2;
	var imMin = -1.2;
	var reMin = -2.3;

	var myCanvas = new canvas.Canvas(w,h,canvasId);

	var mandelbrot = new image.Fractal(w, h, maxIterations, imMax, imMin, reMin);

	mandelbrot.calculatePicture(myCanvas);

});

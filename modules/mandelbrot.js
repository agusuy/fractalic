define([/* deps */], function() {
	var exports = {};

	var Fractal = exports.Fractal = function Fractal(w, h, maxIterations, imMax, imMin, reMax, reMin){
		/* dimensions */
		this.width = w;
		this.height = h;
		/* bounds */
		this.imMax = imMax;
		this.imMin = imMin;
		this.reMax = reMax;
		this.reMin = reMin;
		
		this.maxIterations = maxIterations;
	};

	/*Fractal.prototype.calculatePicture = function(canvas) {
		for (var x = 0; x < this.width; x++){
			for (var y = 0; y < this.height; y++){
				var result = this.calculatePixel(x,y);
				var iteration = result.iteration;
				var z_re = result.z_re;
				var z_im = result.z_im;
				var rgb = this.coloring(iteration, this.maxIterations, z_re, z_im);
				canvas.putPixel(rgb[0], rgb[1], rgb[2], x, y);
			}
		}
		canvas.render();
	};*/

	Fractal.prototype.calculatePixel = function calculatePixel(x,y) {
		//convert coordinates to complex plane
		var c_re = (x / this.width) * (this.reMax - this.reMin) + this.reMin;
		var c_im = (y / this.height) * (this.imMin - this.imMax) + this.imMax;
		return this.iterate(c_re, c_im);
	};

	Fractal.prototype.iterate = function iterate(c_re, c_im) {
		/*zn+1 = zn^2 + c*/	
		var z_re = 0.0, z_im = 0.0, 
			iterations = 0,
			xtemp;
		while((z_re*z_re+z_im*z_im <= (1<<16)) && (iterations < this.maxIterations)){
			xtemp = z_re*z_re - z_im*z_im + c_re;
			z_im = 2.0*z_re*z_im + c_im;
			z_re = xtemp;
			iterations++;
		}
		return {
			iteration: iterations,
			z_re: z_re,
			z_im: z_im
		}
	};

	Fractal.prototype.smoothing = function(z_re, z_im, iteration) {
		if (iteration < this.maxIterations){
			var log_zn = Math.log(z_re*z_re + z_im*z_im) / 2.0
        	var nu = Math.log(log_zn / Math.log(2.0)) / Math.log(2.0);
        	iteration = iteration + 1 - nu;
		}
		return iteration;
	};

	Fractal.prototype.lerp = function(v0,v1,t){
		// interpolation between two inputs (v0,v1) 
		// for a parameter (t) in the closed unit interval [0,1]

		//return v0 + t*(v1-v0); // Imprecise method which does not guarantee v = v1 when t = 1,
								 // due to floating-point arithmetic error.
		return (1-t)*v0+t*v1; // Precise method which guarantees v = v1 when t = 1.
	};

	Fractal.prototype.coloring = function(iteration, maxIterations, z_re, z_im) {
		iteration = this.smoothing(z_re, z_im, iteration);

		var colorMap = [
    [66, 30, 15],
   [25, 7, 26],
   [9, 1, 47],
   [4, 4, 73],
   [0, 7, 100],
   [12, 44, 138],
   [24, 82, 177],
   [57, 125, 209],
   [134, 181, 229],
   [211, 236, 248],
   [241, 233, 191],
   [248, 201, 95],
   [255, 170, 0],
   [204, 128, 0],
   [153, 87, 0],
   [106, 52, 3]
		];

		/*calculate the pixel color (rgb) from the iteration*/
		if(iteration < maxIterations && iteration > 0){

			var i = Math.floor(iteration % (colorMap.length-1));
			var color1 = colorMap[i];
			var color2 = colorMap[i+1];

			var alpha = iteration % 1

			var r = Math.round(this.lerp(color1[0], color2[0], alpha));
			var g = Math.round(this.lerp(color1[1], color2[1], alpha));
			var b = Math.round(this.lerp(color1[2], color2[2], alpha));
			// console.log(iteration, color1, color2, alpha, [r,g,b]);
			return [r,g,b];
		}else{
			return [0,0,0];
		}
	};

	return exports;
}); // define
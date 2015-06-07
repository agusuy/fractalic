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
		while((z_re*z_re+z_im*z_im <= 4.0) && (iterations < this.maxIterations)){
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
			var zn = Math.sqrt(z_re*z_re + z_im*z_im);
			var nu = Math.log(Math.log(zn)/Math.log(2.0) / Math.log(2.0));
			iteration = iteration + 1 - nu;
		}
		return iteration;
	};

	Fractal.prototype.coloring = function(iteration, maxIterations, z_re, z_im) {
		/*calculate the pixel color (rgb) from the iteration*/
		iteration = this.smoothing(z_re, z_im, iteration);
		var r, g, b,
			value;

		if (iteration == maxIterations){
			r = 0;
			g = 0;
			b = 0;
		} else {
			var value = 3 * Math.log(iteration) / Math.log(maxIterations - 1.0);
			if (value < 1){
				r=255*value;
				g=0;
				b=0;
			}else if(value<2){
				r=255;
				g=255*(value-1);
				b=0;
			}else{
				r=255;
				g=255;
				b=255*(value-2);
			}
		}
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);
		return [r,g,b];
	};

	return exports;
}); // define
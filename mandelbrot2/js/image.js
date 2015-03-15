define(function(){

	var exports = {};

	var Fractal = exports.Fractal = function Fractal(w, h, maxIterations, imMax, imMin, reMin){
		/*dimensions*/
		this.width = w;
		this.height = h;

		/*image pixels*/
		// this.pixels = Array.apply(null, new Array(w*h*4)).map(function(){return 0;});

		/*bounds*/
		this.imMin = imMin;
		this.imMax = imMax;
		this.reMin = reMin;
		this.reMax = w*((imMax-imMin)/h)+reMin;

		this.maxIterations = maxIterations;
	};

	Fractal.prototype.calculatePicture = function(canvas) {
		
		for(x=0;x<this.width;x++){
			for(y=0;y<this.height;y++){

				var result = this.calculatePixel(x,y);

				var iteration = result.iteration;
				var z_re = result.z_re;
				var z_im = result.z_im;

				var rgb = this.coloring(iteration, this.maxIterations, z_re, z_im);

				canvas.putPixel(rgb[0],rgb[1],rgb[2], x,y);

			}
		}

		canvas.render();

	};

	Fractal.prototype.calculatePixel = function(x,y) {
		
		//convert coordinates to complex plane
		var c_re = (x/this.width)*(this.reMax-this.reMin)+this.reMin;
		var c_im = (y/this.height)*(this.imMin-this.imMax)+this.imMax;
		
		return this.iterate(c_re, c_im);
	};

	Fractal.prototype.iterate = function(c_re, c_im) {
		/*zn+1 = zn^2 + c*/
			
		var z_re = 0.0;
		var z_im = 0.0;

		var iterations = 0;

		while((z_re*z_re+z_im*z_im <= 4.0) && (iterations < this.maxIterations)){

			var xtemp = z_re*z_re - z_im*z_im + c_re;
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
		if(iteration < this.maxIterations){
				var zn = Math.sqrt(z_re*z_re + z_im*z_im);
				var nu = Math.log(Math.log(zn)/Math.log(2.0) / Math.log(2.0));
				iteration = iteration + 1 - nu;
		}
		return iteration;
	};

	Fractal.prototype.coloring = function(iteration, maxIterations, z_re, z_im) {
		/*calculate the pixel color (rgb) from the iteration*/

		iteration = this.smoothing(z_re, z_im, iteration);

		var r;
		var g;
		var b;

		if(iteration == maxIterations){
			r=0;
			g=0;
			b=0;
		}else{
			var value = 3*Math.log(iteration)/Math.log(maxIterations - 1.0);
			if(value<1){
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
});
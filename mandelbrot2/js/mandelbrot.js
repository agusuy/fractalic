define(function(){

	return{
		iterate: function(c_re, c_im, maxIterations){
			/*zn+1 = zn^2 + c*/
			
			var z_re = 0.0;
			var z_im = 0.0;

			var iterations = 0;

			while((z_re*z_re+z_im*z_im <= 4.0) && (iterations < maxIterations)){

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
		},

		mandelbrotSet: function(x, y, maxIterations){	

			//convert coordinates to complex plane
			var c_re = (x/w)*(reMax-reMin)+reMin;
			var c_im = (y/h)*(imMin-imMax)+imMax;

			return this.iterate(c_re, c_im, maxIterations);
		}

	}
});
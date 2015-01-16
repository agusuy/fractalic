define(function(){

	return{

		smoothing: function(z_re, z_im, iteration){

				if(iteration < maxIterations){
				var zn = Math.sqrt(z_re*z_re + z_im*z_im);
				var nu = Math.log(Math.log(zn)/Math.log(2.0) / Math.log(2.0));
				iteration = iteration + 1 - nu;
			}
			return iteration;
		},


		coloring: function(iteration, maxIterations, z_re, z_im){
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
		}

	}
});
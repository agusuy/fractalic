define(function(){

	return{

		Canvas: function(w,h,idElement){
			this.w = w;
			this.h = h;
			this.context = document.getElementById(idElement).getContext("2d");
			this.pixels = this.context.createImageData(this.w, this.h);

			this.putPixel = function(r,g,b,x,y){
				/*saves pixel color*/

				var index = 4 * (x + y * w);

				this.pixels.data[index] = r;  // red
				this.pixels.data[index + 1] = g;  // green
				this.pixels.data[index + 2] = b;  // blue
				this.pixels.data[index + 3] = 255;  // alpha
			}

			this.render = function(){
				/*render image*/
				this.context.putImageData(this.pixels, 0, 0);
			}
		}

	}
});
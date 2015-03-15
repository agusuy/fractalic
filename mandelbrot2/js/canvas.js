define(function(){
	var exports = {};

	var Canvas = exports.Canvas = function Canvas(w,h,idElement) {
			this.w = w;
			this.h = h;
			this.context = document.getElementById(idElement).getContext("2d");
			this.pixels = this.context.createImageData(this.w, this.h);
		};

	Canvas.prototype.putPixel = function putPixel(r,g,b,x,y){
		/*saves pixel color*/

		var index = 4 * (x + y * this.w);

		this.pixels.data[index] = r;  // red
		this.pixels.data[index + 1] = g;  // green
		this.pixels.data[index + 2] = b;  // blue
		this.pixels.data[index + 3] = 255;  // alpha
	};

	Canvas.prototype.render = function render(){
		/*render image*/
		this.context.putImageData(this.pixels, 0, 0);
	};

	return exports;
});
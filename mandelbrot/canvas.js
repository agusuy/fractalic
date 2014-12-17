var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var pixels = context.createImageData(w, h);


function putPixel(r,g,b,x,y){

	var index = 4 * (x + y * w);

	pixels.data[index] = r;  // red
	pixels.data[index + 1] = g;  // green
	pixels.data[index + 2] = b;  // blue
	pixels.data[index + 3] = 255;  // alpha
}

function render(){

	context.putImageData(pixels, 0, 0);

}
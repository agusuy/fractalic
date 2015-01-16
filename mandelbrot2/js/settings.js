/*canvas dimensions*/
var canvasId = "myCanvas";
var canvas = document.getElementById('myCanvas');
var w = canvas.width;
var h = canvas.height;

/*iterations*/
var maxIterations = 500;

/*zoom*/
var zoom = 0.25;
var widthRatio = zoom*w;
var heightRatio = zoom*h;

/*bounds*/
var imMax = 1.2;
var imMin = -1.2;
var reMin = -2.3;
var reMax = w*((imMax-imMin)/h)+reMin;
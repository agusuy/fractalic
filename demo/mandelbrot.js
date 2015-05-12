
var maxIterations = 500;
var canvas = document.getElementById('myCanvas');

var w = canvas.width;
var h = canvas.height;

var imMax = 1.2;
var imMin = -1.2;
var reMin = -2.3;
var reMax = w*((imMax-imMin)/h)+reMin;

var zoom = 0.25;

var widthRatio = zoom*w;
var heightRatio = zoom*h;

function mandelbrot(){

  //zn+1 = zn^2 + c

  for(x=0;x<w;x++){
    for(y=0;y<h;y++){
      
      var c_re = (x/w)*(reMax-reMin)+reMin;
      var c_im = (y/h)*(imMin-imMax)+imMax;
      
      var z_re = 0.0;
      var z_im = 0.0;
      
      var iteration = 0;
      
      while((z_re*z_re+z_im*z_im <= 4.0) && (iteration < maxIterations)){
        
        var xtemp = z_re*z_re - z_im*z_im + c_re;
        z_im = 2.0*z_re*z_im + c_im;
        z_re = xtemp;
        
        iteration++;
      }


      //smooth
      if(iteration < maxIterations){
        var zn = Math.sqrt(z_re*z_re + z_im*z_im);
        var nu = Math.log(Math.log(zn)/Math.log(2.0) / Math.log(2.0));
        iteration = iteration + 1 - nu;
      }
      var color = coloring(iteration);
      putPixel(color[0],color[1],color[2], x,y);

    }  
  }

  render();

}

function coloring(iteration){
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

canvas.addEventListener("click",
  function(event){
    var canvasX = event.x;
    var canvasY = event.y;
    
    var halfWidthRatio = widthRatio/2;
    var halfHeightRatio = heightRatio/2;
    
    reMax = xToRe(canvasX + halfWidthRatio);
    reMin = xToRe(canvasX - halfWidthRatio);
    
    imMax = yToIm(canvasY - halfHeightRatio);
    imMin = yToIm(canvasY + halfHeightRatio);
    
    mandelbrot();
}, false);

//x to complex plain
function xToRe(x) {
  var x_coefficient = (reMax - reMin) / w; 
  return (x * x_coefficient) + reMin;
}
//y to complex plain
function yToIm(y) {
  var y_coefficient = (imMin - imMax) / h; 
  return (y * y_coefficient) + imMax;
}

mandelbrot();

var maxIterations = 1000;
var canvas = document.getElementById('myCanvas');

var w = canvas.width;
var h = canvas.height;

var imMax = 1.2;
var imMin = -1.2;
var reMin = -2.3;
var reMax = w*((imMax-imMin)/h)+reMin;

console.log("IM_MAX = "+imMax+", IM_MIN = "+imMin+", RE_MIN = "+reMin+", RE_MAX = "+reMax);

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
      
      while((z_re*z_re+z_im*z_im <= (1<<16)) && (iteration < maxIterations)){
        
        var xtemp = z_re*z_re - z_im*z_im + c_re;
        z_im = 2.0*z_re*z_im + c_im;
        z_re = xtemp;
        
        iteration++;
      }

      //smooth
      if(iteration < maxIterations){
        var log_zn = Math.log(z_re*z_re + z_im*z_im) / 2.0
        var nu = Math.log(log_zn / Math.log(2.0)) / Math.log(2.0);
        iteration = iteration + 1 - nu;

        // var zn = Math.sqrt(z_re*z_re + z_im*z_im);
        // var nu = Math.log(Math.log(zn)/Math.log(2.0) / Math.log(2.0));
        // iteration = iteration + 1 - nu;
      }
      var color = coloring(iteration);
      putPixel(color[0],color[1],color[2], x,y);

    }  
  }

  render();

}
 
function lerp(v0,v1,t){
  // interpolation between two inputs (v0,v1) 
  // for a parameter (t) in the closed unit interval [0,1]
  
  //return v0 + t*(v1-v0);  // Imprecise method which does not guarantee v = v1 when t = 1,
                            // due to floating-point arithmetic error.
  return (1-t)*v0+t*v1; // Precise method which guarantees v = v1 when t = 1.
}

 // var colorMap = [
 //   [66, 30, 15],
 //   [25, 7, 26],
 //   [9, 1, 47],
 //   [4, 4, 73],
 //   [0, 7, 100],
 //   [12, 44, 138],
 //   [24, 82, 177],
 //   [57, 125, 209],
 //   [134, 181, 229],
 //   [211, 236, 248],
 //   [241, 233, 191],
 //   [248, 201, 95],
 //   [255, 170, 0],
 //   [204, 128, 0],
 //   [153, 87, 0],
 //   [106, 52, 3]
 //  ];
  var colorMap = [
  [255,0,0],
  [255,17,0],
  [255,34,0],
  [255,51,0],
  [255,68,0],
  [255,85,0],
  [255,102,0],
  [255,119,0],
  [255,136,0],
  [255,153,0],
  [255,170,0],
  [255,187,0],
  [255,204,0],
  [255,221,0],
  [255,238,0],
  [255,255,0],
  [255,255,0],
  [255,238,0],
  [255,221,0],
  [255,204,0],
  [255,187,0],
  [255,170,0],
  [255,153,0],
  [255,136,0],
  [255,119,0],
  [255,102,0],
  [255,85,0],
  [255,68,0],
  [255,51,0],
  [255,34,0],
  [255,17,0],
  [255,0,0]
  ];
function coloring(iteration){
  // if(iteration < maxIterations && iteration > 0){
  //   var i = Math.round(iteration % 15);
  //   return colorMap[i];
  // }else{
  //   return [0,0,0];
  // }

  if(iteration < maxIterations && iteration > 0){
    
    var i = Math.floor(iteration % (colorMap.length-1));
    var color1 = colorMap[i];
    var color2 = colorMap[i+1];
    
    var alpha = iteration % 1

    var r = Math.round(lerp(color1[0], color2[0], alpha));
    var g = Math.round(lerp(color1[1], color2[1], alpha));
    var b = Math.round(lerp(color1[2], color2[2], alpha));
    // console.log(iteration, color1, color2, alpha, [r,g,b]);
    return [r,g,b];
  }else{
    return [0,0,0];
  }

  
}


/*
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
*/

canvas.addEventListener("click",
  function(event){
    var canvasX = event.x;
    var canvasY = event.y;
    
    var halfWidthRatio = widthRatio/2;
    var halfHeightRatio = heightRatio/2;
    
    imMax = yToIm(canvasY - halfHeightRatio);
    imMin = yToIm(canvasY + halfHeightRatio);

    reMin = xToRe(canvasX - halfWidthRatio);
    //reMax = xToRe(canvasX + halfWidthRatio);
    reMax = w*((imMax-imMin)/h)+reMin;
    
    console.log("IM_MAX = "+imMax+", IM_MIN = "+imMin+", RE_MIN = "+reMin+", RE_MAX = "+reMax);

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
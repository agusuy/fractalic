"use strict";
require('source-map-support').install();

var capataz = require('capataz'),
    base = capataz.__dependencies__.base,
    server = capataz.Capataz.run({
        port: 80
    });


// function jobMandelbrot
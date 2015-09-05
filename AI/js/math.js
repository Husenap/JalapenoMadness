'use strict';
console.log("math.js");

Math.sqr = function(x){return x*x;}
Math.dist2 = function(v, w){return Math.sqr(v.x-w.x) + Math.sqr(v.y-w.y);}

'use strict';

define([
	"vector2"
], function(Vector2){
	
	var PI = Math.PI;
	var Pow = Math.pow;

	var Kernel = function(smoothingRadius){
		var radius = smoothingRadius;
		var radius2 = radius*radius;
		
		//Kernel constants
		var poly6 = 315 / (64 * PI * Pow(radius, 9));
		var poly6Gradient = 945 / (32 * PI * Pow(radius, 9));
		var spikey = 15 / (PI * Pow(radius, 6));
		var spikeyGradient = -45 / (PI * Pow(radius, 6));
		var viscosityLaplacian = -spikeyGradient;
		
		this.Poly6 = function(p, n){
			var f = radius2 - p.Sub(n).Sqr();
			if(f < 0)return 0;
			return poly6 * f * f * f;
		};

		this.Poly6Gradient = function(p, n){
			var r = p.Sub(n);
			var f = radius2 - r.Sqr();
			if(f < 0)return new Vector2();
			return r.Mul(-poly6Gradient * f * f);
		};

		this.Poly6DeltaQ = function(){
			return poly6 * Pow(radius2 - 0.1*radius2, 3);
		};

		this.Spiky = function(p, n){
			var f = radius - p.Sub(n).Mag();
			if(f < 0)return 0;
			return spikey * f * f * f;
		};

		this.SpikyGradient = function(p, n){
			var r = p.Sub(n);
			if(r.Equal(new Vector2()) || radius2 - r.Sqr < 0)return new Vector2();
			var rLength = r.Mag();
			var f = radius - rLength;
			return r.Mul(spikeyGradient * f * f).Div(rLength);
		};

		this.Viscosity = function(p, n){
			var h = radius;
			var r = p.Sub(n).Mag();
			if(h-r < 0)return 0;
			return -(r*r*r) / (2*h*h*h) + (r*r) / (h*h) + h/(2*r) -1;
		};

		this.ViscosityLaplacian = function(p, n){
			var f = radius - p.Sub(n).Mag();
			if(f < 0)return 0;
			return viscosityLaplacian * f;
		}
	}

	return Kernel;

});

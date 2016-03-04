'use strict';

define([

], function(){

	function RgbToHex(r, g, b) {
		return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	
	var Color = function(r, g, b){
		this.hasChanged = false;

		this.errorCheck = function(){
			if(this.r == NaN)this.r = 1;
			if(this.g == NaN)this.g = 1;
			if(this.b == NaN)this.b = 1;
		};

		this.setTo = function(r, g, b){
			this.r = Math.max(0, Math.min(1, r));
			this.g = Math.max(0, Math.min(1, g));
			this.b = Math.max(0, Math.min(1, b));
			this.hasChanged = true;
			this.errorCheck();
		};

		this.setTo(r, g, b);
		this.errorCheck();
		
		this.getHex = function(){
			return RgbToHex(
				Math.floor(this.r*255),
				Math.floor(this.g*255),
				Math.floor(this.b*255)
			);
		};
	};

	return Color;

});

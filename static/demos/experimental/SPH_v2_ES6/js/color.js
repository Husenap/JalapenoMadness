'use strict';

define([], () => {
	const RGBtoHEX = (r, g, b) => "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

	class Color{
		constructor(r=1, g=1, b=1){
			[ this.r, this.g, this.b ] = [ r, g, b ];
			this.changed = true;
		}
		
		setTo(r=1, g=1, b=1){
			this.r = clamp(r, 0, 1);
			this.g = clamp(g, 0, 1);
			this.b = clamp(b, 0, 1);
			this.changed = true;
		}
	
		get HasChanged(){
			return this.changed;
		}

		get Hex(){
			this.changed = false;
			return RGBtoHEX( Math.floor(this.r*255), Math.floor(this.g*255), Math.floor(this.b*255) );
		}
	}

	return Color;
});

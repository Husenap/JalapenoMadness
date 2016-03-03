'use strict';

define([

], function(){
	
	var Lines = function(){
		var graphics = new PIXI.Graphics();
		stage.addChild(graphics);

		this.drawLines = function(lines){
			graphics.clear();
			graphics.lineStyle(5, 0xffffff, 1);
			_.each(lines, function(line){
				graphics.moveTo(line.start.x, line.start.y);
				graphics.lineTo(line.end.x, line.end.y);
			});
		};
	};

	return Lines;

});

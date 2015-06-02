'use strict';

define([
	'level',
], function(Level){

	var tiles;
	var preview;
	var level;

	var Game = function(t, p){
		tiles = t;
		preview = p;
		level = new Level(tiles, preview);
	}

	Game.prototype.loop = function(){
		if(!level.gameOver){
			level.update();
			level.clear();
			level.draw();
		}
	}
	
	return Game;

});

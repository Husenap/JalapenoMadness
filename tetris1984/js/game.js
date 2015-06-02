'use strict';

define([
	'level',
], function(Level){

	var tiles;
	var preview;
	var level;
	var self;
	var Game = function(t, p){
		self = this;
		tiles = t;
		preview = p;
		level = new Level(tiles, preview);
	}

	Game.prototype.loop = function(){
		if(level && !level.gameOver){
			level.update();
			level.clear();
			level.draw();
		}else{
			$("#gameOver").slideDown();
		}
	}
	Game.prototype.reset = function(){
		level = null;
		_.forEach(tiles, function(col){
			_.forEach(col, function(tile){
				tile.html("&middot;");
				tile.attr('solid', '');
			});
		});
		level = new Level(tiles, preview);
		level.gameOver = false;
	}
	$("body").keydown(function (e){
		if(e.which == 82 && level.gameOver){
			self.reset();
			$("#gameOver").slideUp();
		}
	});

	return Game;

});

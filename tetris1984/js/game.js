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
		if(level){
			if(level.gameOver){
				$("#gameOver").slideDown();
			}else if(level.pause){
				if($("#pause").attr("down") == "0"){
					$("#pause").slideDown(function(){
						$("#pause").attr("down", 1);
					});
				}
			}else{
				level.update();
				level.clear();
				level.draw();
			}
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
		if(e.which == 80 && level.pause){
			if($("#pause").attr("down") == "1"){
				level.pause = false;
				$("#pause").slideUp(function(){
					level.startTimer();
					$("#pause").attr("down", 0);
				});
			}
		}
	});

	return Game;

});

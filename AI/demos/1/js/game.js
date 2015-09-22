'use strict';
console.log("game.js");

define([
	"object",
	"stain/vector2"
], function(Object, Vector2){

	var prey = [];

	var Game = function(){
		for(var i = 0; i < 1; i++){
			var temp = new Object.Prey(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			prey.push(temp);
		}
	}

	Game.prototype.update = function(){
		for(var i = 0; i < prey.length; i++)
			prey[i].update();
	}

	Game.prototype.draw = function(){
		for(var i = 0; i < prey.length; i++){
			prey[i].draw();
		}

		renderer.render(stage);

		ctx.restore();
		for(var i = 0; i < prey.length; i++){
			prey[i].debug();
		}
	}

	return Game;
});
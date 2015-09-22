'use strict';
console.log("game.js");

define([
	"object",
	"stain/vector2"
], function(Object, Vector2){

	var prey = [];
	var hunters = [];

	var Game = function(){
		for(var i = 0; i < 2; i++){
			var temp = new Object.Prey(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			prey.push(temp);
		}
		for(var i = 0; i < 1; i++){
			var temp = new Object.Hunter(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			hunters.push(temp);
		}
	}

	Game.prototype.update = function(){
		for(var i = 0; i < prey.length; i++)
			prey[i].update();
		
		for(var i = 0; i < hunters.length; i++)
			hunters[i].update();
	}

	Game.prototype.draw = function(){
		for(var i = 0; i < prey.length; i++){
			prey[i].draw();
		}
		for(var i = 0; i < hunters.length; i++){
			hunters[i].draw();
		}

		renderer.render(stage);

		ctx.restore();
		for(var i = 0; i < prey.length; i++){
			prey[i].debug();
		}
		for(var i = 0; i < hunters.length; i++){
			hunters[i].debug();
		}
	}

	Game.prototype.killPrey = function(obj){
		var id = prey.indexOf(obj.parent);
		if(id >= 0){
			obj.parent.destroy();
			prey.splice(id, 1);
		}
	}
	Game.prototype.findClosestHunter = function(p, v){
		return this.findClosest(p, v, hunters);
	}
	Game.prototype.findClosestPrey = function(p, v){
		return this.findClosest(p, v, prey);
	}
	Game.prototype.findClosest = function(p, v, arr){
		if(arr.length <= 0)return null;
		var vision = v*v;
		var closest = Infinity;
		var id = -1;
		var flag = false;
		for(var i = 0; i < arr.length; i++){
			var dist = arr[i].boid.pos.Sub(p).Sqr();
			if(dist < closest && dist < vision){
				closest = dist;
				id = i;
				flag = true;
			}
		}
		if(!flag)return null;
		return {
			t: arr[id].boid,
			parent: arr[id]
		};
	}

	return Game;

});
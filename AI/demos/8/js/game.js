'use strict';
console.log("game.js");

define([
	"object",
	"stain/vector2"
], function(Object, Vector2){

	var leaders = [];
	var followers = [];
	var hunters = [];
	var prey = [];

	var Game = function(){
		this.scoreSquad = this.scoreHunters = 0;
		for(var i = 0; i < 1; i++){
			var temp = new Object.Leader(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			leaders.push(temp);
		}
		leaders[0].addSlot(new Object.Slot(leaders[0], new Vector2(0, 100)));
		leaders[0].addSlot(new Object.Slot(leaders[0], new Vector2(-50, 150)));
		leaders[0].addSlot(new Object.Slot(leaders[0], new Vector2(50, 150)));
		leaders[0].addSlot(new Object.Slot(leaders[0], new Vector2(100, 200)));

		for(var i = 0; i < 1; i++){
			var temp = new Object.Follower(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			followers.push(temp);
		}
		for(var i = 0; i < 10; i++){
			var temp = new Object.Hunter(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			hunters.push(temp);
		}
		for(var i = 0; i < 5; i++){
			var temp = new Object.Prey(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			prey.push(temp);
		}
		this.interval = setInterval(function(){
			var temp = new Object.Prey(new Vector2(Math.random()*ctx.w/2, Math.random()*ctx.h/2));
			prey.push(temp);	
		}, 1000);
	}

	Game.prototype.update = function(){
		for(var i = 0; i < leaders.length; i++)
			leaders[i].update();

		for(var i = 0; i < followers.length; i++)
			followers[i].update();

		for(var i = 0; i < hunters.length; i++)
			hunters[i].update();

		for(var i = 0; i < prey.length; i++)
			prey[i].update();
	}

	Game.prototype.draw = function(){
		for(var i = 0; i < leaders.length; i++)
			leaders[i].draw();

		for(var i = 0; i < followers.length; i++)
			followers[i].draw();

		for(var i = 0; i < hunters.length; i++)
			hunters[i].draw();

		for(var i = 0; i < prey.length; i++)
			prey[i].draw();

		renderer.render(stage);

		ctx.restore();
		ctx.fillStyle = "white";
		ctx.font = "40px arial";
		ctx.fillText("Squad: " + this.scoreSquad, 10, ctx.h-20);
		ctx.fillText("Hunters: " + this.scoreHunters, 10, ctx.h-60);
	}

	Game.prototype.killPrey = function(obj){
		var id = prey.indexOf(obj);
		if(id >= 0){
			obj.destroy();
			prey.splice(id, 1);
		}
	}
	Game.prototype.findClosestSlot = function(p, v){
		var leader = this.findClosestLeader(p, v);
		if(leader == null)return null;

		var slot = this.findClosest(p, v, leader.slots);
		if(slot == null)return null;

		if(slot.follower == false){
			return slot;
		}
		return null;
	}
	Game.prototype.findClosestLeader = function(p, v){
		return this.findClosest(p, v, leaders);
	}
	Game.prototype.findClosestHunter = function(p, v){
		return this.findClosest(p, v, hunters);
	}
	Game.prototype.findClosestHunterLeader = function(p, v){
		return this.findClosest(p, v, hunters.concat(leaders));
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
		return arr[id];
	}

	return Game;
});
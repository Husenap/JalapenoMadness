'use strict';
console.log("game.js");

define([
	"person",
	"vector2",
	"physics",
	"shape"
], function(Person, Vector2, Physics, Shape){

	var persons = []

	var walls = [
	new Shape.Line(new Vector2(0,0),new Vector2(ctx.w,0)),
	new Shape.Line(new Vector2(ctx.w,0),new Vector2(ctx.w,ctx.h)),
	new Shape.Line(new Vector2(ctx.w,ctx.h),new Vector2(0,ctx.h)),
	new Shape.Line(new Vector2(0,ctx.h),new Vector2(0,0))
	];

	var Game = function(){
		for(var i = 0; i < 2; i++){
			persons.push(new Person(new Vector2(ctx.w*Math.random(),ctx.h*Math.random())));
		}
		for(var i = 0; i < 5; i++){
			walls.push(new Shape.Line(new Vector2(ctx.w*Math.random(),ctx.h*Math.random()),new Vector2(ctx.w*Math.random(),ctx.h*Math.random())));
		}
	}

	Game.prototype.update = function(){
		for(var i = 0; i < persons.length; i++){
			persons[i].update();
			persons[i].interact(walls);
		}
	}

	Game.prototype.draw = function(){
		for(var i = 0; i < persons.length; i++){
			persons[i].draw();
		}	
		for(var i = 0; i < walls.length; i++){
			walls[i].draw();
		}
	}

	return Game;

});
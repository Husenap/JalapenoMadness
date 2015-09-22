'use strict';
console.log("boid.js");

define([
	"./vector2"
], function(Vector2){

	//=================
	//===CONSTRUCTOR===
	//=================
	var Boid = function(pos, m, mv, mf, maf){
		this.pos = pos||new Vector2();
		this.m = m || 15;
		this.vel = new Vector2();
		this.maxVel = mv || 10;
		this.maxForce = mf || 10;
		this.maxAvoidForce = mf || 10;
		this.wanderD = 50;
		this.wanderR = 25;
		this.wanderA = 0;
		this.a = 0;
		this.size = new Vector2();
	}

	//======================
	//===USEFUL FUNCTIONS===
	//======================
	Boid.prototype.bound = function(){
		if(this.pos.x < this.size.x || this.pos.y < this.size.y ||
			this.pos.x > ctx.w-this.size.x || this.pos.y > ctx.h-this.size.y){
			this.pos.x = ctx.w2+Math.random()*50-25;
			this.pos.y = ctx.h2+Math.random()*50-25;
			this.vel = new Vector2();
		}
	}
	Boid.prototype.setPos = function(p){
		this.pos = p;
	}

	//===============
	//===DEBUGGING===
	//===============
	Boid.prototype.debug = function(){
		this.drawForce(this.vel, "green");
	}
	Boid.prototype.drawForce = function(f, col){
		ctx.save();
		ctx.strokeStyle=col;
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		var line = f.Normal().Mul(100);
		ctx.lineTo(this.pos.x+line.x,this.pos.y+line.y);
		ctx.stroke();
		ctx.restore();
	}

	return Boid;

});
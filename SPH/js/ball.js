'use strict';

define([
	"pixi"
], function(PIXI){

	var Ball = function(sprite, x, y, r){
		this.sprite = sprite;
		this.x = x || 400;
		this.y = y || 25;
		this.dx = Math.random()*20-10;
		this.dy = Math.random()*20-10;
		this.r = r || 5;
		this.a = 0;
		this.init();
	}

	Ball.prototype.init = function(){
		this.sprite.anchor = {x:0.5, y:0.5};
		this.sprite.alpha = 1;
	}

	Ball.prototype.update = function(g){
		this.dy += 0.75;
		this.x += this.dx;
		this.y += this.dy;
		
		this.bound(g);

		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}

	Ball.prototype.bound = function(g){
		if(this.x < this.r){
			this.x = this.r;
			this.dx *= -1;
		}else if(this.x > g.w - this.r){
			this.x = g.w - this.r;
			this.dx *= -1;
		}
		if(this.y < this.r){
			this.y = this.r;
			this.dy = 0;
		}else if(this.y > g.h - this.r){
			this.y = g.h - this.r;
			this.dy *= -0.85;
			this.dy -= Math.random()*6;
		}
	}

	return Ball;
});
'use strict';
console.log("prey.js");

define([
	"stain/boid",
	"stain/movementManager",
	"pixi"
], function(Boid, MovementManager, PIXI){

	var preyTex = new PIXI.Texture.fromImage("/assets/img/prey.png");

	var Prey = function(p){
		this.boid = new Boid(p, 15, 3, 2, 500);
		this.steering = new MovementManager(this);
		
		this.sprite = new PIXI.Sprite(preyTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		this.sprite.scale = {x:0.5,y:0.5};
		stage.addChild(this.sprite);

		this.target = null;
		this.obstacle = null;
		this.vision = 300;
	};

	Prey.prototype.update = function(){
		this.target = game.findClosestHunter(this.boid.pos, this.vision*10);

		var distToMouse = Mouse.Sub(this.boid.pos).Sqr();

		if(this.target == null){
			this.steering.wander();
			this.sprite.tint = 0x00ffff;
		}else{
			this.steering.flee(this.target.t.pos);
			this.sprite.tint = 0xff0000;
		}
		
		this.steering.update();
	}

	Prey.prototype.draw = function(){
		//this.debug();
		this.sprite.position.x = this.boid.pos.x;
		this.sprite.position.y = this.boid.pos.y;
		this.sprite.rotation = this.boid.a;
	}

	Prey.prototype.debug = function(){
		this.boid.debug();
		this.steering.debug();
	}

	Prey.prototype.destroy = function(){
		stage.removeChild(this.sprite);
	}

	return Prey;

});
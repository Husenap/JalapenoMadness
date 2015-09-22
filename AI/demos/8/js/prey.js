'use strict';
console.log("prey.js");

define([
	"stain/boid",
	"stain/movementManager",
	"pixi"
], function(Boid, MovementManager, PIXI){

	var preyTex = new PIXI.Texture.fromImage("/assets/img/prey.png");

	var Prey = function(p){
		this.boid = new Boid(p, 15, 3, 2);
		this.steering = new MovementManager(this);
		
		this.sprite = new PIXI.Sprite(preyTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		this.sprite.scale = {x:0.5,y:0.5};
		stage.addChild(this.sprite);

		this.target = null;
		this.vision = 300;
	};

	Prey.prototype.update = function(){
		this.target = game.findClosestHunterLeader(this.boid.pos, this.vision);

		if(this.target != null){
			this.steering.evade(this.target.boid);
			this.sprite.tint = 0x00ffff;
		}else{
			this.steering.wander();
			this.sprite.tint = 0xffff00;
		}
		
		this.steering.update();
	}

	Prey.prototype.draw = function(){
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
'use strict';
console.log("follower.js");

define([
	"stain/boid",
	"stain/movementManager",
	"pixi"
], function(Boid, MovementManager, PIXI){

	var followerTex = new PIXI.Texture.fromImage("/assets/img/follower.png");

	var Follower = function(p){
		this.boid = new Boid(p, 10, 5, 4);
		this.steering = new MovementManager(this);

		this.sprite = new PIXI.Sprite(followerTex);
		this.sprite.anchor = {x:0.5, y:0.5};
		stage.addChild(this.sprite);

		this.vision = 300;
		this.slot = null;
		this.enemy = null;
		this.prey = null;
	}

	Follower.prototype.update = function(){
		this.slot = game.findClosestSlot(this.boid.pos, this.vision);
		this.prey = game.findClosestPrey(this.boid.pos, this.vision);
		this.enemy = game.findClosestHunter(this.boid.pos, this.vision/3);

		if(this.enemy != null){
			this.steering.evade(this.enemy.boid);
		}else if(this.prey != null){
			var distToPrey = this.boid.pos.Sub(this.prey.boid.pos).Sqr();
			if(distToPrey < 900){
				game.killPrey(this.prey);
				game.scoreSquad++;
			}else{
				this.steering.pursuit(this.prey.boid);
				this.sprite.tint = 0xff9900;
			}
		}else if(this.slot != null){
			this.steering.seek(this.slot.getPos(), 50);
		}else{
			this.steering.wander();
		}

		this.steering.update();
	}

	Follower.prototype.draw = function(){
		this.sprite.position.x = this.boid.pos.x;
		this.sprite.position.y = this.boid.pos.y;
		this.sprite.rotation = this.boid.a;
	}

	Follower.prototype.debug = function(){
		this.boid.debug();
		this.steering.debug();
	}

	return Follower;

});
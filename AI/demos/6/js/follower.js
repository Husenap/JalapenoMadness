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
	}

	Follower.prototype.update = function(){
		this.slot = game.findClosestSlot(this.boid.pos, this.vision);

		if(this.slot != null){
			console.log("following leader");
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
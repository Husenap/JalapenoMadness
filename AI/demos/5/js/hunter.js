'use strict';
console.log("hunter.js");

define([
	"stain/boid",
	"stain/movementManager",
	"pixi"
], function(Boid, MovementManager, PIXI){

	var hunterTex = new PIXI.Texture.fromImage("/assets/img/prey.png");

	var Hunter = function(p, m){
		this.boid = new Boid(p, 50, 4, 3);
		this.steering = new MovementManager(this);

		this.sprite = new PIXI.Sprite(hunterTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		this.sprite.tint = 0x00ff00;

		stage.addChild(this.sprite);

		this.vision = 200;
		this.target = null;
	}

	Hunter.prototype.update = function(){
		this.target = game.findClosestPrey(this.boid.pos, this.vision);

		if(this.target == null){
			this.steering.wander();
			this.sprite.tint = 0x00ff00;
		}else{
			var distToTarget = this.boid.pos.Sub(this.target.t.pos).Sqr();
			if(distToTarget < 900){
				game.killPrey(this.target);
			}else{
				this.steering.pursuit(this.target.t);
				this.sprite.tint = 0xff9900;
			}
		}

		this.steering.update();
	}

	Hunter.prototype.draw = function(){
		//this.debug();
		this.sprite.position.x = this.boid.pos.x;
		this.sprite.position.y = this.boid.pos.y;
		this.sprite.rotation = this.boid.a;
	}

	Hunter.prototype.debug = function(){
		this.boid.debug();
		this.steering.debug();
	}

	return Hunter;

});
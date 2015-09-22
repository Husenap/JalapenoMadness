'use strict';
console.log("prey.js");

define([
	"stain/boid",
	"stain/movementManager",
	"stain/vector2",
	"pixi"
], function(Boid, MovementManager, Vector2, PIXI){

	var preyTex = new PIXI.Texture.fromImage("/assets/img/prey.png");

	var Prey = function(p){
		this.boid = new Boid(p, 15, 3, 1);
		this.boid.wanderD = 25;
		this.boid.wanderR = 500;
		this.steering = new MovementManager(this);
		
		this.sprite = new PIXI.Sprite(preyTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		stage.addChild(this.sprite);

		this.target = null;
		this.obstacle = null;
		this.vision = 300;
	};

	Prey.prototype.update = function(){
		var distToMouse = Mouse.Sub(this.boid.pos).Sqr();

		if(distToMouse < this.vision*this.vision){	
			this.steering.flee(Mouse);
			this.sprite.tint = 0x0000ff;
		}else{
			if(this.boid.pos.Sub(new Vector2(ctx.w2, ctx.h2)).Sqr() < this.vision*this.vision){
				this.steering.seek(new Vector2(ctx.w2, ctx.h2), 200);
				this.sprite.tint = 0xff00ff;
			}else{
				this.steering.wander();
				this.sprite.tint = 0x00ffff;
			}
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
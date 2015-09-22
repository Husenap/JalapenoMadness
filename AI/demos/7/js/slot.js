'use strict';
console.log("slot.js");

define([
	"stain/boid",
	"stain/movementManager",
	"stain/vector2",
	"pixi"
], function(Boid, MovementManager, Vector2, PIXI){

	var leaderTex = new PIXI.Texture.fromImage("/assets/img/slot.png");

	var Slot = function(parent, offset){
		this.parent = parent;
		this.parentBoid = this.parent.boid;
		this.offset = offset;

		this.boid = new Boid(this.parentBoid.pos.Add(this.offset), 0, 10, 2);
		this.boid.bound = function(){};
		this.steering = new MovementManager(this);

		this.angleOff = Math.atan2(offset.y, offset.x);
		this.a = 0;

		this.sprite = new PIXI.Sprite(leaderTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		stage.addChild(this.sprite);

		this.pos = new Vector2();

		this.follower = false;
	}

	Slot.prototype.update = function(){
		this.a = this.angleOff + this.parentBoid.a;
		this.offset.SetAngle(this.a);
		this.pos = this.parent.boid.pos.Add(this.offset);
		this.steering.seek(this.pos, 200);
		this.steering.update();
	}

	Slot.prototype.draw = function(){
		this.sprite.position.x = this.boid.pos.x;
		this.sprite.position.y = this.boid.pos.y;
		this.sprite.rotation = this.boid.a;
	}

	Slot.prototype.getPos = function(){
		return this.boid.pos;
	}

	return Slot;

});
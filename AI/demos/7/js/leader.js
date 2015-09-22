'use strict';
console.log("leader.js");

define([
	"stain/boid",
	"stain/movementManager",
	"pixi"
], function(Boid, MovementManager, PIXI){

	var leaderTex = new PIXI.Texture.fromImage("/assets/img/leader.png");

	var Leader = function(p){
		this.boid = new Boid(p, 15, 1, 1);
		this.steering = new MovementManager(this);
		
		this.sprite = new PIXI.Sprite(leaderTex);
		this.sprite.anchor = {x:0.5,y:0.5};
		stage.addChild(this.sprite);

		this.vision = 900;

		this.slots = [];
	};

	Leader.prototype.update = function(){
		var distToMouse = Mouse.Sub(this.boid.pos).Sqr();

		if(distToMouse < this.vision*this.vision){	
			this.steering.seek(Mouse, 200);
			this.sprite.tint = 0x0000ff;
		}else{
			this.steering.reset();
			this.sprite.tint = 0x00ffff;
		}

		this.steering.update();
		this.updateSlots();
	}

	Leader.prototype.updateSlots = function(){
		for(var i = 0; i < this.slots.length; i++){
			this.slots[i].update();
		}
	}

	Leader.prototype.draw = function(){
		this.sprite.position.x = this.boid.pos.x;
		this.sprite.position.y = this.boid.pos.y;
		this.sprite.rotation = this.boid.a;
		this.drawSlots();
	}

	Leader.prototype.drawSlots = function(){
		for(var i = 0; i < this.slots.length; i++){
			this.slots[i].draw();
		}
	}

	Leader.prototype.debug = function(){
		this.boid.debug();
		this.steering.debug();
	}

	Leader.prototype.addSlot = function(slot){
		this.slots.push(slot);
	}

	return Leader;

});
'use strict';

define([
	"pixi",
	"vector2",
	"settings",
], function(PIXI, Vector2, Settings){

	var IDcounter = 0;

	var Particle = function(opts){
		// Sprite Stuff
		var tex = PIXI.loader.resources.ball.texture;
		this.sprite = new PIXI.Sprite(tex);
		stage.addChild(this.sprite);

		this.sprite.anchor = {x:0.5,y:0.5};
		this.sprite.scale = {x:1,y:1};
		this.sprite.tint = 0x0099ff;

		//Particle variables for the simulation
		this.position = opts.newPos || new Vector2();
		this.positionPrev = new Vector2();
		this.velocity = new Vector2();
		this.restDensity = opts.restDensity || Settings.kRestDensity;
		this.sprite.tint = this.restDensity;
		this.density = 0;
		this.densityNear = 0;
		this.pressure = 0;
		this.pressureNear = 0;
		this.radius = opts.radius || Settings.kInteractionRadius;
		this.neighbours;
		this.id = IDcounter++;

		this.update = function(){
			this.sprite.position = this.position;
		}

		this.kill = function(){
			stage.removeChild(this.sprite);
		}
	}

	return Particle;

});

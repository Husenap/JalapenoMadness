'use strict';

define([
	"pixi",
	"vector2",
	"color",
	"settings",
], function(PIXI, Vector2, Color, Settings){

	var IDcounter = 0;

	var Particle = function(opts){
		// Sprite Stuff
		var tex = PIXI.loader.resources["tris_0"+Math.ceil(Math.random()*3)].texture;
		this.sprite = new PIXI.Sprite(tex);
		stage.addChild(this.sprite);

		this.color = opts.color || new Color();

		this.sprite.anchor = {x:0.5,y:0.5};
		this.sprite.scale = {x:1,y:1};

		//Particle variables for the simulation
		this.position = opts.newPos || new Vector2();
		this.positionPrev = new Vector2();
		this.velocity = new Vector2();
		this.restDensity = opts.restDensity || Settings.kRestDensity;
		this.density = 0;
		this.densityNear = 0;
		this.pressure = 0;
		this.pressureNear = 0;
		this.radius = opts.radius || Settings.kInteractionRadius;
		this.neighbours;
		this.id = IDcounter++;

		this.updateColor = function(){
			this.sprite.tint = this.color.getHex();
			this.color.hasChanged = false;
		};
		this.updateColor();

		this.update = function(){
			this.sprite.position = this.position;
			if(this.color.hasChanged)this.updateColor();
		};

		this.kill = function(){
			stage.removeChild(this.sprite);
		};
	}

	return Particle;

});

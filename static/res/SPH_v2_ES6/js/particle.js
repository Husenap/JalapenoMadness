'use strict';

define([
	"pixi",
	"vector2",
	"color",
	"settings",
], (PIXI, Vector2, Color, Settings) => {

	let IDcounter = 0;

	class Particle{
		constructor( { 
			color = new Color(), 
			newPos = new Vector2(), 
			restDensity = Settings.kRestDensity, 
			radius = Settings.kInteractionRadius
		} ){
			this.id = IDcounter++;

			let tex = PIXI.loader.resources["tris_0"+Math.ceil(Math.random()*3)].texture;
			this.sprite = new PIXI.Sprite(tex);
			this.sprite.anchor = {x:0.5,y:0.5};
			this.sprite.scale = {x:1,y:1};

			stage.addChild(this.sprite);

			this.color = color;

			//Particle variables for the simulation
			this.position = newPos;
			this.positionPrev = new Vector2();
			this.sprite.position = this.position;

			this.velocity = new Vector2();

			this.restDensity = restDensity;
			this.density = 0;
			this.densityNear = 0;

			this.pressure = 0;
			this.pressureNear = 0;

			this.radius = radius;
			this.neighbours = [];
		}

		update(){
			if(this.color.HasChanged){
				this.sprite.tint = this.color.Hex;
			}
		}

		kill(){
			stage.removeChild(this.sprite);
		}
	}

	return Particle;
});

'use strict';

define([
	"pixi",
	"./ball"
], function(PIXI, Ball){

	var renderer = new PIXI.autoDetectRenderer(800, 600, {antialias: false});
	var maxPtcls = 500000;
	var stage = new PIXI.ParticleContainer(maxPtcls, [false, true, false, false, false]);

	document.body.appendChild(renderer.view);

	//===== STATS =====
	var stats = new Stats();
	document.body.appendChild(stats.domElement);
	stats.domElement.style.position = "absolute";
	$("#stats").css("top", $(renderer.view).offset().top+1);
	$("#stats").css("left", $(renderer.view).offset().left+1);

	renderer.w = renderer.width;
	renderer.h = renderer.height;
	renderer.w2 = renderer.w/2;
	renderer.h2 = renderer.h/2;

	var balls = [];
	// ADD NEW BALLS
	var count = 0;
	var amount = 100000;
	var isAdding = false;
	$(document).mousedown(function(){isAdding = true;});
	$(document).mouseup(function(){isAdding = false;});

	var texture = new PIXI.Texture.fromImage("img/ball.png?bust="+(new Date()).getTime());

	var counter = document.createElement("p");
	$(counter).css("color", "white");
	stats.domElement.appendChild(counter);

	function updateCounter(){
		$(counter).text(count + " balls");
	}

	function addBalls(times){
		_.times(times, function(n){
			var temp = new Ball(new PIXI.Sprite(texture));
			balls.push(temp);
			stage.addChild(temp.sprite);
			count++;
			updateCounter();
		});
	}

	function init(){
		addBalls(2);
		requestAnimationFrame(animate);
	}
	function update(){
		_.forEach(balls, function(b){
			b.update(renderer);
		});
	}
	function animate(){
		stats.begin();

		if(isAdding){
			if(count < maxPtcls){
				addBalls(amount);
			}
		}

		update();

		renderer.render(stage);
		requestAnimationFrame(animate);

		stats.end();
	}

	init();
});
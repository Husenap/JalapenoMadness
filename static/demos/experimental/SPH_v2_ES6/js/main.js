'use strict';

var stage;

define([
	"pixi",
	"vector2",
	"sphsystem",
	"settings"
], (PIXI, Vector2, SPHSystem, Settings) => {

	var renderer = new PIXI.autoDetectRenderer(Settings.WIDTH, 
												Settings.HEIGHT, 
												{antialias: false});
	Settings.SCALE = new Vector2(700/Settings.WIDTH, 700/Settings.HEIGHT);
	renderer.view.style.width = '700px';
	renderer.view.style.height = '700px';

	stage = new PIXI.Container();

	document.body.appendChild(renderer.view);

	//===== STATS =====
	var stats = new Stats();
	document.body.appendChild(stats.domElement);
	stats.domElement.style.position = "fixed";
	$("#stats").css("top", 0);
	$("#stats").css("left", 0);

	window.w = renderer.width;
	window.h = renderer.height;

	//LIST OF PARAMETERS FOR SIMULATION
	var parameterList = $("<div id='parameterList'>");
	$(parameterList).append("<span id='restDensity'><span>rest density(H/Y): <span class='val'>");
	$(parameterList).append("<span id='stiffness'><p>stiffness(J/U): <span class='val'>");
	$(parameterList).append("<span id='stiffnessNear'><p>stiffness Near(K/I): <span class='val'>");
	$(parameterList).append("<span id='linearViscosity'><p>linear viscosity(1/3): <span class='val'>");
	$(parameterList).append("<span id='quadraticViscosity'><p>quadratic viscosity(2/4): <span class='val'>");
	$(parameterList).append("<span id='dAngle'><p>rotation angle(F/R): <span class='val'>");
	$(parameterList).append("<span id='gravity'><p>gravity(arrows): <span class='val'>");
	$(parameterList).append("<span id='numPtcls'><p>particles(C/A): <span class='val'>");
	$(parameterList).append("<span id='numLines'><p>lines(D/LMB): <span class='val'>");
	$(parameterList).append("<span id='info'>RMB for attractive force<br>7,8,9,0 for different coloured particles<br>G to toggle gravity");
	$(stats.domElement).append(parameterList);


	var counter = document.createElement("p");
	$(counter).css("color", "white");
	stats.domElement.appendChild(counter);

	function updateCounter(){
		$(counter).text(count + " ptcls");
	}

	var sph;
	var prevTime;
	function init(){
		sph = new SPHSystem();
		requestAnimationFrame(animate);
	}
	function update(time){
		sph.update((time - prevTime)/1000);
	}
	function draw(){
		sph.draw();
		renderer.render(stage);
	}

	function animate(time){
		stats.begin();

		update(time);
		prevTime = time;

		draw();
		requestAnimationFrame(animate);

		stats.end();
	}

	// PRELOAD ASSETS
	var loader = PIXI.loader;
	loader.add('ball','img/ball.png');
	loader.add('tris_01','img/tris_01.png');
	loader.add('tris_02','img/tris_02.png');
	loader.add('tris_03','img/tris_03.png');
	loader.on('complete', onAssetsLoaded);
	function onAssetsLoaded(){
		init();
	}
	loader.load();
	$("canvas").bind('contextmenu', function(e){
		return false;
	});
});

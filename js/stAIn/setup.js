'use strict';
console.log("setup.js");

var ctx;
var Mouse;
var stage, renderer;

define([
	"./settings",
	"./vector2",
	"pixi"
], function(Settings, Vector2, PIXI){

	//Setting up canvas and context
	var canvas = $("#canvas")[0];
	renderer = new PIXI.CanvasRenderer(Settings.WIDTH, Settings.HEIGHT, {view:canvas, transparent:false});
	stage = new PIXI.Container();
	ctx = canvas.getContext("2d");

	//Setting the canvas size
	ctx.w = canvas.width = Settings.WIDTH;
	ctx.h = canvas.height = Settings.HEIGHT;
	ctx.w2 = ctx.w/2;
	ctx.h2 = ctx.h/2;

	Mouse = new Vector2();

	$(canvas).mousemove(function(e){
		Mouse.x = e.offsetX;
		Mouse.y = e.offsetY;
	});

	//Runs main
	requirejs(["stain/main"]);
});

'use strict';
console.log("setup.js");

var ctx;

define([
	"settings"
], function(Settings){

	//Setting up canvas and context
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	//Setting the canvas size
	ctx.w = canvas.width = Settings.WIDTH;
	ctx.h = canvas.height = Settings.HEIGHT;

	//Runs main
	requirejs(["main"]);
});

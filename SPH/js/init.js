'use strict';

requirejs.config({
	paths:{
		'pixi' : '//cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.7/pixi.min'
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});

requirejs(["main"]);
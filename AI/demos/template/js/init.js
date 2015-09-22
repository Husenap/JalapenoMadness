'use strict';
console.log("init.js");

requirejs.config({
	paths:{
		"pixi": "/js/libs/pixi.min"
	},
	packages: [
		{
			name:"stain",
			location:"/js/stAIn"
		}
	],
	urlArgs: "bust="+(new Date()).getTime()
});

requirejs(["stain/math", "stain/setup"]);

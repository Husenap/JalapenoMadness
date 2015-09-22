'use strict';
console.log("init.js");

requirejs.config({
	urlArgs: "bust="+(new Date()).getTime()
});

requirejs(["math", "setup"]);

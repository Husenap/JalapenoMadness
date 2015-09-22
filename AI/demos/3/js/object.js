'use strict';
console.log("object.js");

define([
	"prey",
	"hunter"
], function(_Prey, _Hunter){

	var Object = {
		Prey: _Prey,
		Hunter: _Hunter
	}

	return Object;
	
});
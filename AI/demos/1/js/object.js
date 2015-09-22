'use strict';
console.log("object.js");

define([
	"prey"
], function(_Prey){

	var Object = {
		Prey: _Prey
	}

	return Object;
	
});
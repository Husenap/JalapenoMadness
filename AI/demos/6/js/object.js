'use strict';
console.log("object.js");

define([
	"leader",
	"slot",
	"follower"
], function(_Leader, _Slot, _Follower){

	var Object = {
		Leader: _Leader,
		Slot: _Slot,
		Follower: _Follower
	}

	return Object;
	
});
'use strict';
console.log("object.js");

define([
	"leader",
	"slot",
	"follower",
	"hunter",
	"prey"
], function(_Leader, _Slot, _Follower, _Hunter, _Prey){

	var Object = {
		Leader: _Leader,
		Slot: _Slot,
		Follower: _Follower,
		Hunter: _Hunter,
		Prey: _Prey
	}

	return Object;
	
});
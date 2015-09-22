'use strict';
console.log("object.js");

define([
	"leader",
	"slot",
	"follower",
	"hunter"
], function(_Leader, _Slot, _Follower, _Hunter){

	var Object = {
		Leader: _Leader,
		Slot: _Slot,
		Follower: _Follower,
		Hunter: _Hunter
	}

	return Object;
	
});
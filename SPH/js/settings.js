'use strict';

define([
	"vector2"
], function(Vector2){
	var wi = 700;
	var he = 700;
	var ksr = 40;
	var kghs = Math.floor(ksr);

	var Settings = {
		WIDTH	: wi,
		HEIGHT	: he,

		kGravity: new Vector2(0, 982),
		kInteractionRadius: 40,
		kLinearViscosity: 0.001,
		kQuadraticViscosity: 0.01,
		kRestDensity: 100,
		kStiffness: 225,
		kStiffnessNear: 12500,
	};

	return Settings;
});

'use strict';

define(["vector2"], (Vector2) => {
	let wi = 1000;
	let he = 1000;
	let ksr = 40;
	let kghs = Math.floor(ksr);

	let Settings = {
		WIDTH	: wi,
		HEIGHT	: he,

		kGravity: new Vector2(0, 400),
		kInteractionRadius: 40,
		kLinearViscosity: 0.001,
		kQuadraticViscosity: 0.01,
		kRestDensity: 200,
		kStiffness: 25,
		kStiffnessNear: 2000,
	};

	return Settings;
});

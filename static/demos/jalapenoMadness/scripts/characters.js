"use strict";

define(function(){
	var characters = {
		JUAN: function(game, hasPhysics){
			var shadow = game.add.sprite(96, 256, 'juan');
			shadow.debug = true;
			shadow.anchor.setTo(0.5, 0.5);
			if(hasPhysics){
				game.physics.enable(shadow, Phaser.Physics.ARCADE);
				shadow.body.gravity.y = 982;
				shadow.body.collideWorldBounds = true;
				shadow.body.setSize(20, 32);
				shadow.body.drag.x = 500;
			}
			shadow.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 30, true);
			shadow.animations.add('right', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 30, true);
			shadow.animations.add('idle-left', [24], 10, true);
			shadow.animations.add('idle-right', [25], 10, true);
			shadow.animations.add('jump-up-left', [26], 10, true);
			shadow.animations.add('jump-down-left', [27], 10, true);
			shadow.animations.add('jump-up-right', [28], 10, true);
			shadow.animations.add('jump-down-right', [29], 10, true);
			shadow.animations.add('shoot-left', [30, 31, 32], 6, true);
			shadow.animations.add('shoot-right', [33, 34, 35], 6, true);
			shadow.animations.add('climbing-idle', [36], 10);
			shadow.animations.add('climbing', [37, 38], 10);
			shadow.animations.add('dance', [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 10);
			shadow.onLadder = false;
			shadow.canJump = false;
			return shadow;
		}
	}
	return characters;
});
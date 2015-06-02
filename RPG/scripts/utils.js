"use strict";

define(function(){

	var Utils = {
		game: null,

		loadTilemap: function(key){
			var map = game.add.tilemap('map');
			var col = map.properties.collision;
			for(var i = 0, len = map.layers.length; i < len; i++){
				map.setCollisionBetween(col[0], col[1], true, i);
			}
			return map;
		},

		mapPos: function(map){
			var x = Math.floor((game.input.mousePointer.position.x + (game.camera.position.x-game.width/2))/map.width)*map.width;
			var y = Math.floor((game.input.mousePointer.position.y + (game.camera.position.y-game.height/2))/map.height)*map.height;
			return new Phaser.Point(x, y);
		}

	};

	return Utils;
});
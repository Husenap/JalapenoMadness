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
		}

	};

	return Utils;
});
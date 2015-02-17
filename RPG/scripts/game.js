"use strict";

var game;
var map;
var utils;
var trunk, top;
var group;
var player;
var cursors;
var moving = false;

requirejs([
	'./settings',
	'./utils'
], function(Settings, Utils){

	Utils.game = game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:update, render:render}, false, false);

	function preload(){
		game.load.image('dude', 'assets/img/dude.png');
		game.load.image('tileset', 'assets/img/tileset.png');
		game.load.tilemap('map', 'assets/tilemaps/maps/test-map.json', null, 1);
	}
	function create(){
		group = game.add.group();
		map = Utils.loadTilemap('map');
		map.addTilesetImage('tileset');
		var bg = map.createLayer("Tile Layer 1");
		bg.resizeWorld();
		map.createLayer("Tile Layer 2");
		trunk = map.createLayer("Tile Layer 3");
		
		player = game.add.sprite(32, 32, 'dude');
		player.anchor.setTo(0, 2/3);
		top = map.createLayer("Tile Layer 4");
		game.camera.follow(player);
		cursors = game.input.keyboard.createCursorKeys();
	}
	function update(){
		if(!moving){
			if (cursors.left.isDown){
				if(!trunk.getTiles(player.x-32, player.y, 32, 32, true, true).length){
					moving = true;
			        game.add.tween(player).to({x: '-32'}, 250, Phaser.Easing.Linear.None, true).onComplete.add(function(){moving = false;}, this);
		    	}
		    }else if (cursors.right.isDown){
		    	if(!trunk.getTiles(player.x+32, player.y, 32, 32, true, true).length){
		    		moving = true;
		        	game.add.tween(player).to({x: '32'}, 250, Phaser.Easing.Linear.None, true).onComplete.add(function(){moving = false;}, this)
		        }
		    }else if (cursors.up.isDown){
		    	if(!trunk.getTiles(player.x, player.y-32, 32, 32, true, true).length){
			    	moving = true;
			        game.add.tween(player).to({y: '-32'}, 250, Phaser.Easing.Linear.None, true).onComplete.add(function(){moving = false;}, this)
		    	}
		    }else if (cursors.down.isDown){
		    	if(!trunk.getTiles(player.x, player.y+32, 32, 32, true, true).length){
			    	moving = true;
			        game.add.tween(player).to({y: '32'}, 250, Phaser.Easing.Linear.None, true).onComplete.add(function(){moving = false;}, this)
			    }
		    }
		}
		group.sort('y', Phaser.Group.SORT_ASCENDING);
	}
	function render(){

	}
});
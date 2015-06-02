"use strict";

var game;
var map;
var utils;
var trunk, top;
var group;
var player;
var cursors;
var hl;

requirejs([
	'./settings',
	'./utils',
	'./characters'
], function(Settings, Utils, Characters){

	Utils.game = game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:update, render:render}, false, false);

	function preload(){
		game.load.image('dude', 'assets/img/dude.png');
		game.load.image('tileset', 'assets/img/tileset.png');
		game.load.image('hl', 'assets/img/highlight.png');
		game.load.spritesheet('male', 'assets/img/male_char.png', 32, 48);
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
		
		player = Characters.Player(game);

		top = map.createLayer("Tile Layer 4");
		game.camera.follow(player);
		cursors = game.input.keyboard.createCursorKeys();
		hl = game.add.sprite(0, 0, 'hl');
	}
	function update(){
		player.interact(cursors, trunk);
		group.sort('y', Phaser.Group.SORT_ASCENDING);
		hl.position = Utils.mapPos(map);
	}
	function render(){

	}
});
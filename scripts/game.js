"use strict";

requirejs([
	'./settings'
], function (Settings) {

	var game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, 'Jalapeno Madness', {preload: preload, create: create, update: update, render: render});

	function preload(){
		game.load.image('bg', 'assets/img/bg.png');
		game.load.spritesheet('juan', 'assets/img/juan.png', 32, 48);
		game.load.tilemap('level1', 'assets/tilemaps/maps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles-1', 'assets/tilemaps/tiles/tiles-1.png');
	}

	var map;
	var tileset;
	var layer;
	var juan;
	var speed = 150;
	var cursors;
	var jumpButton;
	var bg;
	var ws = false;

	function create(){

		ws = new WebSocket("ws://echo.websocket.org/");
		ws.onopen = function(){
			alert("Connected!");
			ws.send("Connected");
		}
		ws.onerror = function(error){
			alert(error);
		}
		ws.onmessage = function(e){
			alert(e.data);
		}

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 300;

		bg = game.add.tileSprite(0, 0, 512, 512, 'bg');
		bg.fixedToCamera = true;

		map = game.add.tilemap('level1');
		map.addTilesetImage('tiles-1');
		map.setCollisionByExclusion([10, 11, 12, 13, 14, 15, 16, 17, 44, 45, 46, 47, 48, 49, 50, 51]);

		layer = map.createLayer('Tile Layer 1');
		//layer.debug = true;
		layer.resizeWorld();

		juan = game.add.sprite(32, 32, 'juan');
		juan.anchor.setTo(0.5, 0.5);

		game.physics.enable(juan, Phaser.Physics.ARCADE);
		juan.body.gravity.y = 982;
		juan.body.maxVelocity.y = 500;
		juan.body.collideWorldBounds = true;
		
		juan.animations.add('left', [0, 1, 2, 3], 60, true);
		juan.animations.add('right', [5, 6, 7, 8], 60, true);

		game.camera.follow(juan);
		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	function update(){

		game.physics.arcade.collide(juan, layer);

		juan.body.velocity.x = 0;
		if(cursors.right.isDown){
			juan.body.velocity.x=speed;
			juan.animations.play('right');
		}else if(cursors.left.isDown){
			juan.body.velocity.x=-speed;
			juan.animations.play('left');
		}else{
			juan.animations.stop();
		}
		if(jumpButton.isDown && juan.body.onFloor()){
			juan.body.velocity.y = -500;
		}
	}
	function render(){
	    //game.debug.body(juan);
	}

});

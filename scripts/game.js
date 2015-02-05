"use strict";

var ws;
var connected = false;
var player;
var onlinePlayers = [];
var players;

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
	var speed = 150;
	var cursors;
	var jumpButton;
	var bg;
	
	function create(){
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 300;

		bg = game.add.tileSprite(0, 0, 512, 512, 'bg');
		bg.fixedToCamera = true;

		map = game.add.tilemap('level1');
		map.addTilesetImage('tiles-1');
		map.setCollisionByExclusion([10, 11, 12, 13, 14, 15, 16, 17, 44, 45, 46, 47, 48, 49, 50, 51]);

		layer = map.createLayer('Tile Layer 1');
		layer.resizeWorld();
		players = game.add.group();
		ws = new WebSocket("ws://scribblehost.ws:1035/jalamad362250");
		ws.onopen = function(){
			ws.send(JSON.stringify( {'x': player.x, 'y': player.y} ));
			connected = true;
		}
		ws.onmessage = function(msg){
			var j = JSON.parse(msg.data);
			switch(j.id){
				case 1:
					onlinePlayers[j.uid] = createPlayerShadow();
					players.add(onlinePlayers[j.uid]);
				break;
				case 2:
					if(onlinePlayers[j.uid]){
						onlinePlayers[j.uid].x = j.x;
						onlinePlayers[j.uid].y = j.y;
					}else{
						onlinePlayers[j.uid] = createPlayerShadow();
						players.add(onlinePlayers[j.uid]);
						onlinePlayers[j.uid].x = j.x;
						onlinePlayers[j.uid].y = j.y;
					}
				break;
				case 3:
					if(onlinePlayers[j.uid]){
						players.remove(j.uid);
						onlinePlayers[j.uid] = null;
					}
				break;
			}
		}
		ws.onerror = function(error){
			
		}
		ws.onclose = function(){
			alert("Disconnected!");
		}

		player = game.add.sprite(32, 32, 'juan');
		player.anchor.setTo(0.5, 0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.gravity.y = 982;
		player.body.maxVelocity.y = 500;
		player.body.collideWorldBounds = true;
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		players.add(player);

		game.camera.follow(player);
		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	function update(){

		game.physics.arcade.collide(players, layer);

		player.body.velocity.x = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			player.body.velocity.x=speed;
			player.animations.play('right');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			player.body.velocity.x=-speed;
			player.animations.play('left');
		}else{
			player.animations.stop();
		}
		if(jumpButton.isDown && player.body.onFloor()){
			player.body.velocity.y = -500;
		}
		if(connected)ws.send(JSON.stringify( {'x': player.x, 'y': player.y} ));
	}
	function render(){
	    //players.forEachAlive(renderGroup, this);
	}
	function renderGroup(member){
		game.debug.body(member);
	}
	function createPlayerShadow(){
		var shadow = game.add.sprite(32, 32, 'juan');
		game.physics.enable(shadow, Phaser.Physics.ARCADE);
		shadow.anchor.setTo(0.5, 0.5);
		shadow.animations.add('left', [0, 1, 2, 3], 10, true);
		shadow.animations.add('right', [5, 6, 7, 8], 10, true);
		return shadow;
	}

});

"use strict";

var ws;
var connected = false;
var player;
var onlinePlayers = [];
var players;
var map, mapLadders;
var tileset;
var background, midground, foreground, ladders;
var jumpButton;
var game;
requirejs([
	'./settings',
	'./characters'
], function (Settings, Chars) {

	game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render}, false, false);

	function preload(){
		game.load.image('bg', 'assets/img/bg.png');
		game.load.spritesheet('juan', 'assets/img/juanSpriteSheet.png', 32, 32);
		game.load.tilemap('desert', 'assets/tilemaps/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('ladders', 'assets/tilemaps/maps/desert-ladders.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles-desert', 'assets/tilemaps/tiles/tiles-desert.png');
		game.load.image('bullet', 'assets/img/bullet.png');
	}
	
	
	var collisionExclusion = [10, 11, 12, 13, 14, 15, 16, 17, 31, 32, 33, 34, 46, 47, 48, 49, 50, 51, 69, 70, 120, 121];
	var speed = 150;
	var cursors;
	var shootButton
	var bg;
	var dir = 'right';
	var anim = 'idle-'+dir;
	var bullets;
	var shootTime = 0;
	
	function create(){
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 300;

		bg = game.add.tileSprite(0, 0, 800, 600, 'bg');
		bg.fixedToCamera = true;

		map = game.add.tilemap('desert');
		mapLadders = game.add.tilemap('ladders');
		map.addTilesetImage('tiles-desert');
		mapLadders.addTilesetImage('tiles-desert');
		map.setCollisionByExclusion(collisionExclusion);
		mapLadders.setCollisionByExclusion(collisionExclusion);

		background = map.createLayer('Background');
		midground = map.createLayer('Midground');
		midground.resizeWorld();
		ladders = mapLadders.createLayer('Ladders');

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
					onlinePlayers[j.uid] = Chars.JUAN(game, false);
					players.add(onlinePlayers[j.uid]);
				break;
				case 2:
					if(onlinePlayers[j.uid]){
						updateShadow(onlinePlayers[j.uid], j);
					}else{
						onlinePlayers[j.uid] = Chars.JUAN(game, false);
						players.add(onlinePlayers[j.uid]);
						updateShadow(onlinePlayers[j.uid], j);
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

		player = Chars.JUAN(game, true);
		players.add(player);

		game.camera.follow(player);
		foreground = map.createLayer('Foreground');
		bullets = game.add.group()
		bullets.setAll('checkWorldBounds', true);
    	bullets.setAll('outOfBoundsKill', true);
		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		shootButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
	}
	function update(){

		game.physics.arcade.collide(bullets);
		game.physics.arcade.overlap(bullets, midground, bulletCol);

		if(game.time.now < shootTime){
			game.physics.arcade.collide(players, midground);
			return;
		}
		if(shootButton.isDown){
			shootTime = game.time.now+400;
			anim = 'shoot-' + dir;
			player.animations.play(anim);
			fire();
			return;
		}
		//player.body.velocity.x = 0;
		if(ladderOverlap(player, ladders)){
			if(!player.onLadder){
				if(cursors.up.isDown || cursors.down.isDown)player.onLadder = player.canJump = true;
			}else{
				player.body.velocity.y = 0;
				if(cursors.up.isDown)player.body.velocity.y = -250;
				if(cursors.down.isDown)player.body.velocity.y = 200;
			}
		}else{
			player.canJump = player.onLadder = false;
		}
		if(!player.onLadder){
			game.physics.arcade.collide(players, midground);
				if(cursors.right.isDown){
				player.body.velocity.x=speed;
				dir = anim = 'right'
			}else if(cursors.left.isDown){
				player.body.velocity.x=-speed;
				dir = anim = 'left';
			}else{
				if(dir.indexOf('idle') == -1 && player.body.onFloor()){
					anim = 'idle-' + dir;
				}
			}
		}else{
			if(player.body.velocity.y == 0){
				anim = 'climbing-idle';
			}else{
				anim = 'climbing';
			}
		}
		if(player.body.onFloor() || player.canJump){
			if(jumpButton.isDown){
				player.body.velocity.y = -350;
				player.canJump = player.onLadder = false;
			}
		}else{
			if(player.body.velocity.y < 0){
				anim = 'jump-up-'+dir;
			}else{
				anim = 'jump-down-'+dir;
			}
		}
		player.animations.play(anim);
		if(connected)ws.send(JSON.stringify( {'x': player.x, 'y': player.y, 'anim': anim} ));
	}
	function render(){
	    //players.forEachAlive(renderGroup, this);
	}
	function renderGroup(member){
		game.debug.body(member);
	}
	function updateShadow(shadow, j){
		shadow.x = j.x;
		shadow.y = j.y;
		shadow.animations.play(j.anim);
	}
	function fire(){
		var bullet = game.add.sprite(player.x, player.y, 'bullet');
		game.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.scale.x = dir=='right'?1:-1;
		bullet.body.velocity.x = dir=='right'?500:-500;
		bullet.body.allowGravity = false;
		bullets.add(bullet);
		if(connected)ws.send(JSON.stringify( {'x': player.x, 'y': player.y, 'anim': anim} ));
	}
	function bulletCol(bullet, map){
		bullet.kill();
	}
	function ladderOverlap(sprite, ladder){
		var mapData = ladder.getTiles(
			sprite.body.position.x - sprite.body.tilePadding.x,
			sprite.body.position.y - sprite.body.tilePadding.y,
			sprite.body.width + sprite.body.tilePadding.x,
			sprite.body.height + sprite.body.tilePadding.y);

        if (mapData.length === 0)return false;
        
        for(var i = 0; i < mapData.length; i++){
        	var tile = mapData[i];
        	if(!tile.faceLeft && !tile.faceRight && !tile.faceBottom && !tile.faceTop)continue;
        	tile.position = {x: tile.left, y: tile.top};
        	if(game.physics.arcade.intersects(sprite, tile)){
        		if(sprite.onLadder){
					sprite.body.position.x = tile.position.x + 6;
        		}
        		return true;
        	}
        }
        return false;
	}
});

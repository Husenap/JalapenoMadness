"use strict";

define(function(){
	var Characters = {
		Player: function(game){
			var player = game.add.sprite(16, 32, 'male');
			player.anchor.setTo(0.5, 2/3);
			player.animations.add('walk', [4, 5, 6, 7]);
			player.animations.add('idle', [0]);	
			player.tint = 0xffdaad;
			player.level = 1000000;
			player.speed = 108+player.level;
			player.speedTime =  50+48000*Math.pow(player.speed, -1.02);
			player.moving = false;

			player.interact = function(cursors, layer){
				var stopped = function(){
					player.moving = false; 
					player.animations.play('idle');
				}
				var move = function(dir){
					var destX = 0;
					var destY = 0;
					switch(dir){
						case 'left':
							destX = -layer._mc.cw;
						break;
						case 'right':
							destX = layer._mc.cw
						break;
						case 'up':
							destY = -layer._mc.ch;
						break;
						case 'down':
							destY = layer._mc.ch;
						break;
					}
					if(!layer.getTiles(player.x+destX-16, player.y+destY, 32, 32, true, true).length){
						player.moving = true;
						game.add.tween(player).to({x: ''+destX, y: ''+destY}, player.speedTime, Phaser.Easing.Linear.None, true).onComplete.add(stopped, this);
						player.animations.play('walk', 4/(player.speedTime/1000));
					}
				}
				if(!player.moving){
					if (cursors.left.isDown){
						move('left');
					}else if (cursors.right.isDown){
						move('right');
				    }else if (cursors.up.isDown){
				    	move('up');
				    }else if (cursors.down.isDown){
				    	move('down');
				    }
				}
				
				player.speed = 108+player.level;
				player.speedTime = 50+48000*Math.pow(player.speed, -1.02);
			}

			return player;
		}
	}

	return Characters;
});
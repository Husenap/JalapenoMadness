'use strict';

define([
	'block',
	'settings',
	'jquery',
	'lodash',
	'async'
], function(Block, Settings, $, _, async){

	var DAS = Settings.DAS;
	var ARR = Settings.ARR;
	var SDS = Settings.SDS;
	var moveTimer = 0;
	var fallTimer = 0;
	var bounds = {};
	// *** INPUT BOOLEANS ***
	var initialX = true;
	var initialY = true;
	var isFalling = false;
	var moveDx = 0;

	var Piece = function(t, type){
		this.tiles = t;
		fallTimer = currentTime()+1000;
		this.locked = false;
		this.pos = {x: Math.floor((Settings.WIDTH-1)/2), y: 0};
		this.blocks = [];

		//KEEP THIS LAST
		this.createPiece(type);
	}
	Piece.prototype.update = function(){
		if(!this.locked){
			this.fall(isFalling);
			if(moveDx != 0){
				this.moveX(moveDx);
			}
			this.updateBlocks();
		}
	}
	Piece.prototype.updateBlocks = function(){
		var self = this;
		_.forEach(this.blocks, function(b){
			b.update(self.pos);
		});
	}
	Piece.prototype.calculateBounds = function(){
		_.forEach(this.blocks, function(b, index){
			if(index === 0){
				bounds = {left: b.pos.x, right: b.pos.x, top: b.pos.y, bottom: b.pos.y};
			}else{
				if(b.pos.x < bounds.left)bounds.left = b.pos.x;
				if(b.pos.x > bounds.right)bounds.right = b.pos.x;
				if(b.pos.y < bounds.top)bounds.top = b.pos.y;
				if(b.pos.y > bounds.bottom)bounds.bottom = b.pos.y;
			}
		});
	}
	Piece.prototype.bound = function(){
		this.calculateBounds();
		if(bounds.left<0)this.pos.x += 0-bounds.left;
		if(bounds.right>Settings.WIDTH-1)this.pos.x += (Settings.WIDTH-1)-bounds.right;
		if(bounds.bottom>Settings.HEIGHT-1){
			this.pos.y += (Settings.HEIGHT-1)-bounds.bottom;
			this.lock();
		}
		this.updateBlocks();
	}
	Piece.prototype.collision = function(){
		this.bound();
		var self = this;
		var flag = false;
		_.forEach(this.blocks, function(b){
			if(self.tiles[b.pos.x]!=undefined &&
				self.tiles[b.pos.x][b.pos.y+1]!=undefined &&
				self.tiles[b.pos.x][b.pos.y+1].attr('solid')=="true"){
				flag = true;
			}
		});
		if(flag){
			this.updateBlocks();
			this.lock();
		}
	}
	Piece.prototype.lock = function(){
		this.updateBlocks();
		this.locked = true;
	}
	Piece.prototype.draw = function(){
		_.forEach(this.blocks, function(b){
			b.draw();
		});
	}
	Piece.prototype.fall = function(input){
		if(input){
			if(initialY){
				this.pos.y++;
				fallTimer = currentTime()+250/DAS;
				initialY = false;
				$('#score').html(parseInt($('#score').html())+1);
			}else{
				if(currentTime() > fallTimer){
					this.pos.y++;
					fallTimer = currentTime()+250/SDS;
					$('#score').html(parseInt($('#score').html())+1);
				}
			}
		}else{
			if(currentTime() > fallTimer && initialY){
				this.pos.y++;
				fallTimer = currentTime()+1000;
			}
		}
		this.updateBlocks();
		this.collision();
	}
	Piece.prototype.hardDrop = function(){
		var bonus = 0;
		while(true){
			this.collision();
			if(this.locked)break;
			this.pos.y++;
			this.updateBlocks();
			bonus+=1;
		}
		$('#score').html(parseInt($('#score').html())+bonus);
	}
	Piece.prototype.predictGhost = function(){
		while(true){
			this.collision();
			if(this.locked)break;
			this.pos.y++;
			this.updateBlocks();
		}
		_.forEach(this.blocks, function(b){
			b.draw(0.25);
		});
	}
	Piece.prototype.moveX = function(dx){
		var flag = false;
		var self = this;
		async.series({
			bounds: function(next){
				if(bounds.left+dx < 0){flag = true;}
				if(bounds.right+dx > Settings.WIDTH-1){flag = true;}
				next();
			},
			collisions: function(){
				if(!flag){
					_.forEach(self.blocks, function(b){
						if(self.tiles[b.pos.x+dx]!=undefined &&
							self.tiles[b.pos.x+dx][b.pos.y]!=undefined &&
							self.tiles[b.pos.x+dx][b.pos.y].attr('solid')=="true"){
							flag = true;
						}
					});
				}
			}
		});
		if(!flag){
			if(initialX){
				this.pos.x+=dx;
				moveTimer = currentTime() + 250/DAS;
			}else{
				if(currentTime() > moveTimer){
					this.pos.x+=dx;
					moveTimer = currentTime() + 250/ARR;
				}
			}
			initialX = false;
			this.collision();
		}
	}
	Piece.prototype.rotate = function(cw){
		var rotate = true;
		var self = this;
		_.forEach(this.blocks, function(b){
			if(!b.predictRotation(cw, self.pos))rotate = false;
		});
		if(rotate){
			_.forEach(this.blocks, function(b){
				b.rotate(cw);
			});
		}
	}
	Piece.prototype.addBlock = function(_relpos){
		var block = new Block(this.tiles);
		var _pos = this.pos;
		block.relpos = _relpos;
		block.pos = {x:_relpos.x+_pos.x, y:_relpos.y+_pos.y};
		block.color = this.color;
		this.blocks.push(block);
	}
	Piece.prototype.createPiece = function(type){
		switch(type){
		case "I":
			this.color="#0bf";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 1, y: 0});this.addBlock({x: 2, y: 0});this.addBlock({x: -1, y: 0});
			break;
		case "O":
			this.color="#ff0";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 0, y: -1});this.addBlock({x: 1, y: -1});this.addBlock({x: 1, y: 0});
			break;
		case "T":
			this.color="#b3e";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 0, y: -1});this.addBlock({x: 1, y: 0});this.addBlock({x: -1, y: 0});
			break;
		case "S":
			this.color="#0f3";
			this.addBlock({x: 0, y: 0});this.addBlock({x: -1, y: 0});this.addBlock({x: 0, y: -1});this.addBlock({x: 1, y: -1});
			break;
		case "Z":
			this.color="#f33";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 1, y: 0});this.addBlock({x: 0, y: -1});this.addBlock({x: -1, y: -1});
			break;
		case "J":
			this.color="#33f";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 1, y: 0});this.addBlock({x: -1, y: 0});this.addBlock({x: -1, y: -1});
			break;
		case "L":
			this.color="#f90";
			this.addBlock({x: 0, y: 0});this.addBlock({x: -1, y: 0});this.addBlock({x: 1, y: 0});this.addBlock({x: 1, y: -1});
			break;
		default:
			this.color="#0bf";
			this.addBlock({x: 0, y: 0});this.addBlock({x: 0, y: 1});this.addBlock({x: 0, y: 2});this.addBlock({x: 0, y: -1});
			break;
		}
	}
	Piece.prototype.setMoveDx = function(dx){
		moveDx = dx;
	}
	Piece.prototype.setIsFalling = function(bool){
		isFalling = bool;
	}
	Piece.prototype.released = function(){
		initialX = true;
		initialY = true;
		moveDx = 0;
		isFalling = false;
	}

	return Piece;
});

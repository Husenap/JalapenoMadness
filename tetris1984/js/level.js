'use strict';

define([
	'piece',
	'settings',
	'jquery',
	'lodash'
], function(Piece, Settings, $, _){

	var tiles;
	var preview;
	var bag = ["I", "O", "T", "S", "Z", "J", "L"];
	var stack = [];
	var curPiece;
	var nextPiece;
	var timer = 0;
	var self;

	var Level = function(t, p){
		self = this;
		if(!tiles)tiles = t;
		if(!preview)preview = p;
		$("#lines").html(0);
		$("#level").html(1);
		$("#score").html(0);
		$("#time").html("0:00");
		this.gameOver = false;
		curPiece = null;
		nextPiece = null;
		this.lines = [];
		_.times(Settings.HEIGHT, function(){self.lines.push([])});
		timer = 0;
		this.timerInterval = window.setInterval(updateTimer, 1000);
		stack = _.shuffle(bag);
		this.newPiece();
	}
	Level.prototype.newPiece = function(){	
		if(curPiece)this.handleLockedPiece(curPiece);

		var type = _.pullAt(stack, 0)[0];
		curPiece = new Piece(tiles, type);

		if(stack.length <= 0)stack = _.shuffle(bag);
		nextPiece = new Piece(preview, stack[0]);
		nextPiece.pos = {x:0, y:1};
		nextPiece.update();
	}
	Level.prototype.handleLockedPiece = function(piece){
		var score = 0;
		var linesCleared = 0;
		var modified = [];
		_.forEach(piece.blocks, function(b){
			if(b.pos.y>=0){
				self.lines[b.pos.y][b.pos.x] = b;
				b.curr.attr('solid', 'true');
				modified.push(b.pos.y);
			}else{
				self.gameOver = true;
				window.clearInterval(self.timerInterval);
			}
		});
		modified = _.sortBy(_.uniq(modified), function(n){return -n;});
		var offset = 0;
		_.forEach(modified, function(line){
			var clear = true;
			_.times(Settings.WIDTH, function(tile){
				if(tiles[tile][line+offset].attr('solid')!="true")clear = false;
			});
			if(clear){
				linesCleared++;
				score += 100;
				self.clearLine(line+offset);
				offset++;
			}
		});
		$('#lines').html(parseInt($('#lines').html())+linesCleared);
		$('#score').html(parseInt($('#score').html())+score*linesCleared);
	}
	Level.prototype.clearLine = function(line){
		_.forEach(self.lines[line], function(block){
			if(block)block.curr.attr('solid', '');
		});
		self.lines[line] = [];
		_.times(line, function(n, yPos){
			self.lines[line-n] = _.clone(self.lines[line-n-1]);
			_.forEach(self.lines[line-n], function(block, xPos){
				if(block){
					block.curr.attr('solid', '');
					block.exactUpdate({x: xPos, y: line-n});
					block.curr.attr('solid', 'true');
				}
			});
		});
	}
	Level.prototype.update = function(){
		if(curPiece.locked)this.newPiece();
		curPiece.update();
	}
	Level.prototype.draw = function(){
		curPiece.draw();
		
		_.forEach(self.lines, function(line){
			_.forEach(line, function(block){
				if(block)block.draw();
			});
		});

		nextPiece.draw();
	}
	Level.prototype.clear = function(){
		_.forEach(tiles, function(col){
			_.forEach(col, function(tile){
				tile.html("&middot;");
			});
		});
		_.forEach(preview, function(col){
			_.forEach(col, function(tile){
				tile.html("");
			});
		});
	}
	$("body").keydown(function(e){
		switch(e.which){
		case 37: //left arrow		MOVE LEFT
			curPiece.setMoveDx(-1);
			break;
		case 39: //right arrow		MOVE RIGHT
			curPiece.setMoveDx(1);
			break;
		case 40: //down arrow 		SOFT DROP
			curPiece.setIsFalling(true);
			break;
		case 32: //space 			HARD DROP
			curPiece.hardDrop();
			break;
		case 38: //up arrow			ROTATE CW
			curPiece.rotate(true);
			break;
		case 17: //ctrl				ROTATE CCW
			curPiece.rotate(false);
			break;
		}
	});
	$("body").keyup(function(e){
		curPiece.released();
	});
	var updateTimer = function(){
		timer++;
		var minutes = Math.floor(timer/60);
		var seconds = (timer%60);
		if(seconds < 10)seconds = "0"+seconds;
		$("#time").html(minutes+":"+seconds);
	}
	
	return Level;
});

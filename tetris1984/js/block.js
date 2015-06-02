'use strict';

define([

], function(){

	var Block = function(t){
		this.tiles = t;
		this.pos = {};
		this.relpos = {};
		this.curr = null;
	}

	Block.prototype.update = function(newPos){
		this.exactUpdate({x:newPos.x+this.relpos.x, y:newPos.y+this.relpos.y});
	}
	Block.prototype.exactUpdate = function(newPos){
		this.pos = newPos;
		if(this.tiles[this.pos.x]!=undefined &&
			this.tiles[this.pos.x][this.pos.y]!=undefined){
			this.curr = this.tiles[this.pos.x][this.pos.y];
		}else{
			this.curr = null;
		}
	}
	Block.prototype.draw = function(){
		if(this.curr)this.curr.html("[]");
	}
	Block.prototype.rotate = function(cw){
		if(cw){
			//Clock-Wise Rotation
			var temp = this.relpos.y;
			this.relpos.y = this.relpos.x;
			this.relpos.x = -temp;
		}else{
			//Counter-Clock-Wise Rotation
			var temp = this.relpos.y;
			this.relpos.y = -this.relpos.x;
			this.relpos.x = temp;
		}
	}

	return Block;
});

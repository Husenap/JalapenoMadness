'use strict';
console.log("shape.js");

define([
	"vector2"
],function(Vector2){

	var Shape = {
		Circle: function(pos, r){
			this.pos = pos||new Vector2();
			this.r = r||10;
			this.color = "white";
		},
		Line: function(start, end){
			this.start = start||new Vector2();
			this.end = end||new Vector2();
			this.dir = this.end.Sub(this.start);
		}
	}

	Shape.Circle.prototype.draw = function(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();
	}

	Shape.Line.prototype.Set = function(a, b){
		this.start = a||new Vector2();
		this.end = b||new Vectro2();
		this.dir = this.end.Sub(this.start);
	}
	Shape.Line.prototype.Ray = function(p, a, l){
		this.start = p||new Vector2();
		this.end = this.start.Add((new Vector2(Math.cos(a),Math.sin(a))).Mul(l));
		this.dir = this.end.Sub(this.start);
	}
	Shape.Line.prototype.draw = function(){
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
		ctx.restore();
	}

	return Shape;

});
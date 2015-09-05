'use strict';
console.log("vector2.js");

define([

], function(){

	var Vector2 = function(x, y){
		this.x = x||0;
		this.y = y||0;
	};

	Vector2.prototype.Mag = function(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	Vector2.prototype.Dot = function(a){
		return this.x*a.x+this.y*a.y;
	}
	Vector2.prototype.Cross = function(a){
		return this.x*a.y-this.y*a.x;
	}
	Vector2.prototype.Normal = function(){
		return new Vector2(this.x/this.Mag(), this.y/this.Mag());
	}
	Vector2.prototype.Mul = function(f){
		return new Vector2(this.x*f, this.y*f);
	}
	Vector2.prototype.Div = function(d){
		return new Vector2(this.x/d, this.y/d);	
	}
	Vector2.prototype.Add = function(a){
		return new Vector2(this.x+a.x, this.y+a.y);
	}
	Vector2.prototype.Sub = function(a){
		return new Vector2(this.x-a.x, this.y-a.y);
	}
	Vector2.prototype.Equal = function(a){
		return (this.x==a.x&&this.y==a.y);
	}

	return Vector2
});
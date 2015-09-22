'use strict';
console.log("vector2.js");

define([

], function(){

	var Vector2 = function(x, y){
		this.x = x||0;
		this.y = y||0;
	};

	Vector2.prototype.Mag = function(){
		return Math.sqrt(this.Sqr());
	}
	Vector2.prototype.Dot = function(a){
		return this.x*a.x+this.y*a.y;
	}
	Vector2.prototype.Cross = function(a){
		return this.x*a.y-this.y*a.x;
	}
	Vector2.prototype.Normal = function(){
		var mag = this.Mag();
		return new Vector2(this.x/mag, this.y/mag);
	}
	Vector2.prototype.Normalize = function(){
		var mag = this.Mag();
		this.x = this.x/mag;
		this.y = this.y/mag;
	}
	Vector2.prototype.Mul = function(f){
		return new Vector2(this.x*f, this.y*f);
	}
	Vector2.prototype.Multiply = function(f){
		this.x *= f;
		this.y *= f;
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
	Vector2.prototype.Sqr = function(){
		return this.x*this.x+this.y*this.y;
	}
	Vector2.prototype.SetMag = function(m){
		this.Normalize();
		this.Multiply(m);
	}
	Vector2.prototype.Trunc = function(l){
		if(this.Sqr() > l*l){
			return this.Normal().Mul(l);
		}
		return this;
	}
	Vector2.prototype.Truncate = function(l){
		if(this.Sqr() > l*l){
			this.SetMag(l);
		}
	}
	Vector2.prototype.SetAngle = function(a){
		var l = this.Mag();
		this.x = Math.cos(a)*l;
		this.y = Math.sin(a)*l;
	}
	Vector2.prototype.Clone = function(){
		return new Vector2(this.x, this.y);
	}
	Vector2.prototype.incrementBy = function(a){
		this.x += a.x;
		this.y += a.y;
	}

	return Vector2;
});
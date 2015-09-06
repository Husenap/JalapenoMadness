'use strict';
console.log("person.js");

define([
	"shape",
	"vector2",
	"physics"
], function(Shape, Vector2, Physics){

	var Person = function(pos, name){
		this.pos = pos||new Vector2();
		this.body = new Shape.Circle(pos, 25);
		this.name = name;
		this.a = 1;
		this.vel = 1;
		this.tVel = 1;
		this.speed = 3;
		this.scanA = 0;
		this.scanR = 0;
		this.drag = 0.1;
		this.ray0 = new Shape.Line();
		this.ray1 = new Shape.Line();
		this.ray2 = new Shape.Line();
		this.pts = [];
	}

	Person.prototype.update = function(){
		var a = this.a;
		this.vel += (this.tVel-this.vel)*this.drag;
		var vel = (new Vector2(Math.cos(a), Math.sin(a))).Mul(this.vel);
		this.pos = this.pos.Add(vel);
		this.bound();
		this.body.pos = this.pos;
		var offA = Math.cos(this.scanA)*0.15+0.3;
		var offR = Math.sin(this.scanR)*50;
		this.ray0.Ray(this.pos, a, 150);
		this.ray1.Ray(this.pos, a-offA, 100+offR);
		this.ray2.Ray(this.pos, a+offA, 100-offR);
		
		this.scanA += 0.2;
		this.scanR += 0.01;
	}

	Person.prototype.bound = function(){
		if(this.pos.x < this.body.r)this.pos.x = this.body.r;
		if(this.pos.y < this.body.r)this.pos.y = this.body.r;
		if(this.pos.x > ctx.w-this.body.r)this.pos.x = ctx.w-this.body.r;
		if(this.pos.y > ctx.h-this.body.r)this.pos.y = ctx.h-this.body.r;
	}

	Person.prototype.draw = function(){
		this.body.draw();

		this.debug();

		ctx.save();
		ctx.strokeStyle="red";
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(this.pos.x+Math.cos(this.a)*20,this.pos.y+Math.sin(this.a)*20);
		ctx.stroke();
		ctx.restore();

		for(var i = 0; i < this.pts.length; i++){
			this.drawPoint(this.pts[i]);
		}
	}

	Person.prototype.debug = function(){
		this.ray0.draw();
		this.ray1.draw();
		this.ray2.draw();
	}

	Person.prototype.interact = function(objs){
		var flag0, flag1, flag2;
		this.pts = [];

		for(var i = 0; i < objs.length; i++){
			var seg = objs[i];

			var data = Physics.intersection(this.ray0, seg);
			if(data){
				flag0 = true;
				this.setSpeed(0.1);
				this.pts.push(data.p);
			}else{
				this.setSpeed(1);
			}
			data = Physics.intersection(this.ray1, seg);
			if(data){
				flag1 = true;
				this.rotate(0.01);
				this.pts.push(data.p);
			}
			data = Physics.intersection(this.ray2, seg);
			if(data){
				flag2 = true;
				this.rotate(-0.01);
				this.pts.push(data.p);
			}
		}
		if(flag0&&flag1&&flag2){
			this.setSpeed(-0);
			this.rotate(0.01);
			console.log("Backing up!");
		}
	}

	Person.prototype.drawPoint = function(p){
		ctx.save();
		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();
	}

	Person.prototype.setSpeed = function(s){
		this.tVel = s*this.speed;
	}

	Person.prototype.rotate = function(a){
		this.a += a*this.speed;
	}

	return Person;

});
'use strict';

define([
	"./vector2",
	"./boid"
], function(Vector2, Boid){


	var MovementManager = function(_parent){
		var parent = _parent;
		var host = _parent.boid;
		this.steering = new Vector2();
	
		//==================
		//===EXTERNAL API===
		//==================
		this.update = function(){
			this.steering.Truncate(host.maxForce);
			this.steering.Multiply(1/host.m);

			host.vel.incrementBy(this.steering);
			host.vel.Truncate(host.maxVel);

			host.setPos(host.pos.Add(host.vel));
			host.a = Math.atan2(host.vel.y, host.vel.x) + Math.PI/2;
			host.bound();
		}
		this.reset = function(){
			this.steering = host.vel.Mul(-0.5);
		}

		//================
		//===PUBLIC API===
		//================
		this.seek = function(t, r){
			this.steering.incrementBy(doSeek(t, r));
		}
		this.flee = function(t){
			this.steering.incrementBy(doFlee(t));
		}
		this.wander = function(){
			this.steering.incrementBy(doWander());
		}
		this.evade = function(b){
			this.steering.incrementBy(doEvade(b));
		}
		this.pursuit = function(b){
			this.steering.incrementBy(doPursuit(b));
		}
		this.avoidObstacle = function(o){
			this.steering.incrementBy(doAvoidObstacle(o));
		}
		//==================
		//===INTERNAL API===
		//==================
		var doSeek = function(t, r){
			var desired = t.Sub(host.pos);

			var distance = desired.Mag();
			desired.Normalize();

			if(distance <= r){
				desired.Multiply(host.maxVel * (distance/r));
			}else{
				desired.Multiply(host.maxVel);
			}

			return desired.Sub(host.vel);
		}
		var doFlee = function(t){
			var desired = host.pos.Sub(t).Normal().Mul(host.maxVel);
			return desired.Sub(host.vel);
		}
		var doWander = function(){
			var circleCenter = host.vel.Clone().Normal().Mul(host.wanderD);
			var displacement = new Vector2(0, -1).Mul(host.wanderR);
			displacement.SetAngle(host.wanderA);

			host.wanderA += Math.binomialRandom();

			return circleCenter.Add(displacement);
		}
		var doEvade = function(b){
			if(!(b instanceof Boid))return nothing();
			var distance = b.pos.Sub(host.pos).Mag();
			var T = distance/b.maxVel;
			var targetFuturePosition = b.pos.Add(b.vel.Mul(T));
			return doFlee(targetFuturePosition);
		}
		var doPursuit = function(b){
			if(!(b instanceof Boid))return nothing();
			var distance = b.pos.Sub(host.pos).Mag();
			var T = distance/b.maxVel;
			var targetFuturePosition = b.pos.Add(b.vel.Mul(T));
			return doSeek(targetFuturePosition, 0);
		}
		var doAvoidObstacle = function(o){
			var dynamic_length = host.vel.Mag() / parent.vision;
			var ahead = host.vel.Normal().Mul(dynamic_length);
			var avoidance = ahead.Sub(o.area.pos);
			avoidance.Normalize();
			avoidance.Multiply(host.maxAvoidForce);
			return avoidance;
		}
		var nothing = function(){
			return new Vector2();
		}

		//===============
		//===Debugging===
		//===============
		this.debug = function(){
			this.drawForce(this.steering, "red");
		}
		this.drawForce = function(f, col){
			ctx.save();
			ctx.strokeStyle=col;
			ctx.beginPath();
			ctx.moveTo(host.pos.x, host.pos.y);
			var line = f.Normal().Mul(100);
			ctx.lineTo(host.pos.x+line.x,host.pos.y+line.y);
			ctx.stroke();
			ctx.restore();
		}
	}

	return MovementManager;

});
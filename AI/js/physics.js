'use strict';
console.log("physics.js");

define([
	"vector2"
],function(Vector2){
	var Physics = {
		distToSegment2: function(p, seg){
			var l2 = Math.dist2(seg.start, seg.end);
			if(l2 == 0.0)return {d:Math.dist2(p, seg.start), p:seg.start};

			var t = p.Sub(seg.start).Dot(seg.dir)/l2;
			if(t < 0.0)return {d:Math.dist2(p, seg.start), p:seg.start};
			if(t > 1.0)return {d:Math.dist2(p, seg.end), p:seg.end};
			var cp = seg.start.Add(seg.dir.Mul(t));
			return {d:Math.dist2(p, cp), p:cp};
		},
		distToSegment: function(p, seg){
			var temp = this.distToSegment2(p, seg);
			return {d:Math.sqrt(temp.d), p:temp.p};
		},
		intersection: function(ray, seg){
			if(ray.dir.Normal().Equal(seg.dir.Normal()))return null;
			
			var sr = seg.start.Sub(ray.start);
			var T2 = ray.dir.Cross(sr)/seg.dir.Cross(ray.dir);
			var T1 = seg.dir.Cross(sr.Mul(-1))/ray.dir.Cross(seg.dir);
			if(T1<0 || T1>1)return null;
			if(T2<0 || T2>1)return null;

			return {
				p: ray.start.Add(ray.dir.Mul(T1)),
				t: T1
			}
		}
	};

	return Physics;
});
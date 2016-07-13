struct Triangle{
	vec2 p0;
	vec2 p1;
	vec2 p2;
	vec2 origin;
	float scale;
};

float sdTriangle( in Triangle t, in vec2 uv ) {
	uv -= t.origin;
	t.p0 *= t.scale;
	t.p1 *= t.scale;
	t.p2 *= t.scale;

	vec2 e0 = t.p1-t.p0;
	vec2 e1 = t.p2-t.p1;
	vec2 e2 = t.p0-t.p2;

	vec2 v0 = uv-t.p0;
	vec2 v1 = uv-t.p1;
	vec2 v2 = uv-t.p2;

	vec2 pq0 = v0 - e0*clamp(dot(v0,e0)/dot(e0,e0), 0.0, 1.0);
	vec2 pq1 = v1 - e1*clamp(dot(v1,e1)/dot(e1,e1), 0.0, 1.0);
	vec2 pq2 = v2 - e2*clamp(dot(v2,e2)/dot(e2,e2), 0.0, 1.0);

	vec2 d = min( min( vec2( dot( pq0, pq0 ), v0.x*e0.y-v0.y*e0.x ),
						vec2( dot( pq1, pq1 ), v1.x*e1.y-v1.y*e1.x )),
						vec2( dot( pq2, pq2 ), v2.x*e2.y-v2.y*e2.x ));

	return -sqrt(d.x)*sign(d.y);
}

struct Circle{
	vec2 origin;
	float radius;
};

float sdCircle(in Circle c, in vec2 uv){
	return length(c.origin - uv) - c.radius;
}

vec2 hash(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3.zxy, p3.yxz+19.19);
    return fract(vec2(p3.x * p3.y, p3.z*p3.x))*2.0 - 1.0;
}
float noise(in vec2 p){
    vec2 i = floor( p );
    vec2 f = fract( p );

	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}
const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );
float fbmt(in vec2 p, float tm){
    p *= 2.0;
    p -= tm;
	float z=2.;
	float rz = 0.;
    p += time*0.001 + 0.1;
	for (float i= 1.;i < 7.; i++){
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*1.93;
        p *= m2;
		p = p*2.;
	}
	return rz;
}
float fbm(vec2 p){
	float f = 0.0;
	f += 0.5000 * noise(p); p *= 2.2;
	f += 0.2500 * noise(p); p *= 2.3;
	f += 0.1250 * noise(p); p *= 2.1;
	f += 0.0625 * noise(p);
	f /= 0.9375;
	return f;
}

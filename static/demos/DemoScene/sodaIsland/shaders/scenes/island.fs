precision mediump float;

uniform float time;
uniform float systime;
uniform float beat;
uniform vec2 res;

const float PI = 3.1415926535898;

@import noise

bool drawIsland(vec2 uv, vec2 p, out vec3 color, in vec3 background){

	uv.x *= 0.5;
	uv.y *= 2.0;
	p.y -= 0.4;

	color = mix(
		vec3(1.0, 0.8, 0.7),
		background,
		smoothstep(0.48, 0.5, length(uv-p))
	);

	return false;
}

void main(){
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy / res);
	uv.x *= res.x/res.y;

	vec2 p = uv;

	float t = beat*PI;
	t /= 8.0;

	float surface = sin(p.x+t)*(0.1-fbmt(p, time*0.1)*0.05);

	vec3 color = mix(
		mix( vec3(0.5, 0.8, 1.0), vec3(0.1, 0.7, 1.0), smoothstep(0.7, 0.3, length(p-vec2(p.x, -1.0 + surface)))),
		mix( vec3(1.0, 0.7, 0.9), vec3(0.9, 0.6, 0.7), smoothstep(0.7, 0.3, length(p-vec2(p.x, 1.0 + surface)))),
		smoothstep(0.69, 0.7, length(p-vec2(p.x, -1.0 + surface)))
	);

	vec3 island = vec3(0.0);
	if(!drawIsland(uv, vec2(1.0 - time/10.0, -0.3 + surface), island, color))color = island;

	color = island;


	gl_FragColor = vec4(color, 1.0);
}

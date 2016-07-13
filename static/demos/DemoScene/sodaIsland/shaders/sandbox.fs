precision mediump float;

uniform float time;
uniform float systime;
uniform float beat;
uniform vec2 res;

@import noise
@import distanceOperations
@import bird

void main(){
	vec2 uv = (2.0*gl_FragCoord.xy - res.xy)/res.y;

	float scale = 0.025;
	vec2 pos = vec2(cos(time), 0.0);

	float d = 9999.0;

	vec2 flockCenter = cos(time + vec2(0.0, PI/2.0))*0.5;

	for(float i = 0.0; i < 20.0; i++){
		Bird b = Bird(
			flockCenter + vec2(fbm(vec2(time+(i+2.37)*10.0)*0.1), fbm(vec2(i*2.13+time)*0.1))*3.0,
			fbm(vec2(i*3.78+time)*0.32),
			1.0 + fbm(vec2(i+time)*0.1)*5.0,
			0.02
		);
		d = opU(d, distBird(b, uv));
	}

	float d1 = d;
	d = opUpoly(d, sdCircle(
		Circle(
			vec2(0.0),
			0.25
		),
		uv
	), 0.1);
	float d2 = d;

	vec3 fill1 = vec3(0.0, 0.0, 0.0);
	vec3 fill2 = vec3(1.0, 0.75, 0.0);

	vec3 col = vec3(0.5, 0.7, 0.9);
	float s = d < 0.0 ? 1.0 : 0.0;
	col = mix( col, mix(fill1, fill2, smoothstep(d, d2, d1)), 1.0-smoothstep(s, s+0.005, abs(d)));

	gl_FragColor = vec4(col, 1.0);
}

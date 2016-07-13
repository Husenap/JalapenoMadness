precision mediump float;

uniform float time;
uniform float systime;
uniform float beat;
uniform vec2 res;
uniform sampler2D img;

uniform float alpha;

@import noise

bool drawBubble(vec2 uv, vec2 p, float size, out vec3 col, in vec3 background, in float id){
	float r = dot(p, p);
	vec2 q = p - vec2(size);

	float resize = fbm(uv*0.5+50.0*id+time/50.0)*0.25;

	float ratio = (size+resize)/size;

	size += resize;

	if(r < size){
		col = mix(
			0.7*texture2D(img, uv-p).rgb + 0.3*background,
			background,
			smoothstep(size-0.01, size, r)
		);

		float f = 0.0;

		f = smoothstep(size-0.05, size+0.2, r);
		col += vec3(0.7, 0.9, 1.0)*f;


		f = 1.0 - smoothstep(-0.3*ratio, 0.3*ratio, length(p - vec2(0.1, -0.1)*ratio));
		col += vec3(0.7, 0.8, 1.0)*f*0.6;
		return true;
	}
	return false;
}

void main(){
	vec2 uv = gl_FragCoord.xy / res;
	vec2 q = -1.0 + 2.0*(gl_FragCoord.xy / res);
	q.x *= res.x/res.y;

	vec3 background = texture2D(img, uv).rgb;
	vec3 col = background;

	for(float i = 0.0; i < 20.0; i++){
		vec2 p = q;
		p += vec2(
			fbm(vec2(time/50.0,i*10.0))*10.0,
			fbm(vec2(i*10.0,time/50.0))*10.0
		);

		if(!drawBubble(uv, p, 0.05, col, col, i))col = col;
	}

	gl_FragColor = vec4(col, 1.0);
}


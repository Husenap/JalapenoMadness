precision mediump float;

uniform vec2 res;
uniform sampler2D img;

uniform float alpha;

uniform vec4 opts;

void main(){
	vec2 uv = gl_FragCoord.xy / res;

	gl_FragColor = mix(
		vec4(texture2D(img, uv).rgb, 1.0),
		vec4(opts.rgb, 1.0),
		clamp(alpha, 0.0, 1.0)
	);
}

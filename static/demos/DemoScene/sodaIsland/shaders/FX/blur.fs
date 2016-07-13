precision mediump float;

uniform vec2 res;
uniform sampler2D img;

uniform vec4 opts;

uniform float alpha;

void main(){
	vec2 uv = gl_FragCoord.xy / res;

	float delta = 0.01;
	vec4 color = vec4(0.0);
	color += texture2D(img, uv - vec2(delta*opts[0], 0.0));
	color += texture2D(img, uv - vec2(0.0, -delta*opts[1]));
	color += texture2D(img, uv - vec2(-delta*opts[2], 0.0));
	color += texture2D(img, uv - vec2(0.0, delta*opts[3]));
	color /= 4.0;

	gl_FragColor = color;
}

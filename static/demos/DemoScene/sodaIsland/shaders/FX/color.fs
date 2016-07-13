precision mediump float;

uniform vec2 res;
uniform sampler2D img;

void main(){
	vec2 uv = gl_FragCoord.xy / res;

	gl_FragColor = vec4(texture2D(img, uv).rgb, 1.0);
}

precision mediump float;

uniform vec2 res;
uniform sampler2D img;

uniform vec4 opts;

uniform float alpha;

void main(){
	vec2 uv = gl_FragCoord.xy / res;

	vec4 color = vec4(0.0);

	if(opts.w != 0.0){
		color += (1.0-alpha)*texture2D(img, uv) + opts*alpha;
		gl_FragColor = vec4(color.rgb, 1.0);
	}else{
		color += (texture2D(img, uv) + opts) * 0.5;
		gl_FragColor = vec4(color.rgb, 1.0);
	}
}

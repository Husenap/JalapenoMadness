precision mediump float;

uniform float beat;
uniform float time;
uniform vec2 res;

//NOISE
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 3.0 * n_xy;
}

float noise(vec2 p){
	return 0.4+0.6*cnoise(p);
}

//=====================
//=== READY SET ART ===
//=====================

float fbm(vec2 p){
	float f = 0.0;
	f += 0.5000 * noise(p); p *= 2.2;
	f += 0.2500 * noise(p); p *= 2.3;
	f += 0.1250 * noise(p); p *= 2.1;
	f += 0.0625 * noise(p);
	f /= 0.9375;
	return f;
}

bool drawEye(vec2 eye, vec2 center, float size, out vec3 col, in vec3 background){
	float r = dot(eye,eye);
	vec2 dif = center-eye;
	float a = atan(abs(dif.y), dif.x);

	float ratio = (size/0.5);
	float dist = length(center-eye);
	float idist = length(-center-eye);

	float ss = 0.5 + 0.5*sin(time);
	float anim = 1.0 + time*0.1;
	dist *= anim;
	r *= anim;

	if(r < size){
		col = vec3(0.0, 0.3, 0.4);

		//DEFORM ALL ANGLES
		a += 0.05*fbm(5.0*eye);

		//BLUE FBM
		float f = fbm((5.0+size)*eye);
		col = mix(col, vec3(0.4, 0.3, 0.8), f);


		//==============
		//=== FIBERS ===
		//==============
		//WHITE FIBERS
		f = smoothstep(0.1, 0.9, fbm(vec2(exp(2.0*idist*idist*idist), 20.0*a)));
		col = mix(col, vec3(0.7, 0.9, 1.0), 0.8*f);

		//BLACK FIBERS
		f = smoothstep(0.3, 0.9, fbm(vec2(8.0*dist, 20.0*a)));
		col = mix(col, vec3(0.05, 0.0, 0.1), 0.5*f);


		//=============
		//=== PUPIL ===
		//=============
		//ORANGE CENTER
		f = 1.0 - smoothstep(0.25*ratio, 0.5*ratio, dist+0.3*fbm(vec2(5.0*dist,10.0*a)));
		col = mix(col, vec3(0.9, 0.6, 0.2), 0.8*f);

		//DARK CENTER
		f = 1.0 - smoothstep(0.25*ratio, 0.5*ratio, dist+0.4*fbm(vec2(6.0*dist,10.0*a)));
		col = mix(col, vec3(0.5, 0.3, 0.1), 0.5*f);

		//PUPIL DARK GLOW
		f = 1.0 - smoothstep(0.2*ratio, 0.4*ratio, dist+0.5*fbm(vec2(2.0*dist,8.0*a)));
		col = mix(col, vec3(0.05, 0.0, 0.1), f);

		//PUPIL PURPLE GLOW
		f = 1.0 - smoothstep(0.15*ratio, 0.30*ratio, dist);
		col = mix(col, vec3(0.1, 0.0, 0.2), f);

		//PUPIL
		f = smoothstep(0.19*ratio, 0.21*ratio, dist);
		col *= f;


		//=======================
		//=== SPECULAR POINTS ===
		//=======================
		vec2 specOff = vec2(0.2, 0.3)+center*0.5;
		//BIG SPECULAR POINT
		f = 1.0 - smoothstep(0.0*ratio, 0.4*ratio, length(eye - specOff*ratio));
		col += vec3(1.0, 0.9, 0.7)*f*0.8;

		//SMALL SPECULAR POINT
		f = 1.0 - smoothstep(0.0*ratio, 0.1*ratio, length(eye + 0.5*specOff*ratio));
		col += vec3(1.0, 0.9, 0.7)*f*0.8;

		//TINY SPECULAR POINT
		f = 1.0 - smoothstep(0.0*ratio, 0.05*ratio, length(eye + specOff*ratio));
		col += vec3(1.0, 0.9, 0.7)*f*0.8;


		//===================
		//=== FINAL TOUCH ===
		//===================
		//VIGNETTE
		f = smoothstep(0.1*ratio, 0.7*ratio, r);
		col = mix(col, vec3(0.1, 0.0, 0.2), f);

		//SMOOTH EDGE
		f = smoothstep(size-0.05, size, r);
		col = mix(col, background, f);
		return false;
	}else{
		return true;
	}
}

void main(){
	vec2 p = -1.0 + 2.0*(gl_FragCoord.xy / res.xy);
	p.x *= res.x/res.y;

	// REPEAT DOMAIN
	vec2 q = p;
	q *= 3.0 + 0.5*sin(time*0.2);
	q.x += 10.0*cos(time*0.2);
	q.y += 10.0*sin(time*0.3);
	q = mod(q+vec2(1.0), 2.0)-vec2(1.0);

	vec3 background = vec3(0.1, 0.0, 0.3)*0.5;
	vec3 col = background;

	vec2 eye = q;
	vec2 center = vec2(cos(0.1*time), sin(0.5*time))*0.1;

	if(drawEye(eye, center, 0.8-dot(p,p), col, background))col = background;

	gl_FragColor = vec4(col, 1.0);
}

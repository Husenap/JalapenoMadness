@import constants
@import geometry

struct Bird{
	vec2 position;
	float rotation;
	float flapSpeed;
	float scale;
};

float distBird(in Bird b, in vec2 uv){
	float flap = sin(time*PI*b.flapSpeed);

	b.rotation += flap > 0.0 ? PI : 0.0;

	Triangle t = Triangle(
		cos(b.rotation + vec2(0.0, PI/2.0) + 0.0),
		cos(b.rotation + vec2(0.0, PI/2.0) + PI),
		cos(b.rotation + vec2(0.0, PI/2.0) + 1.0/2.0*PI)*-abs(flap),
		b.position,
		b.scale
	);

	return sdTriangle(t, uv);
}

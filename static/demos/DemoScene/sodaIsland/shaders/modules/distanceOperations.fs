//Union function
float opU( float d1, float d2 ){
	return min( d1, d2 );
}
//Smooth Union functions
float opUexp( float d1, float d2, float k ){
	float res = exp( -k*d1 ) + exp( -k*d2 );
	return -log( res )/k;
}
float opUpoly( float d1, float d2, float k ){
	float h = clamp( 0.5+0.5*( d2-d1 )/k, 0.0, 1.0 );
	return mix( d2, d1, h ) - k*h*( 1.0-h );
}
float opUpow( float d1, float d2, float k ){
	d1 = pow( d1, k ); d2 = pow( d2, k );
	return pow( (d1*d2)/(d1+d2), 1.0/k );
}

//Subtract function
float opS( float d1, float d2 ){
	return max( -d1, d2 );
}

//Intersect function
float opI( float d1, float d2 ){
	return max( d1, d2 );
}

//Domain repetition
vec2 opRep( vec2 p, vec2 c ){
	return mod( p,c )-0.5*c;
}

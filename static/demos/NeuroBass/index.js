MAX=64;
PI2 = Math.PI*2;

function Saw(t)
{
	return (t%1)*2-1;
}

function Dist(t, p, e)
{
	return 2-Math.exp(-e*(t%(Math.PI/p)));
}

onload = function update(){
	requestAnimationFrame(update);

	if(!window.time){
		time = 0;
		frame = 0;
		timeNextFrame = 0;

		str = "";
		s = !a.src;
	}

	currentTime = s ? MAX : a.currentTime;
	while(time < currentTime){
		while(time < timeNextFrame){
			if(s){
				v  = 0.5*Saw(time * 40);
				v += 0.3*Saw(time * 41);
				v += 0.3*Math.sin(time * 40);

				v *= Dist(time, 40, 30);

				str += String.fromCharCode(v*16 + 127);
			}
			time += 1/16384;
		}
		frame++;
		timeNextFrame += 1/60;
	}

	if(s){
		a.src = 'data:audio/wav;base64,'+
				'UklGRiQAAABXQVZFZm10IBAAAAABAAEAA'+
				'EAAAABA'+
				'AAABAAgAZGF0YQAAAAAA' + btoa(str);
		a.play();
		time = 0;
	}
};

MAX=64;

function Saw(t)
{
	return t%1;
}

onload = function update(){
	requestAnimationFrame(update);

	if(!window.time){
		time = 0;
		frame = 0;
		timeNextFrame = 0;

		bpm = 128;
		str = "";
		s = !a.src;
	}

	currentTime = s ? MAX : a.currentTime;
	while(time < currentTime){
		while(time < timeNextFrame){
			if(s){
				frac = (time*(bpm/64|0)) % 1;


				v = 0.4*Saw(time * bpm/5);
				v += 0.3*Saw(time * bpm/2.01);
				v += 0.2*Saw(time * bpm/4.025);
				v += 0.1*Saw(time * bpm/1.03);



				str += String.fromCharCode(v*32 + 127);
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
}

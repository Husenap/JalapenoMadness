//http://www.edmproducer.com/wp-content/uploads/2014/06/frequencychart.png

var c = b.getContext("2d");
var MAX = 64;

function key(n){
	return 0|(Math.pow(Math.pow(2, 1/12), n-69) * 440);
}
function createFreqList(keys, _bs){
	var noteFreqs = new Array(_bs);
	var len = keys.length;
	for(var i = 0; i < len; i++){
		var places = keys[i][1];
		for(var j = 0; j < places.length; j++){
			noteFreqs[places[j]-1] = key(keys[i][0]);
		}
	}
	for(var i = 0; i < noteFreqs.length; i++){
		if(!noteFreqs[i])noteFreqs[i] = 0;
	}
	return {
		list: noteFreqs,
		at: function(i){
			return this.list[i%this.list.length];
		}
	};
}
function LFO(time, f, a){
	
}

onload = function update(){
	requestAnimationFrame(update);
	
	if(!window.time){
		time = 0;
		frame = 0;
		timeNextFrame = 0;
		vines = [{x:0,y:0,a:0,ai:0,w:8,p:[],l:MAX*60}];

		// notesFreq = [155, 194, 261, 230, 194, 261, 195, 155];
		//notesFreq1 = [261, 261, 195, 195, 230, 230, 155, 155];
		/* twinkle twinkle
		melody = createFreqList([60, 60, 67, 67, 69, 69, 67, undefined, 65, 65, 64, 64, 62, 62, 60, undefined, 67, 67, 65, 65, 64, 64, 62, undefined, 67, 67, 65, 65, 64, 64, 62, undefined, 60, 60, 67, 67, 69, 69, 67, undefined, 65, 65, 64, 64, 62, 62, 60, undefined]);
		chords = createFreqList([48, 48, 48, 48, 53, 53, 48, undefined, 53, 53, 48, 48, 55, 55, 48, undefined, 48, 48, 53, 53, 48, 48, 55, undefined, 48, 48, 53, 53, 48, 48, 55, undefined]);
		*/
		noteIndex = -1;
		bpm = 512;
		beats = 128;
		melody = createFreqList([
				[88, [4,5]],
				[86, [34,35,66,67,82,83]],
				[84, [84,85]],
				[83, [10,11,26,27,42,43,74,75,86,87]],
				[81, [18,19,22,23,32,33,50,51,54,55,64,65,90,91]],
				[79, [20,21,30,31,52,53,62,63]],
				[78, [58,59]],
		],beats);
		chords = createFreqList([
				[76, [8, 16, 24, 32]], 
				[74, [40, 48, 56, 64]],
				[78, [72, 80, 88, 96]],
		],beats);
		str = "";
		s = !a.src;
	}

	currentTime = s ? MAX : a.currentTime;
	while(time < currentTime){
		while(time < timeNextFrame){
			if(s){
				frac = (time*(bpm/64|0)) % 1;
				noteIndex += frac==0;

				q = (1-frac);

				v = (time * melody.at(noteIndex) * (0|Math.cos(frac*8)*4)%1) * q*q * 32;

				v += (time * chords.at(noteIndex)&1) * frac * 32;
				v += (time * chords.at(noteIndex-1)&1) * q * 32;

				v += (time * chords.at(noteIndex+4)/8%1) * (1-Math.pow(frac, 10)) * 32;
				v += (time * (Math.random())%1) * q*q*q*0.25 * ((noteIndex+1)%4==0?(32*(currentTime/currentTime)):0);
				v += ((time*time * (Math.random() / (.01+frac)))%1) * (1-frac*frac) * ((noteIndex+1)%8==0?32:0);
				//v += (time * 0|Math.sin(time*10)%1) * 32;

				str += String.fromCharCode(v + 127);
			}
			time += 1/16384;
		}
		frame++;
		timeNextFrame += 1/60;

		vines = vines.filter(function(v){return v.l--});
		vines.forEach(function(v){
			dx = Math.cos(v.a) * v.w / 4
			dy = Math.sin(v.a) * v.w / 4
			v.x += dx;
			v.y += dy;
			v.a += v.ai / v.w / 2;
			v.p.splice(0, v.p.length - v.l);
			v.p.splice(0, v.p.length - 60 * 5);
			v.p.push({x:v.x, y:v.y, dx:dx, dy:dy});
			if(frame % 30 == 0){
				v.ai = Math.random()-.5;
			}
			if(v.w > 1 && Math.random() < v.l/16384/2){
				vines.push({x:v.x,y:v.y,a:v.a,ai:v.ai,w:v.w/2,p:[],l:Math.min(v.l, 0|v.w*32*(1+Math.random()))});
			}
		})
	}

	if(s){
		a.src = 'data:audio/wav;base64,'+
				'UklGRiQAAABXQVZFZm10IBAAAAABAAEAA'+
				'EAAAABA'+
				'AAABAAgAZGF0YQAAAAAA' + btoa(str);
		a.play();
		time = 0;
	}else{
		H = b.height = 512;
		W = b.width = 0 | H * innerWidth / innerHeight;
		c.translate(W/2, H/2);
		c.shadowBlur=8;
		vines.forEach(function(v){
			c.shadowColor =
			c.strokeStyle = "hsl("+(v.a*60|0)+", 100%, "+
							(50+v.w*5)+"%)";
			if(v.w == 8){
				c.translate(-v.x, -v.y);
			}
			c.beginPath();
			l=v.p.length-1;
			for(i=l; p=v.p[i]; i-=4){
				e=i/l*4;
				c.moveTo(p.x, p.y);
				c.lineTo(p.x-p.dx*e, p.y-p.dy*e);
			}
			c.stroke();
		})
	}
}


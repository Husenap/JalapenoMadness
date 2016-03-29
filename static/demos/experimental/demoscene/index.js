c=b.getContext("2d");
MAX=48;

function key(n){
	return 0|(Math.pow(Math.pow(2, 1/12), n-69) * 440);
}
function createFreqList(keys){
	var notesFreq = [];
	var len = keys.length;
	var l = len;
	for(;l--;)notesFreq.push(key(keys[len-1-l]));
	return {
		list: notesFreq,
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

		noteIndex = -1;
		// notesFreq = [155, 194, 261, 230, 194, 261, 195, 155];
		notesFreq1 = [261, 261, 195, 195, 230, 230, 155, 155];
		melody = createFreqList([60, 60, 67, 67, 69, 69, 67, undefined, 65, 65, 64, 64, 62, 62, 60, undefined, 67, 67, 65, 65, 64, 64, 62, undefined, 67, 67, 65, 65, 64, 64, 62, undefined, 60, 60, 67, 67, 69, 69, 67, undefined, 65, 65, 64, 64, 62, 62, 60, undefined]);
		chords = createFreqList([48, 48, 48, 48, 53, 53, 48, undefined, 53, 53, 48, 48, 55, 55, 48, undefined, 48, 48, 53, 53, 48, 48, 55, undefined, 48, 48, 53, 53, 48, 48, 55, undefined]);
		str = "";
		s = !a.src;
	}

	currentTime = s ? MAX : a.currentTime;
	while(time < currentTime){
		while(time < timeNextFrame){
			if(s){
				frac = (time) % 1;
				noteIndex += frac==0;

				v = (time * melody.at(noteIndex) * (0|Math.cos(frac*4)*2)%1) * (1-frac) * 32;
				v += (time * chords.at(noteIndex)&1) * (1-frac) * 16;
				//v += (time * (0|Math.cos(notesFreq[noteIndex&len]))&1) * (1-frac) * 0;
				v += (time * melody.at(noteIndex)%1) * (1-frac) * 16;

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
			if(v.w > 1 && Math.random() < v.l/16384/4){
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


var AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();

var saw1 = audioCtx.createOscillator();
var saw2 = audioCtx.createOscillator();
var sine = audioCtx.createOscillator();
var tri = audioCtx.createOscillator();
var gain = audioCtx.createGain();
var lp = audioCtx.createBiquadFilter();

saw1.connect(lp);
saw2.connect(lp);
sine.connect(lp);
tri.connect(gain.gain);
lp.connect(gain);
gain.connect(audioCtx.destination);

saw1.type = saw2.type = "sawtooth";
saw1.frequency.value = 40;
saw2.frequency.value = 41;

sine.type = "sine";
sine.frequency.value = 40;

tri.frequency.value = 3;



saw1.start();
saw2.start();
sine.start();
tri.start();

startTime = Date.now();
onload = function update()
{
	window.requestAnimationFrame(update);

	var t = (Date.now()-startTime)/1000;


}

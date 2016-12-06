var AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();

var saw1 = audioCtx.createOscillator();
var saw2 = audioCtx.createOscillator();
var sine = audioCtx.createOscillator();

saw1.type = saw2.type = "sawtooth";
saw1.frequency.value = 40;
saw2.frequency.value = 41;

sine.type = "sine";
sine.frequency.value = 40;

saw1.connect(audioCtx.destination);
saw2.connect(audioCtx.destination);
sine.connect(audioCtx.destination);

saw1.start();
saw2.start();
sine.start();


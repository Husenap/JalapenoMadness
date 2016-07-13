window.AudioContext = window.AudioContext || window.webkitAudioContext;

let Settings = {
	//Audio
	BPM: 158,

	//Graphics
	quality: 0.5,
	W: 0,
	H: 0
};

class GL{
	constructor(){
		this.gl = canvas.getContext("experimental-webgl");
		this.textures = [];
		this.fbos = [];
	}

	setViewport(x=0, y=0, w=Settings.W, h=Settings.H){
		this.gl.viewport(x, y, w, h);

		this.createFramebuffers();
	}

	createTexture(){
		let texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, Settings.W, Settings.H, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

		return texture;
	}
	createFramebuffers(){
		this.textures = [];
		this.fbos = [];

		for(let i = 0; i < 2; i++){
			let texture = this.createTexture();
			this.textures.push(texture);

			let fbo = this.gl.createFramebuffer();
			this.fbos.push(fbo);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);

			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
		}
	}
}

class VertexBuffer{
	constructor(size, type, data){
		//Vertex Buffer Object
		this.vbo = gl.gl.createBuffer();
		gl.gl.bindBuffer(gl.gl.ARRAY_BUFFER, this.vbo);
		gl.gl.bufferData(gl.gl.ARRAY_BUFFER, data, gl.gl.STATIC_DRAW);

		this.size = size;
		this.type = type;
		this.data = data;
	}

	bind(AI){
		gl.gl.bindBuffer(gl.gl.ARRAY_BUFFER, this.vbo);
		gl.gl.enableVertexAttribArray(AI);
		gl.gl.vertexAttribPointer(AI, this.size, this.type, false, 0, 0);
	}
}

class ShaderProgram{
	constructor(vertexID, fragmentID){
		this.modules = [];

		this.vertexShader = this.compile(gl.gl.VERTEX_SHADER, vertexID+"-vs");
		this.fragmentShader = this.compile(gl.gl.FRAGMENT_SHADER, fragmentID+"-fs");

		this.program = gl.gl.createProgram();
		gl.gl.attachShader(this.program, this.vertexShader);
		gl.gl.attachShader(this.program, this.fragmentShader);
		gl.gl.linkProgram(this.program);

		if(!gl.gl.getProgramParameter(this.program, gl.gl.LINK_STATUS))alert("PROGARM LINK FAILED");
	}
	compile(type, id){
		let shader = gl.gl.createShader(type);

		let code = document.getElementById(id).import.documentElement.innerText;

		code = this.importModules(code.split("\n")).join("\n");

		console.log(id, code);

		gl.gl.shaderSource(shader, code);
		gl.gl.compileShader(shader);

		if(!gl.gl.getShaderParameter(shader, gl.gl.COMPILE_STATUS)){
			alert(gl.gl.getShaderInfoLog(shader));
			console.log("Error in file:", id);
			return null;
		}
		return shader;
	}

	importModules(code){
		for(let i = 0; i < code.length; i++){
			let line = code[i];

			if(line.indexOf("@import") != -1){
				let moduleName = line.replace("@import", "").trim();

				if(this.modules.indexOf(moduleName) == -1){

					let module = document.getElementById("modules/"+moduleName).import.documentElement.innerText;

					code[i] = [
						"// === " + moduleName + " START ===",
						this.importModules(module.split("\n")).join("\n"),
						"// === " + moduleName + " END ===",
					].join("\n");

					this.modules.push(moduleName);
				}else{
					console.log("reimport of module:", moduleName);
					code[i] = "//Reimport of module: "+moduleName;
				}
			}
		}
		return code;
	}

	bind(){
		gl.gl.useProgram(this.program);
	}
	getAttribLoc(name){
		return gl.gl.getAttribLocation(this.program, name);
	}
	setFloatUniform(name, value=0){
		let loc = gl.gl.getUniformLocation(this.program, name);
		gl.gl.uniform1f(loc, value);
	}
	setVec2Uniform(name, value=[0,0]){
		let loc = gl.gl.getUniformLocation(this.program, name);
		gl.gl.uniform2f(loc, value[0], value[1]);
	}
	setVec3Uniform(name, value=[0,0,0]){
		let loc = gl.gl.getUniformLocation(this.program, name);
		gl.gl.uniform3f(loc, value[0], value[1], value[2]);
	}
	setVec4Uniform(name, value=[0,0,0,0]){
		let loc = gl.gl.getUniformLocation(this.program, name);
		gl.gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
	}
	setSamplerUniform(name, value=0){
		let loc = gl.gl.getUniformLocation(this.program, name);
		gl.gl.uniform1i(loc, value);
	}
}


class Demo{
	constructor(){
		//GRAPHICS
		this.quad = null;
		this.sh = {};
		this.fx = {};
		this.timeline = [];
		this.animation = null;

		//AUDIO
		this.audioContext = new AudioContext();
		this.analyser = this.audioContext.createAnalyser();
		this.source = this.audioContext.createMediaElementSource(audio);
		this.source.connect(this.analyser);
		this.analyser.connect(this.audioContext.destination);
		//FFT
		this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);
		this.frequencySegments = [0.1, 0.2, 0.3, 0.5, 0.6, 0.75];
		this.frequencyParts = [];
	}

	init(){
		let points = [-1, -1, -1, 1, 1, -1, 1, 1];
		this.quad = new VertexBuffer(2, gl.gl.FLOAT, new Float32Array(points));

		//SCENES
		this.sh.island = new ShaderProgram("BASE", "scenes/island");
		this.sh.sandbox = new ShaderProgram("BASE", "sandbox");

		//FX
		this.fx.fade = new ShaderProgram("BASE", "FX/fade");
		this.fx.tint = new ShaderProgram("BASE", "FX/tint");
		this.fx.blur = new ShaderProgram("BASE", "FX/blur");
		this.fx.bubbles = new ShaderProgram("BASE", "FX/bubbles");

		//DEFAULT COLOR SHADER
		this.sh.painter = new ShaderProgram("BASE", "FX/color");

		//TIMELINE
		this.timeline = [
			{
				s: (b) => 0,
				e: (b) => 32,
				sh: this.sh.sandbox,
				fx: [
					[this.fx.tint, [0, 0.65, 1, 1]],
				],
				t: 16
			},
			{
				s: (b) => 32,
				e: (b) => 192,
				sh: this.sh.sandbox,
				fx: [
					[this.fx.bubbles, [0, 0, 0, 0]],
					[this.fx.tint, [0, 0.65, 1, 1]],
					//[this.fx.blur, [1, 1, 1, 1]],
				],
				t: -4
			}
		];
	}

	graphics(){
		let time = audio.currentTime;
		let timeMS = time*1000;
		let delay = 60000 / Settings.BPM;
		let beat = timeMS / delay;

		gl.gl.viewport(0, 0, Settings.W, Settings.H);

		gl.gl.bindTexture(gl.gl.TEXTURE_2D, null);
		gl.gl.bindFramebuffer(gl.gl.FRAMEBUFFER, null);

		let pingpong = 0;

		for(let scene of this.timeline){
			if(beat < scene.s(beat) || beat > scene.e(beat))continue;

			//Draw Shader
			let shader = scene.sh;

			gl.gl.bindFramebuffer(gl.gl.FRAMEBUFFER, gl.fbos[pingpong]);

			shader.bind();
			shader.setFloatUniform("beat", beat);
			shader.setFloatUniform("time", time);
			shader.setFloatUniform("systime", performance.now()/1000);
			shader.setVec2Uniform("res", [Settings.W, Settings.H]);

			this.quad.bind(shader.getAttribLoc("p"));

			gl.gl.drawArrays(gl.gl.TRIANGLE_STRIP, 0, 4);
			gl.gl.bindTexture(gl.gl.TEXTURE_2D, gl.textures[pingpong%2]);

			//Draw FXs
			for(let fx of scene.fx){
				pingpong++;

				let fxShader = fx[0];
				let opts = fx[1];

				gl.gl.bindFramebuffer(gl.gl.FRAMEBUFFER, gl.fbos[pingpong%2]);

				fxShader.bind();
				fxShader.setFloatUniform("beat", beat);
				fxShader.setFloatUniform("time", time);
				fxShader.setFloatUniform("systime", performance.now()/1000);
				fxShader.setVec2Uniform("res", [Settings.W, Settings.H]);
				fxShader.setVec4Uniform("opts", opts);
				fxShader.setSamplerUniform("img", 0);

				let alpha = 0.0;
				if(scene.t !== undefined){
					let t = scene.t;
					if(t > 0 && beat >= scene.e(beat) - t){
						alpha = 1.0 - (scene.e(beat) - beat) / t;
					}
					if(t < 0 && beat <= scene.s(beat) - t){
						alpha = 1.0 - (scene.s(beat) - beat) / t;
					}
				}
				fxShader.setFloatUniform("alpha", alpha);

				gl.gl.drawArrays(gl.gl.TRIANGLE_STRIP, 0, 4);
				gl.gl.bindTexture(gl.gl.TEXTURE_2D, gl.textures[pingpong%2]);
			}

			let painter = this.sh.painter;
			gl.gl.bindFramebuffer(gl.gl.FRAMEBUFFER, null);

			painter.bind();
			painter.setVec2Uniform("res", [Settings.W, Settings.H]);
			painter.setSamplerUniform("img", 0);

			gl.gl.drawArrays(gl.gl.TRIANGLE_STRIP, 0, 4);
			break;
		}
	}

	audio(){

	}

	start(){
		audio.play();
		audio.volume = 0.0;
		this.animation = window.requestAnimationFrame(this.loop.bind(this));
	}
	loop(){
		this.animation = window.requestAnimationFrame(this.loop.bind(this));
		if(audio.ended)window.cancelAnimationFrame(this.animation);
		this.run();
	}
	run(){
		this.audio();
		this.graphics();
	}
}

let gl = null;
let demo = null;

let init = function(){
	gl = new GL();
	(window.onresize = function(){
		Settings.W = canvas.width = window.innerWidth*Settings.quality;
		Settings.H = canvas.height = window.innerHeight*Settings.quality;
		gl.setViewport(0, 0, Settings.W, Settings.H);
	})();

	demo = new Demo();
	demo.init();
	demo.start();
};

window.onload = init;

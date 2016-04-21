'use strict';

define([
	"particle",
	"vector2",
	"spatialHashGrid",
	"lines",
	"color",
	"settings"
], (Particle, Vector2, SpatialHashGrid, Lines, Color, Settings) => {
	
	//INPUT OBJECTS
	let Mouse = {pos: new Vector2()};
	let pMouse = {pos: new Vector2()};
	let Keyboard = {key:{}};

	//This is used for rendering the lines
	let lineRenderer;

	//Dynamic simulation variables
	let kGravity = Settings.kGravity;
	let kGravityState = true;
	let kLinearViscosity = Settings.kLinearViscosity;
	let kQuadraticViscosity = Settings.kQuadraticViscosity;
	let kRestDensity = Settings.kRestDensity;
	let kStiffness = Settings.kStiffness;
	let kStiffnessNear = Settings.kStiffnessNear;

	//Constant simulation variables
	const kDT = 1/60;
	const kInteractionRadius = Settings.kInteractionRadius;
	const kGridCellSize = 20;
	const kGridHalfColumns = Settings.WIDTH / kGridCellSize / 2;
	const kGridHalfRows = Settings.HEIGHT / kGridCellSize / 2;
	const kCollisionRadius = 20;

	//Spatial Hash and lists for particles/lines
	let grid = new SpatialHashGrid(kGridCellSize, kGridHalfColumns, kGridHalfRows);
	let particles = [];

	//Variables for rotating polygon
	//TODO: Turn this into a class that you can use more dynamically later
	let corners = [];
	let poly = 6;
	let dAngle = 0.005;

	//The class for the SPHSystem
	class SPHSystem{
		constructor(){
			//Set the (0,0) to the center of the canvas
			stage.position = new Vector2(grid.halfWidth, grid.halfHeight);
			
			//Instantiate the line renderer
			lineRenderer = new Lines();

			//Add 2 layers of boundaries to prevent leaking
			_.times(2, () => {
				lineRenderer.addLine(
						new Vector2(-grid.halfWidth, grid.halfHeight),
						new Vector2(grid.halfWidth, grid.halfHeight)
				);
				lineRenderer.addLine(
						new Vector2(grid.halfWidth, grid.halfHeight),
						new Vector2(grid.halfWidth, -grid.halfHeight)
				);
				lineRenderer.addLine(
						new Vector2(grid.halfWidth, -grid.halfHeight),
						new Vector2(-grid.halfWidth, -grid.halfHeight)
				);
				lineRenderer.addLine(
						new Vector2(-grid.halfWidth, -grid.halfHeight),
						new Vector2(-grid.halfWidth, grid.halfHeight)
				);
			});
		
			//Instantiate the rotating polygon
			_.times(poly, (i) => {
				corners.push(new Vector2(
					300*Math.cos((Math.PI*2)/poly*i),
					300*Math.sin((Math.PI*2)/poly*i)
				));
			});
			//Flip the polygon normals
			corners.reverse();
			_.times(corners.length, (i) => {
				lineRenderer.addLine(corners[i], corners[(i+1)%corners.length]);
			});

			setupInput();
		}

		update(timeStep){
			handleInputs();

			_.each(corners, (corner, n) => {
				let angle = Math.atan2(corner.y, corner.x);
				corner.SetAngle(angle + dAngle);
			});

			lineRenderer.update(Mouse);

			if(particles.length){
				timeStep = Math.min(timeStep, kDT);

				applyExternalForces(timeStep);
				applyViscosity(timeStep);
				advanceParticles(timeStep);
				doubleDensityRelaxation(timeStep);
				resolveCollisions(timeStep);
				updateVelPos(timeStep);
			}

			updateParameterList();
		}

		draw(){
			lineRenderer.draw();
		}
	}

	//==========================
	//===Simulation Functions===
	//==========================

	//Applies external forces such as gravity
	let applyExternalForces = (dt) => {
		_.each(particles, (p) => {
			if(kGravityState){
				p.velocity.incrementBy(kGravity.Mul(dt));
			}

			if(Mouse.right){
				let dir = Mouse.pos.Sub(p.position);
				if(dir.Equal(new Vector2()))return;
				let d2 = dir.Sqr();
				let r = 150;
				if(d2 < r*50){
					d2 = Math.sqrt(d2);
					p.velocity.incrementBy(dir.Div(d2).Mul(kGravity.Mag()*2*dt));
					if(!Mouse.pos.Equal(pMouse.pos)){
						let diff = Mouse.pos.Sub(pMouse.pos);
						let tot = diff.Mul(kGravity.Mag() * 1 * dt);
						p.velocity.incrementBy(tot);
					}
				}
			}
		});
	}


	let timer = performance.now();
	let mixColors = true;

	let applyViscosity = (dt) => {
		if(performance.now() - timer > 1000){
			mixColors = true;
			timer = performance.now();
		}

		_.each(particles, (p) => {
			_.each(p.neighbours, (n) => {
				if(p != n){
					let v = n.position.Sub(p.position);
					let q = v.Mag() / p.radius;
					if(q < 1){
						let vn = v.Normal();
						let u = vn.Dot(p.velocity.Sub(n.velocity));
						if(u > 0){
							let I = vn.Mul(0.5*dt * (1-q)*(kLinearViscosity * u + kQuadraticViscosity * u * u));
							p.velocity.incrementBy(I.Mul(-1));
							n.velocity.incrementBy(I);
						}
					}

					if(mixColors){
						let mixWeight = 0.5;
						/*let r = 1 - Math.sqrt((Math.pow(1-p.color.r, 2) + Math.pow(1-n.color.r, 2))/2);
						let g = 1 - Math.sqrt((Math.pow(1-p.color.g, 2) + Math.pow(1-n.color.g, 2))/2);
						let b = 1 - Math.sqrt((Math.pow(1-p.color.b, 2) + Math.pow(1-n.color.b, 2))/2);*/
						
						let r = p.color.r * mixWeight + n.color.r * (1-mixWeight);
						let g = p.color.g * mixWeight + n.color.g * (1-mixWeight);
						let b = p.color.b * mixWeight + n.color.b * (1-mixWeight);
						
						
						p.color.setTo(r, g, b);
						n.color.setTo(r, g, b);
					}
				}
			});
		});

		if(mixColors)mixColors=false;
	}
	let advanceParticles = (dt) => {
		_.each(particles, (p) => {
			p.positionPrev = p.position.Clone();
			p.position.incrementBy(p.velocity.Mul(dt));
		});

		_.remove(particles, (p) => {
			if(p.position.x < -grid.halfWidth || p.position.x > grid.halfWidth ||
				p.position.y < -grid.halfHeight || p.position.y > grid.halfHeight){
				p.kill();
				return true;
			}
			return false;
		});
		
		grid.updateNeighbours(particles);
	}
	
	let doubleDensityRelaxation = (dt) => {
		_.each(particles, (p) => {
			p.density = p.densityNear = 0;
			_.each(p.neighbours, (n) => {
				let v = n.position.Sub(p.position);
				let q = v.Mag() / p.radius;
				if(q < 1){
					p.density += Math.pow(1-q, 2);
					p.densityNear += Math.pow(1-q, 3);
				}
			});
			
			p.pressure = kStiffness * (p.density - p.restDensity);
			p.pressureNear = kStiffnessNear * p.densityNear;

			let dx = new Vector2();
			_.each(p.neighbours, (n) => {
				let v = n.position.Sub(p.position);
				if(v.Equal(new Vector2()))return;

				let q = v.Mag() / p.radius;
				if(q < 1){
					let D = v.Normal().Mul(0.5*dt*dt * (p.pressure*(1-q) + p.pressureNear*Math.pow(1-q, 2)));
					n.position.incrementBy(D);
					dx.incrementBy(D.Mul(-1));
				}
			});
			p.position.incrementBy(dx);
		});
	}

	//Resolve collisions with lines
	//TODO: Implement rigid body interaction
	let resolveCollisions = (dt) => {
		_.each(particles, (p) => {
			_.each(lineRenderer.Lines, (line) => {
				if(line.isDot)return;

				let particleVector = p.position.Sub(line.start);
				let vLine = line.Vector;
				let f = vLine.Dot(particleVector) / vLine.Sqr();
				if(f < 0 || f > 1)return;

				let proj = vLine.Mul(f);
				let d2 = proj.Sub(particleVector).Sqr();

				if(d2 > kCollisionRadius * kCollisionRadius)return;

				let lineN = vLine.PerpendicularLeft().Normal();

				p.position.incrementBy(lineN.Mul(Math.pow(kCollisionRadius - Math.sqrt(d2), 2) * dt));
			});
		});
	}

	//Update the velocity and position of each particle
	let updateVelPos = (dt) => {
		_.each(particles, (p) => {
			p.velocity = p.position.Sub(p.positionPrev).Div(dt);
			p.update();
		});
	}

	//UPDATE SIMULATION VALUES FROM INTERACTIVE INPUT
	let handleInputs = () => {
		if(Keyboard.key["KeyY"]) kRestDensity = clamp(kRestDensity+10, 0, 10000);
		if(Keyboard.key["KeyH"]) kRestDensity = clamp(kRestDensity-10, 0, 10000);
		if(Keyboard.key["KeyU"]) kStiffness = clamp(kStiffness+1, 0, 1000);
		if(Keyboard.key["KeyJ"]) kStiffness = clamp(kStiffness-1, 0, 1000);
		if(Keyboard.key["KeyI"]) kStiffnessNear = clamp(kStiffnessNear+100, 0, 100000);
		if(Keyboard.key["KeyK"]) kStiffnessNear = clamp(kStiffnessNear-100, 0, 100000);
		if(Keyboard.key["Digit3"]) kLinearViscosity = clamp(kLinearViscosity+0.5, 0, 100);
		if(Keyboard.key["Digit1"]) kLinearViscosity = clamp(kLinearViscosity-0.5, 0, 100);
		if(Keyboard.key["Digit4"]) kQuadraticViscosity = clamp(kQuadraticViscosity+0.001, 0, 0.05)
		if(Keyboard.key["Digit2"]) kQuadraticViscosity = clamp(kQuadraticViscosity-0.001, 0, 0.05);
		if(Keyboard.key["KeyR"]) dAngle += 0.005;
		if(Keyboard.key["KeyF"]) dAngle -= 0.005;
		if(Keyboard.key["ArrowUp"]) kGravity.y-=2;
		if(Keyboard.key["ArrowDown"]) kGravity.y+=2;
		if(Keyboard.key["ArrowLeft"]) kGravity.x-=2;
		if(Keyboard.key["ArrowRight"]) kGravity.x+=2;

		if(Keyboard.key["KeyD"]){
			lineRenderer.removeLast();
			Keyboard.key["KeyD"] = false;
			updateParameterList();
		}
		if(Keyboard.key["KeyG"]){
			kGravityState = !kGravityState;
			Keyboard.key["KeyG"] = false;
			updateParameterList();
		}

		if(Keyboard.key["KeyA"]){
			_.times(2, () => {
				particles.push(new Particle({
					newPos: Mouse.pos.Clone(),
					radius: kInteractionRadius,
					restDensity: kRestDensity,
					color: new Color(0, 0.3, 0.9)
				}));
			});
		}
		if(Keyboard.key["KeyC"]){
			_.remove(particles, (p) => {
				p.kill();
				return true;
			});
		}

		if(Keyboard.key["Digit7"]){
			_.times(2, () => {
				particles.push(new Particle({
					newPos: Mouse.pos.Clone(),
					radius: kInteractionRadius,
					restDensity: kRestDensity,
					color: new Color(1, 0.2, 0.2)
				}));
			});
		}
		if(Keyboard.key["Digit8"]){
			_.times(2, () => {
				particles.push(new Particle({
					newPos: Mouse.pos.Clone(),
					radius: kInteractionRadius,
					restDensity: kRestDensity,
					color: new Color(0.2, 1, 0.2)
				}));
			});
		}
		if(Keyboard.key["Digit9"]){
			_.times(2, () => {
				particles.push(new Particle({
					newPos: Mouse.pos.Clone(),
					radius: kInteractionRadius,
					restDensity: kRestDensity,
					color: new Color(1, 1, 0.2)
				}));
			});
		}
		if(Keyboard.key["Digit0"]){
			_.times(2, () => {
				particles.push(new Particle({
					newPos: Mouse.pos.Clone(),
					radius: kInteractionRadius,
					restDensity: kRestDensity,
					color: new Color(0.6, 0.2, 1)
				}));
			});
		}
	}
	
	//HELPER FUNCTIONS
	let updateParameterList = () => {
		$("#parameterList").find("#restDensity .val").text(kRestDensity);
		$("#parameterList").find("#stiffness .val").text(kStiffness);
		$("#parameterList").find("#stiffnessNear .val").text(kStiffnessNear);
		$("#parameterList").find("#linearViscosity .val").text(kLinearViscosity);
		$("#parameterList").find("#quadraticViscosity .val").text(kQuadraticViscosity);
		$("#parameterList").find("#dAngle .val").text(dAngle);
		$("#parameterList").find("#gravity .val").text(JSON.stringify(kGravity));
		$("#parameterList").find("#numPtcls .val").text(particles.length);
		$("#parameterList").find("#numLines .val").text(lineRenderer.Lines.length);
	}

	//INPUT HANDLING
	let setupInput = () => {
		$("canvas").bind('mousemove', (e) => {
			pMouse.pos.x = Mouse.pos.x;
			pMouse.pos.y = Mouse.pos.y;
			Mouse.pos.x = e.offsetX/Settings.SCALE.x - stage.position.x;
			Mouse.pos.y = e.offsetY/Settings.SCALE.y - stage.position.y;
		});
		$("canvas").mousedown( (e) => {
			if(e.which == 1)Mouse.left = true;
			if(e.which == 2)Mouse.middle = true;
			if(e.which == 3)Mouse.right = true;
		});
		$("canvas").mouseup( (e) => {
			if(e.which == 1)Mouse.left = false;
			if(e.which == 2)Mouse.middle = false;
			if(e.which == 3)Mouse.right = false;
		});
		$(document).keydown( (e) => {
			Keyboard.key[e.originalEvent.code] = true;
		});
		$(document).keyup( (e) => {
			Keyboard.key[e.originalEvent.code] = false;
		});
	}

	return SPHSystem;
});

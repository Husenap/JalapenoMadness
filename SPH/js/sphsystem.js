'use strict';

define([
	"particle",
	"vector2",
	"kernel",
	"spatialHashGrid",
	"line",
	"color",
	"settings"
], function(Particle, Vector2, Kernel, SpatialHashGrid, Line, Color, Settings){
	
var Mouse = {pos: new Vector2(), prePos: new Vector2()};
var Keyboard = {key:{}};

	var SPHSystem = function(){
		var kDT = 1/60;
		var kGravity = Settings.kGravity;
		var kGravityState = true;
		var kInteractionRadius = Settings.kInteractionRadius;
		var kLinearViscosity = Settings.kLinearViscosity;
		var kQuadraticViscosity = Settings.kQuadraticViscosity;
		var kRestDensity = Settings.kRestDensity;
		var kStiffness = Settings.kStiffness;
		var kStiffnessNear = Settings.kStiffnessNear;

		var kGridCellSize = 20;
		var kGridHalfColumns = Settings.WIDTH / kGridCellSize / 2;
		var kGridHalfRows = Settings.HEIGHT / kGridCellSize / 2;
		var kCollisionRadius = 20;

		var kernel = new Kernel(20);
		var grid = new SpatialHashGrid(kGridCellSize, kGridHalfColumns, kGridHalfRows);
		var particles = [];
		var lines = [];
		var linesCollision = [];
		this.getLines = function(){
			return lines.concat(linesCollision);
		};
		
		stage.position = new Vector2(grid.halfWidth, grid.halfHeight);

		_.times(2, function(i){
			addLine(new Vector2(-grid.halfWidth, grid.halfHeight),
					new Vector2(grid.halfWidth, grid.halfHeight), linesCollision);
			addLine(new Vector2(grid.halfWidth, grid.halfHeight),
					new Vector2(grid.halfWidth, -grid.halfHeight), linesCollision);
			addLine(new Vector2(grid.halfWidth, -grid.halfHeight),
					new Vector2(-grid.halfWidth, -grid.halfHeight), linesCollision);
			addLine(new Vector2(-grid.halfWidth, -grid.halfHeight),
					new Vector2(-grid.halfWidth, grid.halfHeight), linesCollision);
		});

		var corners = [
			new Vector2(-300, 300),
			new Vector2(200, 200),
			new Vector2(200, -200),
			new Vector2(-300, -300)
		]
		var corners = [];
		var poly = 4;
		_.times(poly, function(i){
			corners.push(new Vector2(
				300*Math.cos((Math.PI*2)/poly*-i),
				300*Math.sin((Math.PI*2)/poly*-i)
			));
		});
		_.times(2, function(){
			_.times(corners.length, function(i){
				var line = addLine(corners[i], corners[(i+1)%corners.length], linesCollision);
			});
		});
		
		function updateParameterList(){
			var parameterList = $("#parameterList");
			$(parameterList).find("#restDensity .val").text(kRestDensity);
			$(parameterList).find("#stiffness .val").text(kStiffness);
			$(parameterList).find("#stiffnessNear .val").text(kStiffnessNear);
			$(parameterList).find("#linearViscosity .val").text(kLinearViscosity);
			$(parameterList).find("#quadraticViscosity .val").text(kQuadraticViscosity);
			$(parameterList).find("#dAngle .val").text(dAngle);
			$(parameterList).find("#gravity .val").text(JSON.stringify(kGravity));
			$(parameterList).find("#numPtcls .val").text(particles.length);
			$(parameterList).find("#numLines .val").text(linesCollision.length);
		}

		function clamp(n, min, max){
			return Math.max(min, Math.min(max, n));
		}

		var dAngle = 0.005;

		this.update = function(timeStep){
			if(Keyboard.key["KeyY"]) kRestDensity = clamp(kRestDensity+10, 0, 10000);
			if(Keyboard.key["KeyH"]) kRestDensity = clamp(kRestDensity-10, 0, 10000);
			if(Keyboard.key["KeyU"]) kStiffness = clamp(kStiffness+1, 0, 1000);
			if(Keyboard.key["KeyJ"]) kStiffness = clamp(kStiffness-1, 0, 1000);
			if(Keyboard.key["KeyI"]) kStiffnessNear = clamp(kStiffnessNear+100, 0, 100000);
			if(Keyboard.key["KeyK"]) kStiffnessNear = clamp(kStiffnessNear-100, 0, 100000);
			if(Keyboard.key["Digit3"]) kLinearViscosity = clamp(kLinearViscosity+0.0001, 0, 1);
			if(Keyboard.key["Digit1"]) kLinearViscosity = clamp(kLinearViscosity-0.0001, 0, 1);
			if(Keyboard.key["Digit4"]) kQuadraticViscosity = clamp(kQuadraticViscosity+0.001, 0, 1);
			if(Keyboard.key["Digit2"]) kQuadraticViscosity = clamp(kQuadraticViscosity-0.001, 0, 1);
			if(Keyboard.key["KeyR"]) dAngle += 0.005;
			if(Keyboard.key["KeyF"]) dAngle -= 0.005;
			if(Keyboard.key["ArrowUp"]) kGravity.y-=2;
			if(Keyboard.key["ArrowDown"]) kGravity.y+=2;
			if(Keyboard.key["ArrowLeft"]) kGravity.x-=2;
			if(Keyboard.key["ArrowRight"]) kGravity.x+=2;

			if(Keyboard.key["KeyD"]){
				linesCollision.pop();
				Keyboard.key["KeyD"] = false;
				updateParameterList();
			}
			if(Keyboard.key["KeyG"]){
				kGravityState = !kGravityState;
				Keyboard.key["KeyG"] = false;
				updateParameterList();
			}

			if(Keyboard.key["KeyA"]){
				_.times(2, function(){
					particles.push(new Particle({
						newPos: Mouse.pos.Clone(),
						radius: kInteractionRadius,
						restDensity: kRestDensity,
						color: new Color(0, 0.3, 0.9)
					}));
				});
			}
			if(Keyboard.key["KeyC"]){
				_.remove(particles, function(p){
					p.kill();
					return true;
				});
			}

			_.each(corners, function(corner, n){
				var angle = Math.atan2(corner.y, corner.x);
				corner.SetAngle(angle + dAngle);
			});

			drawLine();
			if(particles.length){
				timeStep = Math.min(timeStep, kDT);

				applyExternalForces(timeStep);
				applyViscosity(timeStep);
				advanceParticles(timeStep);
				grid.updateNeighbours(particles);
				doubleDensityRelaxation(timeStep);
				resolveCollisions(timeStep);
				updateVelocity(timeStep);
				updatePosition(timeStep);
			}

			updateParameterList();
		};

		//Simulation Functions
		function applyExternalForces(dt){
			_.each(particles, function(p){
				if(kGravityState){
					p.velocity.incrementBy(kGravity.Mul(dt));
				}

				if(Mouse.right){
					var dir = Mouse.pos.Sub(p.position);
					if(dir.Equal(new Vector2()))return;
					var d2 = dir.Sqr();
					var r = 100;
					if(d2 < r*r){
						d2 = Math.sqrt(d2);
						p.velocity.incrementBy(dir.Div(d2).Mul(kGravity.Mag()*2*dt));
						if(!Mouse.pos.Equal(Mouse.prePos)){
							var diff = Mouse.pos.Sub(Mouse.prePos);
							var tot = diff.Mul(kGravity.Mag() * 0.5 * dt);
							p.velocity.incrementBy(tot);
						}
					}
				}
			});
		}
		var timer = performance.now();
		var mixColors = true;
		function applyViscosity(dt){
			if(performance.now() - timer > 2000){
				mixColors = true;
				timer = performance.now();
			}
			_.each(particles, function(p){
				_.each(p.neighbours, function(n){
					if(p != n){
						var v = n.position.Sub(p.position);
						var vLength = v.Mag();
						var vn = v.Normal();
						var u = vn.Dot(p.velocity.Sub(n.velocity));
						if(u > 0){
							var q = 1 - vLength / p.radius;
							var impulse = vn.Mul(0.5 * dt * q * (kLinearViscosity * u + kQuadraticViscosity * u * u));
							if(Math.abs(impulse.x) > 10000)impulse.x /= 10000;
							if(Math.abs(impulse.y) > 10000)impulse.y /= 10000;

							p.velocity.incrementBy(impulse.Mul(-1));
							n.velocity.incrementBy(impulse);
						}
						if(mixColors){
							var mixWeight = 0.5;
							var r = p.color.r * mixWeight + n.color.r * (1-mixWeight);
							var g = p.color.g * mixWeight + n.color.g * (1-mixWeight);
							var b = p.color.b * mixWeight + n.color.b * (1-mixWeight);
							p.color.setTo(r, g, b);
							n.color.setTo(r, g, b);
						}
					}
				});
			});
			if(mixColors)mixColors=false;
		}
		function advanceParticles(dt){
			_.each(particles, function(p){
				p.positionPrev = p.position.Clone();
				p.position.incrementBy(p.velocity.Mul(dt));
			});

			_.remove(particles, function(p){
				if(p.position.x < -grid.halfWidth || p.position.x > grid.halfWidth ||
					p.position.y < -grid.halfHeight || p.position.y > grid.halfHeight){
					p.kill();
					return true;
				}
				return false;
			});
		}
		function doubleDensityRelaxation(dt){
			_.each(particles, function(p){
				p.density = p.densityNear = 0;
				_.each(p.neighbours, function(n){
					var v = n.position.Sub(p.position);
					var q = 1 - v.Mag() / p.radius;
					p.density += q*q;
					p.densityNear += q*q*q;
				});
				
				p.pressure = kStiffness * (p.density - p.restDensity);
				p.pressureNear = kStiffnessNear * p.densityNear;

				if(p.pressure + p.pressureNear < 0.000001 || p.pressure + p.pressureNear > 1000000) p.pressure = p.pressureNear = 0;

				var dx = new Vector2();
				_.each(p.neighbours, function(n){
					var v = n.position.Sub(p.position);
					if(!v.Equal(new Vector2())){
						var length = v.Mag();
						var q = 1 - length / p.radius;
						var displacement = v.Normal().Mul(0.5*dt*dt * (p.pressure * q + p.pressureNear * q * q));
						n.position.incrementBy(displacement);
						dx.incrementBy(displacement.Mul(-1));
					}
				});
				p.position.incrementBy(dx);
			});
		}
		function resolveCollisions(dt){
			_.each(particles, function(p){
				_.each(linesCollision, function(line){
					if(line.isDot())return;

					var particleVector = p.position.Sub(line.start);
					var vLine = line.vector();
					var f = vLine.Dot(particleVector) / vLine.Sqr();
					if(f < 0 || f > 1)return;

					var proj = vLine.Mul(f);
					var d2 = proj.Sub(particleVector).Sqr();

					if(d2 > kCollisionRadius * kCollisionRadius)return;

					var lineN = vLine.PerpendicularLeft().Normal();

					p.position.incrementBy(lineN.Mul(Math.pow(kCollisionRadius - Math.sqrt(d2), 2) * dt));
				});
			});
		}
		function updateVelocity(dt){
			_.each(particles, function(p){
				p.velocity = p.position.Sub(p.positionPrev).Div(dt);
			});
		}
		function updatePosition(dt){
			_.each(particles, function(p){
				p.update();
			});
		}

		//Interactivity
		var isDrawingLine = false;
		function drawLine(){
			if(Mouse.left){
				if(isDrawingLine && linesCollision.length){
					linesCollision.last().end.Set(Mouse.pos.Clone());
				}else{
					addLine(Mouse.pos.Clone(), Mouse.pos.Clone(), linesCollision);
					isDrawingLine = true;
				}
			}else{
				if(isDrawingLine && linesCollision.length){
					if(linesCollision.last().isDot()){
						linesCollision.pop();
					}
					isDrawingLine = false;
				}
			}
		}
		

		//Helper Functions

		function addLine(s, e, list){
			var temp = new Line(s, e);
			list.push(temp);
			return temp;
		}

		
		//Keyboard and Mouse Listeners

		$("canvas").bind('mousemove', function(e){
			Mouse.prePos = Mouse.pos.Clone();
			Mouse.pos.x = e.offsetX/Settings.SCALE.x - stage.position.x;
			Mouse.pos.y = e.offsetY/Settings.SCALE.y - stage.position.y;
		});
		$("canvas").mousedown(function(e){
			switch(e.which){
			case 1:
				Mouse.left = true;
				break;
			case 2:
				Mouse.middle = true;
				break;
			case 3:
				Mouse.right = true;
			}
		});
		$("canvas").mouseup(function(e){
			switch(e.which){
			case 1:
				Mouse.left = false;
				break;
			case 2:
				Mouse.middle = false;
				break;
			case 3:
				Mouse.right = false;
			}
		});
		$(document).keydown(function(e){
			Keyboard.key[e.originalEvent.code] = true;

			if(Keyboard.key["Digit7"]){
				_.times(2, function(){
					particles.push(new Particle({
						newPos: Mouse.pos.Clone(),
						radius: kInteractionRadius,
						restDensity: kRestDensity,
						color: new Color(1, 0.2, 0.2)
					}));
				});
			}
			if(Keyboard.key["Digit8"]){
				_.times(2, function(){
					particles.push(new Particle({
						newPos: Mouse.pos.Clone(),
						radius: kInteractionRadius,
						restDensity: kRestDensity,
						color: new Color(0.2, 1, 0.2)
					}));
				});
			}
			if(Keyboard.key["Digit9"]){
				_.times(2, function(){
					particles.push(new Particle({
						newPos: Mouse.pos.Clone(),
						radius: kInteractionRadius,
						restDensity: kRestDensity,
						color: new Color(0.2, 0.2, 1)
					}));
				});
			}
			if(Keyboard.key["Digit0"]){
				_.times(2, function(){
					particles.push(new Particle({
						newPos: Mouse.pos.Clone(),
						radius: kInteractionRadius,
						restDensity: kRestDensity,
						color: new Color(0.6, 0.2, 1)
					}));
				});
			}
		});
		$(document).keyup(function(e){
			Keyboard.key[e.originalEvent.code] = false;
		});
	};

	return SPHSystem;
});

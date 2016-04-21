'use strict';

define(["line"], (Line) => {
	
	class Lines{
		constructor(){
			this.lines = [];

			this.graphics = new PIXI.Graphics();
			stage.addChild(this.graphics);

			this.isDrawingLine = false;
		}
		
		get Lines(){
			return this.lines;
		}

		update(Mouse){
			let { lines } = this;

			if(Mouse.left){
				if(this.isDrawingLine && lines.length){
					lines.last().end.Set(Mouse.pos.Clone());
				}else{
					this.addLine(Mouse.pos.Clone(), Mouse.pos.Clone());
					this.isDrawingLine = true;
				}
			}else{
				if(this.isDrawingLine && lines.length){
					if(lines.last().isDot){
						lines.pop();
					}
					this.isDrawingLine = false;
				}
			}
		}

		draw(){
			let { graphics, lines } = this;
			graphics.clear();
			graphics.lineStyle(5, 0xffffff, 1);
			_.each(lines, (line) => {
				graphics.moveTo(line.start.x, line.start.y);
				graphics.lineTo(line.end.x, line.end.y);
			});

			graphics.lineStyle(2, 0xffff00, 1);
			_.each(lines, (line) => {
				graphics.moveTo(line.MidPoint.x, line.MidPoint.y);
				graphics.lineTo(line.MidPoint.x+line.Normal.x*30, line.MidPoint.y+line.Normal.y*30);
			});
		}
		
		addLine(s, e){
			let temp = new Line(s, e);
			this.lines.push(temp);
			return temp;
		}

		removeLast(){
			this.lines.pop();
		}
	}

	return Lines;
});

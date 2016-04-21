'use strict';

define([], () => {

	class Line{
		constructor(start, end){
			this.start = start;
			this.end = end;
		}

		get isDot(){
			return this.start.Equal(this.end);
		}

		get Vector(){
			return this.end.Sub(this.start);
		}

		get MidPoint(){
			return this.start.Add(this.Vector.Div(2));
		}

		get Normal(){
			return this.Vector.PerpendicularLeft().Normal();
		}
	}

	return Line;
});

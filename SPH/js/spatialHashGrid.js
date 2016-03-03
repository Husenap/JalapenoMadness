'use strict';

define([
	"vector2",
	"settings"
], function(Vector2, Settings){

	var SpatialHashGrid = function(cellsize, halfColumns, halfRows){
		var self = this;
		this.cellSize = cellsize;
		var cellSize2 = cellsize*cellsize;
		this.halfColumns = halfColumns;
		this.halfRows = halfRows;
		this.columns = halfColumns * 2 + 1;
		this.rows = halfRows * 2 + 1;
		this.halfWidth = cellsize * halfColumns;
		this.halfHeight = cellsize * halfRows;
		this.buckets = {};

		this.getHashKey = function(pos){
			var x = Math.floor(pos.x/this.cellSize);
			var y = Math.floor(pos.y/this.cellSize);
			return new Vector2(x, y);
		};
		this.getHashValueV = function(pos){
			var x = Math.floor(pos.x/this.cellSize);
			var y = Math.floor(pos.y/this.cellSize);
			return this.getHashValue(x, y);
		};
		this.getHashValue = function(x, y){
			return x + y * this.rows;
		};

		this.updateNeighbours = function(particles){
			if(particles.length <= 0)return false;

			this.buckets = {};

			_.remove(particles, function(p){
				if(p.position.x < -self.halfWidth || p.position.x > self.halfWidth ||
					p.position.y < -self.halfHeight || p.position.y > self.halfHeight){
					p.kill();
					return true;
				}
				return false;
			});
			
			_.each(particles, function(p){
				p.key = self.getHashKey(p.position);
				
				for(var x = p.key.x-1; x <= p.key.x+1; x++){
					for(var y = p.key.y-1; y <= p.key.y+1; y++){
						var hashValue = self.getHashValue(x, y);

						if(!self.buckets[hashValue])self.buckets[hashValue] = [];

						self.buckets[hashValue].push(p);
					}
				}
			});
			
			_.each(particles, function(p){
				p.neighbours = [];
				_.each(self.buckets[self.getHashValue(p.key.x, p.key.y)], function(n){
					if(p != n){
						if(p.position.Sub(n.position).Sqr() < cellSize2){
							p.neighbours.push(n);
						}
					}
				});
			});
		};
	};

	return SpatialHashGrid;

});

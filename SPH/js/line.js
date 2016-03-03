'use strict';

define([

], function(){

	var Line = function(start, end){
		this.start = start;
		this.end = end;
		this.isDot = function(){
			return this.start.Equal(this.end);
		};
		this.vector = function(){
			return this.end.Sub(this.start);
		};
	};

	return Line;

});

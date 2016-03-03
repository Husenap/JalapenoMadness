Math.clamp = function(num, min, max) {
  return Math.min(Math.max(num, min), max);
};

Array.prototype.last = function(){
	return this[this.length-1];
};

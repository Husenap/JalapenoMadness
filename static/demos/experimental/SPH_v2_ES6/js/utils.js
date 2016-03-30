let clamp = (num=1, min=0, max=1) => Math.min(Math.max(num, min), max);

Array.prototype.last = function(){
	return this[this.length-1];
}


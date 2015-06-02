'use strict';

define([
	'jquery'
], function($){

	function toggleStyle(){
		switch($("#timeTravel").text()){
		case "1984":
			// OLD STYLE
			$("#timeTravel").text("TODAY");
			$("body").css({
				"color": "transparent",
				"text-shadow": "0 0 3px #968699",
			});
			$("#overlay").css("opacity", "1");
			break;
		case "TODAY":
			// NEW STYLE
			$("#timeTravel").text("1984");
			$("body").css({
				"color": "#968699",
				"text-shadow": "none",
			});
			$("#overlay").css("opacity", "0");
			break;
		}
	}

	function currentTime(){
		return Date.now();
	}
	
	window.toggleStyle = toggleStyle;
	window.currentTime = currentTime;
});

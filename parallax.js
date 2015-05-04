$(window).scroll(function(){
	var scrollTop = $(window).scrollTop();
	var windowHeight = $(window).height();
	$(".parallax").each(function(i,e){
		var parallaxHeight = $(e).parent().height();
		var imageHeight = $(e).height();
		var imageTop = $(e).parent().offset().top;
		var newImageTop = 0;
		var windowBottom = scrollTop+windowHeight;
		if(imageTop < windowBottom){
			var deltaPos = windowBottom - imageTop;
			var factor = deltaPos / (windowHeight + parallaxHeight);
			var deltaParallax = imageHeight - parallaxHeight;
			newImageTop = -deltaParallax*factor;
		}
		$(e).css("top", "0");
		$(e).css("top", newImageTop+"px");
	});
});
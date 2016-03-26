$(document).scroll(function(e){
	var scroll = $(document).scrollTop();
	//HEADER SCROLL HANDLE
	if(scroll > $(".site-header").height()-$(".site-nav-row").height()){
		$("body").addClass("site-header-active");
	}else{
		$("body").removeClass("site-header-active");
	}

	//CHAPTER SCROLL HANDLE
	if($(".chapter-title").length && $(".chapter-title").offset().top-scroll < $(".site-nav-row").height()){
		$("body").addClass("site-chapter-active");
	}else{
		$("body").removeClass("site-chapter-active");
	}
});

$(".menu-icon").click(function(e){
	$(".trigger").toggleClass("trigger-active");
});

$(".rippleParent").mousedown(function(e){
	handleRipple(this, e, "animateRipple");
});

function handleRipple(_parent, e, _class){
	if($(_parent).find(".ripple").length === 0){
		$(_parent).prepend("<span class='ripple'></span>");
	}

	var ripple = $(_parent).find(".ripple");
	ripple.removeClass(_class);

	if(!ripple.height() && !ripple.width()){
		var d = Math.max($(_parent).outerWidth(), $(_parent).outerHeight());
		ripple.css({height: d, width: d});
	}

	var x = e.pageX - $(_parent).offset().left - ripple.width()/2;
	var y = e.pageY - $(_parent).offset().top - ripple.height()/2;

	ripple.css({top: y+"px", left: x+"px"}).addClass(_class);

	console.log(parseFloat(getComputedStyle(ripple[0])['animationDuration'])*1000);
}

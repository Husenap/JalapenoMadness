//HEADER HACK
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

//SIDE MENU
$(".menu-icon").click(function(e){
	$(".trigger").toggleClass("trigger-active");
});
$(".menu-overlay").click(function(e){
	$(".trigger").removeClass("trigger-active");
});

//RIPPLE EFFECT
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

//MESH FRAGMENTS BEHAVIOUR
$(".meshPattern").each(function(n){
	$(this).attr("dx", 2*Math.random()-1);
	$(this).attr("dy", 2*Math.random()-1);
	console.log(n, this);
});

let animation = window.requestAnimationFrame(loop);
let x, y, dx, dy;
function loop(){
	animation = window.requestAnimationFrame(loop);
	$(".meshPattern").each(function(n){
		if(!$(this).is(":hover"))return;
		dx = +$(this).attr("dx");
		dy = +$(this).attr("dy");
		x = +$(this).css("background-position-x").slice(0,-2);
		y = +$(this).css("background-position-y").slice(0,-2);
		x += dx*50;
		y += dy*50;
		$(this).css("background-position-x", x+"px");
		$(this).css("background-position-y", y+"px");
		console.log("here", x, y);
	});
}

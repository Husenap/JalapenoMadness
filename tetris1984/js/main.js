'use strict';

define([
	'game',
	'./settings',
	'jquery',
	'lodash',
	'async'
], function(Game, Settings, $, _, async){
	
	var game = null;
	var tiles = [];
	var preview = [];
	var x = Settings.WIDTH;
	var y = Settings.HEIGHT;

	function start(){
		_.times(x, function(n){tiles.push([])});

		var grid = $("#grid");
		_.times(y, function(j){
			grid.append("<span>&lt;!</span>");
			_.times(x, function(i){
				grid.append("<span pos=\"x:"+i+",y:"+j+"\">&middot;</span>");
				tiles[i][j] = $("#wrapper [pos='x:"+i+",y:"+j+"']");
			});
			grid.append("<span>!&gt;</span><br>");
		});

		grid.append("<span>&lt;!</span>");
		_.times(x, function(){grid.append("<span>*</span>")});
		grid.append("<span>!&gt;</span><br>");

		grid.append("<span></span>");
		_.times(x, function(){grid.append("<span>\\/</span>")});
		grid.append("<span></span>");

		$("#sidebar").css('top', $("#wrapper").position().top);
		$("#sidebar").css('left', $("#wrapper").position().left-$("#sidebar").width());


		_.times(4, function(){preview.push([])});
		_.times(2, function(j){
			_.times(4, function(i){
				$("#preview").append("<span pos=\"x:"+i+",y:"+j+"\">&middot;</span>");
				preview[i][j] = $("#preview [pos='x:"+i+",y:"+j+"']");
			});
			$("#preview").append("<br>");
		});

		$("#preview").css('top', $("#sidebar").position().top+$("#wrapper").height()/2);
		$("#preview").css('left', $("#wrapper").position().left-$("#preview").width());

		game = new Game(tiles, preview);
	}
	$(window).resize(function(){
		console.log("RESIZE");
		$("#sidebar").css('top', $("#wrapper").position().top);
		$("#sidebar").css('left', $("#wrapper").position().left-$("#sidebar").width());
		$("#preview").css('top', $("#sidebar").position().top+$("#wrapper").height()/2);
		$("#preview").css('left', $("#wrapper").position().left-$("#preview").width());
	});
	async.series({
		drawGrid: function(next){
			start();
			next();
		},
		gameLoop: function(next){
			async.forever(
				function(next){
					game.loop();
					setTimeout(next, 0);
				}
			);
		}
	});
});

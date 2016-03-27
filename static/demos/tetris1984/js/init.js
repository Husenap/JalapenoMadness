'use strict';

requirejs.config({
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
		"lodash": "//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min",
		"async": "//cdnjs.cloudflare.com/ajax/libs/async/1.0.0/async.min"
	}
});

requirejs(["main"]);
requirejs(["utils"]);

---
layout: post
thumb: "/static/img/posts/CGfunReplays/thumb.png"
title: "CodinGame - Fun Replays"
tag: "post"
topics:
- Artificial Intelligence
- JavaScript
- CodinGame
- Fun Replay
date: 2016-07-06 16:07:00 +0200
decription: Read about how I made my fun replays for the CodeBusters contest on CodinGame.
permalink: /posts/:year/:month/:day/:title/
---

## What's this?

If you're here, you might be interested in how I made my fun replays for the [CodeBusters contest](http://husenap.github.io/contests/2016/07/05/CodeBusters/), if you haven't read about that, then feel free to do so.

If you haven't seen my replays yet, then you should watch them at the [bottom of this page](#links).


## Let's talk code!

I have added comments throughout the code blocks that explain what the following code does.

### Replay 1

Most of the code was just math for getting the movement working.
It shouldn't be too difficult to understand.

For the lyrics, I decided to save the data in an object which made it easy for me to pick which game step and which buster would say what.
The format I decided to go with was `"turn:id" : "message"`.

{% highlight javascript linenos %}
//CHOREOGRAPHY
let step = 0;
let lyrics = {
	"50:0":"We", "50:1":"Ain't", "50:2":"Afraid", "50:3":"Of", "50:4":"No", "50:5":"Ghosts!",
	"51:0":"We", "51:1":"Ain't", "51:2":"Afraid", "51:3":"Of", "51:4":"No", "51:5":"Ghosts!",
	"52:0":"We", "52:1":"Ain't", "52:2":"Afraid", "52:3":"Of", "52:4":"No", "52:5":"Ghosts!",
	"53:0":"We", "53:1":"Ain't", "53:2":"Afraid", "53:3":"Of", "53:4":"No", "53:5":"Ghosts!",
	"54:0":"We", "54:1":"Ain't", "54:2":"Afraid", "54:3":"Of", "54:4":"No", "54:5":"Ghosts!",
	"55:0":"YEAH!!!", "55:1":"YEAH!!!", "55:2":"YEAH!!!", "55:3":"YEAH!!!", "55:4":"YEAH!!!", "55:5":"YEAH!!!", "55:6":"YEAH!!!", "55:7":"YEAH!!!", "55:8":"YEAH!!!", "55:9":"YEAH!!!",
	"56:0":"YEAH!!!", "56:1":"YEAH!!!", "56:2":"YEAH!!!", "56:3":"YEAH!!!", "56:4":"YEAH!!!", "56:5":"YEAH!!!", "56:6":"YEAH!!!", "56:7":"YEAH!!!", "56:8":"YEAH!!!", "56:9":"YEAH!!!",
	"57:5":"We", "57:6":"Ain't", "57:7":"Afraid", "57:8":"Of", "57:9":"No", "57:0":"Ghosts!",
	"58:5":"We", "58:6":"Ain't", "58:7":"Afraid", "58:8":"Of", "58:9":"No", "58:0":"Ghosts!",
	"59:5":"We", "59:6":"Ain't", "59:7":"Afraid", "59:8":"Of", "59:9":"No", "59:0":"Ghosts!",
	"60:5":"We", "60:6":"Ain't", "60:7":"Afraid", "60:8":"Of", "60:9":"No", "60:0":"Ghosts!",
	"61:5":"We", "61:6":"Ain't", "61:7":"Afraid", "61:8":"Of", "61:9":"No", "61:0":"Ghosts!",
	"62:0":"YEAH!!!", "62:1":"YEAH!!!", "62:2":"YEAH!!!", "62:3":"YEAH!!!", "62:4":"YEAH!!!", "62:5":"YEAH!!!", "62:6":"YEAH!!!", "62:7":"YEAH!!!", "62:8":"YEAH!!!", "62:9":"YEAH!!!",
	"63:0":"YEAH!!!", "63:1":"YEAH!!!", "63:2":"YEAH!!!", "63:3":"YEAH!!!", "63:4":"YEAH!!!", "63:5":"YEAH!!!", "63:6":"YEAH!!!", "63:7":"YEAH!!!", "63:8":"YEAH!!!", "63:9":"YEAH!!!",

	// Too much data to paste in here...

	"199:0":"Codin Game",
	"199:1":"Ghost Busters",
	"199:2":"[CG]jupoulton",
	"199:3":"Break Dancers",
	"199:4":"Codin Game",
	"199:5":"Ghost Busters",
	"199:6":"[CG]jupoulton",
	"199:7":"Husenap",
	"199:8":"By:",
	"199:9":"Made",
};
//PART 1
let radius = 13000;
let startAngle = 1.5 * Math.PI;
//PART 2
let stun = 0;
let stunCircle = 0;
//PART 3
let ghostsToBust = [47, 48, 37, 38, 17, 18, 7, 8, 27, 28];

while(true){
	//TODO: Read input like you normally would

	//Loops through the busters and coordinates them
	for(let buster of busters){
		// Get the lyric for the current buster
		let message = lyrics[[step, buster.id].join(":")];
		if(message===undefined)message="";

		// Go through the different parts of the choreography one by one
		if(step < 100){
			// === FIRST PART ===
			// This is the herding part where the busters go out to the
			// edges and herd the ghosts towards the center. But it also
			// includes the part where the busters run around in a circle
			// and to the stun train.

			// Here is the condition for the stun train, notice the continue;
			if(radius == 2600 && stun<=0){
				print("STUN", (buster.id+1)%10, message);
				continue;
			}

			// Herding
			let targetPoint = new Point(
					8000 + radius*Math.cos(startAngle - buster.id*(Math.PI/5)),
					4500 + radius*Math.sin(startAngle - buster.id*(Math.PI/5))
					);
			targetPoint.round();
			print("MOVE", targetPoint.x, targetPoint.y, message);
		}else if(step < 150){
			// === SECOND PART ===
			// This is when the busters stun each other one at a time which
			// gives a cool wave motion.

			if(stunCircle == buster.id)
				print("STUN", (buster.id+1)%10, message);
			else
				print("MOVE", buster.x, buster.y, message);
		}else if(step < 152){
			// This is the small part where the busters go in to the center
			// to get in range for busting the ghosts

			radius = 1400;
			let targetPoint = new Point(
					8000 + radius*Math.cos(startAngle - buster.id*(Math.PI/5)),
					4500 + radius*Math.sin(startAngle - buster.id*(Math.PI/5))
					);
			targetPoint.round();
			print("MOVE", targetPoint.x, targetPoint.y, message);
		}else if(step < 155){
			// This is the busting part itself, hardcoded to pick only ghosts
			// with the stamina 3, thus the short length of this part.

			print("BUST", ghostsToBust[buster.id], message);
		}else if(step < 194){
			// This is the part where the busters run around in a circle and
			// thank the CG team.

			let targetPoint = new Point(
					8000 + radius*Math.cos(startAngle - buster.id*(Math.PI/5)),
					4500 + radius*Math.sin(startAngle - buster.id*(Math.PI/5))
					);
			targetPoint.round();
			print("MOVE", targetPoint.x, targetPoint.y, message);
		}else if(step < 195){
			// GHOST RELEASERS!

			print("RELEASE", message);
		}else{
			// This is the finale where the busters position themselves in a pentagon.

			let targetPoint = new Point(
					8000 + (radius + 700*(buster.id%2))*Math.cos(startAngle - buster.id*(Math.PI/5)),
					4500 + (radius + 700*(buster.id%2))*Math.sin(startAngle - buster.id*(Math.PI/5))
					);
			targetPoint.round();
			print("MOVE", targetPoint.x, targetPoint.y, message);
		}
	}

	// These conditions are for changing global variables for all the busters
	if(step < 100){
		// === FIRST PART ===

		if(radius > 2600){
			radius -= 200;
		}else{
			if(stun<=0){
				stun = 19;
			}else{
				stun--;
				startAngle += 0.04*Math.PI;
			}
		}
	}else if(step < 150){
		// === SECOND PART ===
		stunCircle = (stunCircle+9)%10;
	}else if(step < 155){
		//Leaving this empty just to wait for the next part
	}else if(step < 195){
		if(radius < 3000)radius += 200;
		startAngle += 0.04*Math.PI;
	}else{
		startAngle = Math.PI * 11/10;
	}
}
{% endhighlight %}

### Replay 2

After the first replay, I realised that the way I had picked to save the lyrics data was way too slow to work with.
It was good because it gave me a lot of freedom, but if I wanted to do this again, I had to change it.

The new format was an object which contained arrays that were accessible by the buster id, like this `{"id":[data]}`.
Now, I had to shorten the lyrics data A LOT, because 20kb for a short replay is too much, so here's what I did:
`"id":[ [startTurn, endTurn, "message"] ]`

{% highlight javascript linenos %}
let lyrics = {
	"0":[
		[59, 65, "For"],
		[66, 75, "All"],
		[80, 85, "My"],
		[86, 92, "Let"],

		[107, 109, "GulJahn"],

		[190, 200, "Thank You All"],
	],
	"1":[
		[58, 65, "Me"],
		[67, 75, "The"],
		[79, 85, "Replay's"],
		[87, 92, "Us"],

		[99, 101, "SamSi"],
		[179, 181, "JasperV"],

		[188, 200, "Husenap"],
	],
	// The same goes here, too much to paste, not important...
	"9":[
		[59, 65, "Come"],
		[66, 75, "Chat"],
		[80, 85, "Re Tweeted"],
		[86, 92, "Thank:"],

		[147, 149, "Eagle Dawn"],

		[195, 200, "Words"],
	]
};
// I introduced a new order variable, this let me choose what order
// the busters would stand in, for example: red, yellow, red, yellow...
let order = "0516273849";
let center = new Point(8000, 4500);

// I now stored the part conditions in an object so I could change
// them in one place instead of going through the ifs and changing numbers
let parts = {};

// Each part with its condition and variables

//HORISNAKE
parts["HORISNAKE"] = () => turn < 50;
let xOff = 0;
let snakeAngle = 0;
let ballAngle = 0;
let ballRadius = 4000;
//LINES
parts["LINES"] = () => turn < 92;
let lineAngle = 0;
//HEART
parts["HEART"] = () => turn < 200;
let heartAngle = 0;
let heartSize = 200;

while (true) {
	//TODO: Read input like you normally would

	//Loops through the busters and coordinates them
	for(let buster of busters){
		// This gets the message for the current buster by accessing
		// the new format I used for the lyrics.

		let batch = lyrics[buster.id];
		let message = "";
		for(let lyric of batch){
			if(turn >= lyric[0] && turn <= lyric[1]){
				message = lyric[2];
				break;
			}
		}

		let id = order.indexOf(buster.id);

		if(parts["HORISNAKE"]()){
			// This is the first part with the Horizontal Snake or sine wave
			// that then turns into a rotating pentagon.

			if(xOff + 1000*id >= 12000){
				let radius = id%2!=0?ballRadius-2000:ballRadius;
				let target = new Point(
						center.x + radius*Math.cos(ballAngle + id*(Math.PI/5)),
						center.y + radius*Math.sin(ballAngle + id*(Math.PI/5))
						);
				target.round();
				print("MOVE", target.x, target.y, message);
			}else{
				let target = new Point(
						xOff + 1000*id,
						4500 + Math.sin(snakeAngle+id)*1000
						);
				target.round();
				print("MOVE", target.x, target.y, message);
			}
		}else if(parts["LINES"]()){
			// This is the part with the two horizontal lines that move up
			// and down while displaying the text I wanted them to say.

			let angle = id%2==0? lineAngle : lineAngle+Math.PI;
			let target = new Point(
					3500 + 1000*id - Math.sin(angle)*500 + (id%2==0?500:-500),
					center.y + Math.cos(angle)*2000
					);
			target.round();
			print("MOVE", target.x, target.y, message);
		}else if(parts["HEART"]()){
			// This last part is the heart where I thank as many people as I
			// could fit in there.

			let t = heartAngle + id*(Math.PI/5);
			let target = new Point(
					center.x + heartSize*(16*Math.pow(Math.sin(t), 3)),
					center.y - heartSize*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))
					);
			target.round();
			print("MOVE", target.x, target.y, message);
		}
	}

	// These conditions are for changing global variables for all the busters.
	// You can see that I change the order variable twice here, it shows how
	// easy it now is to change the order that I want the busters to stand in.
	if(parts["HORISNAKE"]()){
		snakeAngle += 0.2*Math.PI;
		if(turn > 10)
			xOff += 500;
		if(turn > 13)
			ballAngle += 0.1*Math.PI;
	}else if(parts["LINES"]()){
		if(turn > 60)
			lineAngle += 0.1*Math.PI;
	}else if(parts["HEART"]()){
		if(turn==92)order = "2349876501";
		heartAngle += 0.025*Math.PI;
		if(turn>182){
			heartAngle = 0;
			order = "0123498765";
			heartSize = 250;
		}
	}
}
{% endhighlight %}


## Links

[CodeBusters Post](http://husenap.github.io/contests/2016/07/05/CodeBusters/){:.button.lift-3.rippleParent}
[Replay 1](https://www.codingame.com/replay/110180527){:.button.lift-3.rippleParent}
[Replay 2](https://www.codingame.com/replay/111252400){:.button.lift-3.rippleParent}

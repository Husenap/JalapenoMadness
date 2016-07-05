---
layout: default
title: About
permalink: /about/
order: 3
---

{:.page-heading}
# Hello and welcome to my blog!
---

My name is **Hussein Taher**, I'm **<span id="myAge"></span>**, I live in Malmö, Sweden and I love programming.

I started programming late 2013 and I've been programming almost every day ever since.
I used to love game jams because it was a great way for me to meet people, learn new things and develop my skills.
If it wasn't for the people I've met, I might not be where I am today.

## Dreams

For a very long time, my biggest dream was to learn programming, and in the future, get a job at Ubisoft Montpellier because that's where Rayman was born.
Rayman has been my favourite game my entire life and it still is, so I think it would've been amazing to work with it.




<script type="text/javascript">
	function _calculateAge(birthday) { // birthday is a date
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	document.getElementById("myAge").innerText = _calculateAge(new Date("1997-11-02"));
</script>

---
layout: default
title: About
permalink: /about/
order: 3
---

{:.page-heading}
# Hello!
---

My name is **Hussein Taher** and I'm **<span id="myAge"></span>** years old.

I love <button onclick="alert('I LOVE PROGRAMMING!');$('button').replaceWith('programming');">programming</button> and I'm always excited to learn new things!

<script type="text/javascript">
	function _calculateAge(birthday) { // birthday is a date
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	document.getElementById("myAge").innerText = _calculateAge(new Date("1997-11-02"));
</script>

---
layout: default
title: About
permalink: /about/
order: 3
---

Hello!
===
My name is <span class="bold">Hussein Taher</span> and I'm <span id="myAge" class="bold"></span> years old.


<script type="text/javascript">
	function _calculateAge(birthday) { // birthday is a date
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	document.getElementById("myAge").innerText = _calculateAge(new Date("1997-11-02"));
</script>

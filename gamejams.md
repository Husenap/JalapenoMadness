---
layout: default
title: Game Jams
permalink: /gamejams/
order: 2
---

{:.page-heading}
# Game Jams
So far I've participated in {{ site.posts | where:"tag","gamejam" | size }} game jams!
{:.post-meta}
---

<ul class="post-list">

{% for post in site.posts %}{% if post.tags contains "gameJam" %}
	<a class="post-link" href="{{ post.url | prepend: site.baseurl }}">
		<li class="post">
			{{ post.title }}
			<span class="post-meta">&ndash; {{ post.date | date: "%B %-d, %Y" }}</span>
			{% if post.thumb %}
				<img src="{{ post.thumb | prepend: site.baseurl }}">
			{% endif %}
		</li>
	</a>
{% endif %}{% endfor %}

</ul>


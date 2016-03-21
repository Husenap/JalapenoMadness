---
layout: default
title: Posts
permalink: /posts/
order: 0
---

{:.page-heading}
# Posts
---


<ul class="post-list">

{% for post in site.posts %}{% if post.tags contains "post" %}
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

---
layout: blog
---

{% for post in site.posts %}
## {{ post.title }} <span class="post-date">{{ post.date | date: '%B %d, %Y' }}</span>

{{ post.excerpt }}

[Read more...]({{ post.url }})

{% endfor %}


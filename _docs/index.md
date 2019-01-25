---
layout: default
---

# Welcome to the Paella player documentation

The Paella `(pronounced 'paeja')` Player is a HTML5 multistream video player capable of 
playing multiple audio & video streams synchronously and supporting a number of user plugins. 
It is specially designed for lecture recordings, like Opencast Lectures or Polimedia pills.

## Select a version 

{% for p in site.data.docs %}
{% assign docspath = "_docs/" | append: p[1].version | append: "/" | append: p[1].index %}
{% assign page = site.documents | where: "path", docspath | first %}
- [ {{p[1].version}} ]({{page.url | relative_url}})
{% endfor %}

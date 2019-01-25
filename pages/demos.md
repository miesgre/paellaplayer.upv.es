---
layout: page
title: Demos
permalink: /demos/
---
{% assign player_url = '/paella/player-' | append: site.version | append: '/' | relative_url %}

# Demos	

Here you can view some demos of Paella Player. Paella has been tested in recent versions of the major browsers (Chrome, Safari, Firefox, MS Edge, Opera) in recent versions of Windows, macOS and Ubuntu Linux. We also test Paella in recent versions of Android (6.X) and iOS.


### Video examples

* Single video examples

	* [Single stream video 16:9]({{player_url}}?id=single-video)
	
		Just one video from UPV's video repository

	* [Single stream video 4:3]({{player_url}}?id=single-video-43)

		Just one video from UPV's video repository

		
* Dual video examples

	* [Dual video example]({{player_url}}?id=belmar-demo)
	
		A lecture with one video of the teacher, one video captured from the computer screen and a slide carrousel

	* [Dual video example II]({{player_url}}?id=opencast-2015-paella4)	

		Opencast Summit 2015 - Paella player 4 presentation at Harvard University
		
		
* Multi streams video examples

	* [Three video streams / blackboard photos]({{player_url}}?id=jordan-blackboard-3)
	
		This demo has three video streams. The third video is a only-images video (a set of images taken from the blackboard each few seconds)
		
	* [Multi stream video example]({{player_url}}?id=n-stream)
		
		A quad stream example, which can be viewed with different configurations. You can choose between one, two or three simultaneous streams on screen.


* [Multi language audio]({{player_url}}?id=multi-lang-audio)
	
	Single video with two audio tracks: Spanish and English.


### Multi quality video examples

* [Multi quality dual video example]({{player_url}}?id=belmar-multiresolution)
	
	A lecture with one video of the teacher, one video taken form the computer's screen and a carrousel of the slides.
	Each video is available in multiple qualities, so the user can select the video resolution.
	Upon starting, Paella will select the closer resolution to the window size.

* [Paella player 5.1 presentation at Opencast Summit 2017]({{player_url}}?id=opencast-2017-paella5.1)

	This presentation will show the features and future plans of Paella 5.1. 
	


### Captions examples

* [Multi language captions test]({{player_url}}?id=pm-be0c7738-039d-9445-8237-8b85f37cd303)

	One video with captions in several languages and multiple video qualities
		

### Video formats testing

* [HLS video format]({{player_url}}?id=belmar-demo-hls)

	Test of a HLS Stream

	These examples will only work on iOS browsers.
	

* [Mpeg-Dash video format]({{player_url}}?id=mpeg-dash)

	These examples will only work on browsers compatible with Mpeg-Dash and mpeg-4
	

* [FLV video format ]({{player_url}}?id=demo-single-flv)

	Just one FLV video to test that FLV is working (flash component required)

* [Youtube video]({{player_url}}?id=youtube)

	Demo playing two videos (presenter+presentation) from youtube.


### WebGL demos

* [Video 360º: Ricoh Theta S raw stream (720p)]({{player_url}}?id=video360theta)
* [Video 360º: Ricoh Theta S raw stream (720p) single video (compatible with iOS devices)]({{player_url}}?id=video360theta-single)

[//]: <> (	* [Real time chroma with WebGL]({{player_url}}?id=chroma)




### Embed example

{% include paella.html width="900" height="500" id="opencast-2018"%}
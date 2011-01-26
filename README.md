
Sticky
====================
Sticky is a jQuery plugin that allows you to fix elements in place on the screen as the user scrolls.

Usage
--------------------
	// Simple
	$('.selector').sticky();
	
	// Basic Options Defined
	$('.selector').sticky({
		'offset' : 10,
		'mode'   : 'animate'
	});
	
	// All Options Defined
	$('.selector').sticky({
		'offset'			: 20,
		'mode'				: 'fixed',
		'stopper'			: '.stopper',
		'speed'				: .5,
		'classes'			: {
			'element'		: 'jquery-sticky-element',
			'start'			: 'jquery-sticky-start',
			'sticky'		: 'jquery-sticky-sticky',
			'stopped'		: 'jquery-sticky-stopped',
			'placeholder'	: 'jquery-sticky-placeholder'
		},
		
		'onStart'			: function(){
			
		},
		'onStick'			: function(){
			
		},
		'onStop'			: function(){
			
		}
	});

Options
--------------------
###offset
The offset is the distance in pixels that the sticky element sits from the top of the window when in it's 
sticky state. The default offset value is `20`.

###mode
There are two different modes you can use Sticky in, `fixed` and `animate`. In the `fixed` mode, the sticky 
element will remain attached to the window at the defined offset as the user scrolls. In `animate` mode, 
the element will animate up or down to the position where the user stops scrolling. By default, Sticky uses 
the `fixed` mode.

*Note: Internet Explorer currently only supports the `animate` mode. If `fixed` is defined, all versions of IE will still use `animate`.*

###stopper
The stopper option accepts a selector to be used as a stopping point for the sticky element. When the sticky 
element reaches the stopper it will no longer scroll down the screen. By default, no stopper is defined.

###speed
The speed in seconds an element should take to animate to its new position once the user stops scrolling.

###classes
Sticky uses several classes to determine the state of the element and its placeholder. By default these classes
are given a lengthy namespace so they are less likely to conflict with your existing styles. These classes can
be changed to anything you'd like, but be advised that you may experience unintended consequences if you use
class names already present in your CSS or elsewhere in your HTML.

	...
	'classes'			: {
		'element'		: 'jquery-sticky-element',
		'start'			: 'jquery-sticky-start',
		'sticky'		: 'jquery-sticky-sticky',
		'stopped'		: 'jquery-sticky-stopped',
		'placeholder'	: 'jquery-sticky-placeholder'
	},
	...

Callback Functions
--------------------
Sticky accepts three callback functions.

	$('.selector').sticky({
		'onStart'	: function(){
			// Called when the element reaches it's starting position
		},
		'onStick'	: function(){
			// Called when the element becomes sticky
		},
		'onStop'	: function(){
			// Called when the element reaches it's stopping position
		}
	});
	
###onStart
The onStart callback is called when the script is initiated as well as when the element returns to its starting position
	
###onStick
The onStick function is called only when an element becomes sticky (not while it retains its sticky state). This event occurs when the element leaves its starting position, or when it moves away from a stopping position.
	
###onStop
If a stopper is defined, the onStop function is called when the element reaches its stopping position.

Examples
--------------------
* [HealthTree.com](http://www.healthtree.com/news/) – Sidebar Navigation


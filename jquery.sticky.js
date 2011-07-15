/**
 * Sticky
 * 
 * Keep interface elements fixed in place as the user scrolls.
 * 
 * Copyright (c) 2011 Kevin Thompson <http://kevinthompson.info>
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @author:   Kevin Thompson <kevin@kevinthompson.info>
 * @version:  1.0
**/ 

(function ($) {
	$.fn.sticky = function (options ) {
		
		var settings = {
		  
		  // Basic Settings
			'offset'			: 20,
			'mode'				: 'fixed',
			'stopper'			: '',
			'speed'				: 500,
			
			// State Classes
			'classes'			: {
				'element'		  : 'jquery-sticky-element',
				'start'			  : 'jquery-sticky-start',
				'sticky'		  : 'jquery-sticky-sticky',
				'stopped'		  : 'jquery-sticky-stopped',
				'placeholder'	: 'jquery-sticky-placeholder'
			},
			
			// Events
			'onStick'       : '', // When the element becomes sticky
			'onStart'       : '', // When the element returns to the start
			'onStop'        : ''  // When the element hits a stopper
			
		};
		
		this.each(function () {
			
			if (options) { 
        $.extend(settings,options);
			}
			
			if ($(this).parent().hasClass(settings.classes.element)) {
			  return;
			}
			
			var $document = $(document);
			var $window = $(window);
			
			var sticky = {
			
				'init'		: function ($this) {
					
					// Instantiate Element and Assign Basic Class
					settings.mode	  = ($.browser.msie && settings.mode == 'fixed' ? settings.mode = 'animate' : settings.mode);
					
					// Wrap Selected Element
					$this.wrap('<div class="' + settings.classes.element + '" />');
					sticky.element  = $this.parent();
					
					// Set Base Units
					sticky.units = {
						'start'		: sticky.element.offset().top
					};
					
					// Find Stopper
					if(settings.stopper != '') {
					  var stoppers    = $(settings.stopper);
					  if( stoppers.length > 0 ){
					    var i = 0;
  					  while(i < stoppers.length && typeof(sticky.stopper) == 'undefined'){
  					    if( $(stoppers[i]).offset().top > sticky.element.offset().top + sticky.element.outerHeight() ){
  						    sticky.stopper = $(stoppers[i]);
  					    }
  					    i++;
  					  }
					  }
					
						// Update Stop Position
						if(typeof(sticky.stopper) != 'undefined' && sticky.stopper.length > 0) {
							var margin = (parseInt(sticky.stopper.css('margin-top')) != undefined ? parseInt(sticky.stopper.css('margin-top')) : 0);
							sticky.units.stop = sticky.stopper.offset().top - margin;
						}
					}
					
					// Create Placeholder
					sticky.placeholder = sticky.element.clone().empty().attr('class',settings.classes.placeholder).css({
						'opacity'			: 0,
						'height'			: sticky.element.height()
					}).insertAfter(sticky.element);
					
					// Move Sticky Element
					sticky.element
						.appendTo('body')
						.css({
							'width'			    : sticky.placeholder.width(),
							'left'			    : sticky.placeholder.offset().left,
							'top'			      : sticky.placeholder.offset().top,
							'margin-bottom'	: '0px',
							'position'		  : 'absolute',
							'z-index'		    : '999'
						});
					
					// Bind Events
					$window.bind('resize scroll', function () {
						sticky.update();
					});
					sticky.update();
				},
			
				'update'	: function () {

					// Update Sticky Element CSS
					sticky.element.css({
						'width'	: sticky.placeholder.width(),
						'left'	: sticky.placeholder.offset().left
					});
					sticky.placeholder.css('height',sticky.element.height());
				  
					if((sticky.element.outerHeight() + settings.offset) < $window.height()) {
						
						// Get Window Top
						sticky.units.doctop = $document.scrollTop();
					
						// Update Animated Position
						if(sticky.element.hasClass(settings.classes.sticky) && settings.mode == 'animate') {
							sticky.animate(sticky.units.doctop + settings.offset);
						}
					
						// Update Stop Position
						if(typeof(sticky.stopper) != 'undefined' && sticky.stopper.length > 0) {
							var margin = (parseInt(sticky.stopper.css('margin-top')) != undefined ? parseInt(sticky.stopper.css('margin-top')) : 0);
							sticky.units.stop = sticky.stopper.offset().top - margin;
						}
						
						// Stop at stopper
						if (
						  ! sticky.element.hasClass(settings.classes.stopped) 
						  && typeof(sticky.stopper) != 'undefined' 
						  && sticky.stopper.length > 0 
						  && (sticky.units.doctop + settings.offset + sticky.element.outerHeight()) >= sticky.units.stop
						) {
							sticky.stop(sticky.units.stop - sticky.element.outerHeight(),'stop');

						  if (typeof settings.onStop == 'function') {
						    settings.onStop();
						  }
							
						// Update Position
						} 
						else if (
						  ! sticky.element.hasClass(settings.classes.sticky) 
						  && sticky.units.doctop > (sticky.units.start - settings.offset)
						  && (typeof(sticky.stopper) == 'undefined' || sticky.stopper.length == 0 || (sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset + sticky.element.outerHeight()) < sticky.units.stop))
						) {
							sticky.stick(settings.offset);
							
							if(settings.mode == 'animate') sticky.animate(sticky.units.doctop + settings.offset);

						  if (typeof settings.onStick == 'function') {
						    settings.onStick();
						  }
						
						// Stop at starting position
						} 
						else if (
						  !sticky.element.hasClass(settings.classes.start) && 
						  sticky.units.doctop <= (sticky.units.start - settings.offset)
						) {
							sticky.stop(sticky.units.start,'start');

							if (typeof settings.onStart == 'function') {
						    settings.onStart();
					    }
						}
						
					}else{
						
						// Reset to Start
						if(!sticky.element.hasClass(settings.classes.start)) {
							sticky.stop(sticky.units.start,'start');	
						}
					}
				},
				
				'animate'	: function (top) {
					clearTimeout(sticky.timer);
					sticky.timer = setTimeout(function () {
						if(top >= sticky.units.stop) {
							top = sticky.units.stop - sticky.element.outerHeight();
						}else if(top <= sticky.units.start) {
							top = sticky.units.start;
						}
						sticky.element.stop().animate({
							'top' : top
						},settings.speed);
					},100);
				},
				
				'stick'		: function (top) {
					sticky.element
						.removeClass(settings.classes.start)
						.removeClass(settings.classes.stopped)
						.addClass(settings.classes.sticky);
					
					if(settings.mode == 'fixed') {
						sticky.element.css({
							'top'		: top,
							'position'	: 'fixed'
						});
					}
				},
			
				'stop'	: function (top,location) {
					var oldClass = (location == 'start'	? settings.classes.stopped : settings.classes.start);
					var newClass = (location == 'stop'	? settings.classes.stopped : settings.classes.start);
					
					sticky.element
						.removeClass(settings.classes.sticky)
						.removeClass(oldClass)
						.addClass(newClass);
						
					if(settings.mode == 'fixed') {
						sticky.element.css({
							'top'		: top,
							'position'	: 'absolute'
						});
					}else{
						sticky.animate(location == 'start' ? sticky.units.start : sticky.units.stop - sticky.element.outerHeight());
					}
				}
			}
			
			sticky.init($(this));
		});
	};
})(jQuery);
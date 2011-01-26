

// Sticky – Keeps elements fixed as the user scrolls.
(function($){
	$.fn.sticky = function( options, stick, start, stop ){
		
		var settings = {
			'offset'			: 20,
			'mode'				: 'animate',
			'stopper'			: '',
			'speed'				: 500,
			'classes'			: {
				'start'			: 'start',
				'sticky'		: 'sticky',
				'stopped'		: 'stopped',
				'placeholder'	: 'placeholder',
			}
		};
		
		this.each(function() {
			
			if (options) { 
		    	$.extend(settings,options);
			}
			
			var $document = $(document);
			var $window = $(window);
			
			var sticky = {
			
				'init'		: function($this){
					
					sticky.element = $this;
					
					// Set Base Units
					sticky.units = {
						'height'	: sticky.element.outerHeight(),
						'start'		: sticky.element.offset().top - settings.offset
					};
					
					// Find Stopper
					if(settings.stopper != ''){
						var stoppers		= $(settings.stopper).not('.' + settings.classes.placeholder);
						sticky.stopper		= sticky.element.is(settings.stopper) ? stoppers.filter(':gt(' + stoppers.index(sticky.element) + ')').first() : stoppers.first();
					}
					
					// Create Placeholder
					sticky.placeholder = sticky.element.clone().empty().addClass(settings.classes.placeholder).css({
						'opacity'	: 0,
						'height'	: sticky.element.outerHeight()
					}).insertAfter(sticky.element);
					
					// Move Sticky Element
					sticky.element
						.appendTo('body')
						.css({
							'width'		: sticky.placeholder.width(),
							'margin'	: 0,
							'left'		: sticky.placeholder.offset().left,
							'top'		: sticky.placeholder.offset().top,
							'position'	: 'absolute',
							'z-index'	: '999'
						});
					
					// Bind Events
					$window.bind('resize scroll', function(){
						sticky.update();
					});
					sticky.update();
				},
			
				'update'	: function(){

					// Update Sticky Element CSS
					sticky.element.css({
						'width'	: sticky.placeholder.width(),
						'left'	: sticky.placeholder.offset().left
					});
					sticky.placeholder.css('height',sticky.element.outerHeight());
				
					if((sticky.element.outerHeight() + settings.offset) < $window.height()){
						
						// Get Window Top
						sticky.units.doctop = $document.scrollTop();
					
						// Update Stop Position
						if(sticky.stopper.length > 0){
							sticky.units.stop = sticky.stopper.offset().top - (sticky.element.outerHeight() - settings.offset + 1);	
						}
					
						// Update Animated Position
						if(sticky.element.hasClass(settings.classes.sticky) && ($.browser.msie || settings.mode == 'animate')){
							sticky.animate(sticky.units.doctop + settings.offset);
						}
						
						// Stop at stopper
						if (!sticky.element.hasClass(settings.classes.stopped) && sticky.stopper.length > 0 && sticky.element.offset().top > sticky.units.stop) {
							sticky.stop(sticky.units.stop,'stop');

							if (typeof stick == 'function') {
						        stick.call(this);
						    }
							
						// Update Position
						} else if (!sticky.element.hasClass(settings.classes.sticky) && sticky.units.doctop >= sticky.units.start && (sticky.stopper.length == 0 || (sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset) < sticky.units.stop))){
							sticky.stick(settings.offset);

							if (typeof stick == 'function') {
						        stick.call(this);
						    }
						
						// Stop at starting position
						} else if (!sticky.element.hasClass(settings.classes.start) && sticky.units.doctop < sticky.units.start) {
							sticky.stop(sticky.placeholder.offset().top,'start');

							if (typeof start == 'function') {
						        start.call(this);
						    }
						}
						
					}else{
						
						// Reset to Start
						if(!sticky.element.hasClass(settings.classes.start)){
							sticky.stop(sticky.placeholder.offset().top,'start');	
						}
					}
				},
				
				'animate'	: function(top){
					clearTimeout(sticky.timer);
					sticky.timer = setTimeout(function(){
						if(top >= sticky.units.stop){
							top = ($.browser.msie ? sticky.units.stop - settings.offset : sticky.units.stop);
						}else if(top <= sticky.placeholder.offset().top){
							top = sticky.placeholder.offset().top;
						}
						sticky.element.stop().animate({
							'top' : top
						},settings.speed);
					},100);
				},
				
				'stick'		: function(top){
					sticky.element
						.removeClass(settings.classes.start)
						.removeClass(settings.classes.stopped)
						.addClass(settings.classes.sticky);
					
					if(!$.browser.msie && settings.mode == 'fixed'){
						sticky.element.css({
							'top'		: top,
							'position'	: 'fixed'
						});
					}
				},
			
				'stop'	: function(top,location){
					var oldClass = (location == 'start'	? settings.classes.stopped : settings.classes.start);
					var newClass = (location == 'stop'	? settings.classes.stopped : settings.classes.start);
					
					sticky.element
						.removeClass(settings.classes.sticky)
						.removeClass(oldClass)
						.addClass(newClass);
						
					if(!$.browser.msie && settings.mode == 'fixed'){
						sticky.element.css({
							'top'		: top,
							'position'	: 'absolute'
						});
					}else{
						sticky.animate(location == 'start' ? sticky.placeholder.offset().top : sticky.units.stop);
					}
				}
			}
			
			sticky.init($(this));
		});
	};
})(jQuery);
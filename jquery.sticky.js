

// Sticky – Keeps elements fixed as the user scrolls.
(function($){
	$.fn.sticky = function( options, stick, start, stop ){
		
		var settings = {
			'offset'			: 20,
			'mode'				: 'animate',
			'stopper'			: '',
			'speed'				: 500,
			'classes'			: {
				'element'		: 'jquery-sticky-element',
				'start'			: 'jquery-sticky-start',
				'sticky'		: 'jquery-sticky-sticky',
				'stopped'		: 'jquery-sticky-stopped',
				'placeholder'	: 'jquery-sticky-placeholder'
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
					
					sticky.element	= $this.addClass(settings.classes.element);
					settings.mode	= ($.browser.msie && settings.mode == 'fixed' ? settings.mode = 'animate' : settings.mode);
					
					// Create Placeholder
					sticky.placeholder = sticky.element.clone().empty().addClass(settings.classes.placeholder).css({
						'opacity'			: 0,
						'height'			: sticky.element.height()
					}).insertAfter(sticky.element);
					
					// Move Sticky Element
					sticky.element
						.appendTo('body')
						.css({
							'width'			: sticky.placeholder.width(),
							'left'			: sticky.placeholder.offset().left,
							'top'			: sticky.placeholder.offset().top,
							'margin-bottom'	: '0px',
							'position'		: 'absolute'
						});
					
					// Set Base Units
					sticky.units = {
						'start'		: sticky.placeholder.offset().top
					};
					
					// Find Stopper
					if(settings.stopper != ''){
						var stoppers		= $(settings.stopper).not('.' + settings.classes.placeholder);
						sticky.stopper		= sticky.element.is(settings.stopper) ? stoppers.filter(':gt(' + stoppers.index(sticky.element) + ')').first() : stoppers.first();
					
						// Update Stop Position
						if(sticky.stopper.length > 0){
							var margin = (parseInt(sticky.stopper.css('margin-top')) != undefined ? parseInt(sticky.stopper.css('margin-top')) : 0);
							sticky.units.stop = sticky.stopper.offset().top - margin;
						}
					}
					
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
					sticky.placeholder.css('height',sticky.element.height());
				
					if((sticky.element.outerHeight() + settings.offset) < $window.height()){
						
						// Get Window Top
						sticky.units.doctop = $document.scrollTop();
					
						// Update Animated Position
						if(sticky.element.hasClass(settings.classes.sticky) && settings.mode == 'animate'){
							sticky.animate(sticky.units.doctop + settings.offset);
						}
						
						// Stop at stopper
						if (!sticky.element.hasClass(settings.classes.stopped) && sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset + sticky.element.outerHeight()) >= sticky.units.stop) {
							sticky.stop(sticky.units.stop - sticky.element.outerHeight(),'stop');

							if (typeof stick == 'function') {
						        stick.call(this);
						    }
							
						// Update Position
						} else if (!sticky.element.hasClass(settings.classes.sticky) && sticky.units.doctop > (sticky.units.start - settings.offset) && (sticky.stopper.length == 0 || (sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset + sticky.element.outerHeight()) < sticky.units.stop))){
							sticky.stick(settings.offset);
							sticky.animate(sticky.units.doctop + settings.offset);

							if (typeof stick == 'function') {
						        stick.call(this);
						    }
						
						// Stop at starting position
						} else if (!sticky.element.hasClass(settings.classes.start) && sticky.units.doctop <= (sticky.units.start - settings.offset)) {
							sticky.stop(sticky.units.start,'start');

							if (typeof start == 'function') {
						        start.call(this);
						    }
						}
						
					}else{
						
						// Reset to Start
						if(!sticky.element.hasClass(settings.classes.start)){
							sticky.stop(sticky.units.start,'start');	
						}
					}
				},
				
				'animate'	: function(top){
					clearTimeout(sticky.timer);
					sticky.timer = setTimeout(function(){
						if(top >= sticky.units.stop){
							top = sticky.units.stop - sticky.element.outerHeight();
						}else if(top <= sticky.units.start){
							top = sticky.units.start;
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
					
					if(settings.mode == 'fixed'){
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
						
					if(!settings.mode == 'fixed'){
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
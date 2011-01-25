

// Sticky – Keeps elements fixed as the user scrolls.
(function($){
	$.fn.sticky = function( options ){
		
		var settings = {
			'offset'			: 20,
			'placeholder'		: true,
			'stopper'			: '',
			'speed'				: 500,
			'classes'			: {
				'sticky'		: 'sticky',
				'stopped'		: 'stopped',
				'placeholder'	: 'placeholder',
				'disabled'		: 'disabled'
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
					
					var stoppers   = $(settings.stopper).not('.' + settings.classes.placeholder);
					sticky.stopper = sticky.element.is(settings.stopper) ? stoppers.filter(':gt(' + stoppers.index(sticky.element) + ')').first() : stoppers.first();
					
					var marginTop		= parseInt(sticky.element.css('margin-top')) || 0;
					var marginBottom	= parseInt(sticky.element.css('margin-bottom')) || 0
					
					sticky.units = {
						'top'		: settings.offset - marginTop,
						'height'	: sticky.element.outerHeight() + marginTop + marginBottom,
						'origin'	: sticky.element.offset().top - settings.offset
					};
					
					sticky.enable();
					$window.bind('resize scroll', function(){
						sticky.update();
					});
				},
			
				'update'	: function(){
					if(settings.placeholder && sticky.placeholder.css('display') != 'none'){
						sticky.element.width(sticky.placeholder.width());
					}
				
					if((sticky.element.outerHeight() + settings.offset) < $window.height()){
						
						// Enable Sticky Behavior
						if(sticky.status == 'disabled') sticky.enable();
						
						sticky.units.doctop = $document.scrollTop();
						
						sticky.units.bottom = parseInt(sticky.units.top + sticky.units.doctop + sticky.units.height);
						if (sticky.stopper.length > 0) {
							sticky.units.stopper = sticky.stopper.offset().top - parseInt(sticky.stopper.css('marginTop'));
						}
						
						// Update Position In IE						
						if($.browser.msie && sticky.status == 'sticky'){
							sticky.animate(sticky.units.doctop + settings.offset);
						}
						
						if (sticky.status != 'stopped' && sticky.stopper.length > 0 && sticky.units.bottom >= sticky.units.stopper) {
							// Stop at stopper
							sticky.stop(sticky.units.stopper - sticky.element.outerHeight(),'stopper');
						} else if (sticky.status != 'sticky' && sticky.units.doctop >= sticky.units.origin && (sticky.stopper.length == 0 || (sticky.stopper.length > 0 && sticky.units.bottom < sticky.units.stopper))){
							// Stick if below original position
							sticky.stick(sticky.units.top);
						} else if (sticky.status != 'stopped' && sticky.units.doctop < sticky.units.origin) {
							// Stop at original position
							sticky.stop('auto','origin');
						}
					}else{
						// Disable Sticky Behavior
						if(sticky.status != 'disabled') sticky.disable();
					}
				},
				
				'enable' : function(){
					sticky.status = 'enabled';
					if(settings.placeholder){
						sticky.placeholder = sticky.element.clone().addClass(settings.classes.placeholder).css({
							'visibility': 'hidden'
						}).insertAfter(sticky.element);
					}
					sticky.element.css({
						'width'	: sticky.element.width(),
						'margin-bottom' : 0
					});
					if($.browser.msie) sticky.element.css({
						'position'	:	'absolute',
						'top'		:	sticky.units.origin + settings.offset
					});
					sticky.stop('auto','origin');
				},
				
				'stick'	: function(top){
					sticky.status = 'sticky';
					if(settings.placeholder) sticky.placeholder.css('display','block');
					
					sticky.element
						.removeClass(settings.classes.stopped)
						.addClass(settings.classes.sticky);
					if($.browser.msie){
						sticky.animate(sticky.units.doctop + settings.offset);
						sticky.element.css({
							'position'	:	'absolute',
							'z-index'	:	'999',
							'clear'		:	'both'
						});
					}else{
						sticky.element.css({
							'top'		:	top,
							'position'	:	'fixed',
							'z-index'	:	'999'
						});
					}
				},
				
				'animate'	: function(top){
					sticky.element.stop();
					if(top < (sticky.units.origin + settings.offset)){
						sticky.disable();
					}else{
						if(sticky.stopper.length > 0 && (top + sticky.units.height + settings.offset) > sticky.units.stopper){
							top = sticky.units.stopper - (sticky.units.height - settings.offset);
						}
						sticky.element.animate({
							'top'	:	top
						},settings.speed);	
					}
				},
			
				'stop'	: function(top,location){
					sticky.status = location == 'origin' ? 'origin' : 'stopped';
					sticky.element
						.removeClass(settings.classes.sticky)
						.addClass(settings.classes.stopped);
					if(!$.browser.msie){
						sticky.element.css({
							'top'		:	top,
							'position'	:	'absolute',
							'z-index'	:	'auto'
						});
					}
				},
			
				'disable'	: function(){
					sticky.status = 'disabled';
					sticky.element
						.removeClass(settings.classes.sticky)
						.removeClass(settings.classes.stopped);
						
					if($.browser.msie){
						sticky.element.animate({
							'top'	:	sticky.units.origin + settings.offset
						},settings.speed);
					}else{
						sticky.element.removeAttr("style");
					}
				},
				
				'status'		: 'disabled'
			}
			
			sticky.init($(this));
		});
	};
})(jQuery);


// Sticky – Keeps elements fixed as the user scrolls.
(function($){
	$.fn.sticky = function( options ){
		
		var settings = {
			'offset'			: 20,
			'placeholder'		: true,
			'classes'			: {
				'sticky'		: 'sticky',
				'static'		: 'static',
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
					
					var stoppers   = $(settings.stopper).not('.' + settings.classes.placeholder);
					sticky.stopper = stoppers.filter(':gt(' + stoppers.index(sticky.element) + ')').first() || $(sticky.element.attr('data-stopper'));
					log(stoppers.filter(':gt(' + stoppers.index(sticky.element) + ')').first());
					
					if(settings.placeholder){
						sticky.placeholder = sticky.element.clone().addClass(settings.classes.placeholder).css({
							'visibility':'hidden'
						}).insertAfter(sticky.element);
					}
					sticky.element.css({
						'width'	: sticky.element.width()
					}).addClass(settings.classes.static);
					sticky.units = {
						'top'		: settings.offset - parseInt(sticky.element.css('marginTop')),
						'height'	: sticky.element.outerHeight() + parseInt(sticky.element.css('marginTop')) + parseInt(sticky.element.css('marginBottom')),
						'origin'	: sticky.element.offset().top - settings.offset
					};
					
					sticky.update();
					$window.bind('resize', function(){
						sticky.update();
					});
					$document.bind('scroll', function () {
						sticky.update();
					});
				},
			
				'update'	: function(){
					if(settings.placeholder){
						sticky.element.width(sticky.placeholder.width());
					}
					
					sticky.units.doctop = $document.scrollTop();
				
					if(sticky.element.outerHeight() < $window.height()){
						sticky.units.bottom = sticky.units.top + sticky.units.doctop + sticky.units.height;
						if (sticky.stopper.length > 0) {
							sticky.units.stopper = sticky.stopper.offset().top - parseInt(sticky.stopper.css('marginTop'));
						}
						if (sticky.stopper.length > 0 && sticky.units.bottom > sticky.units.stopper) {
							sticky.enable(sticky.units.top - (sticky.units.bottom - sticky.units.stopper));
						} else if (sticky.units.doctop > sticky.units.origin){
							sticky.enable();
						} else if ((sticky.units.doctop <= sticky.units.origin) && sticky.element.hasClass(settings.classes.sticky)) {
							sticky.disable();
						}
					}
				},
				
				'enable'	: function(top){
					top = top || sticky.units.top;
					sticky.element
						.removeClass(settings.classes.static)
						.addClass(settings.classes.sticky)
						.css({
							'top'		:	top,
							'position'	:	'fixed',
							'z-index'	:	'999'
						});
				},
			
				'disable'	: function(){
					sticky.element
						.removeClass(settings.classes.sticky)
						.addClass(settings.classes.static)
						.css({
							'top'		:	'auto',
							'position'	:	'absolute',
							'z-index'	:	'auto'
						});
				}
			}
			
			sticky.init($(this));
		});
	};
})(jQuery);
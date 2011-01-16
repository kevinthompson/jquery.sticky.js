

// Sticky – Keeps elements fixed as the user scrolls.
(function($){
	$.fn.sticky = function( options ){
		
		var settings = {
			'offset'			: 20,
			'placeholder'		: true,
			'classes'			: {
				'fixed'			: 'fixed',
				'absolute'		: 'absolute',
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
			
					if(settings.placeholder){
						sticky.placeholder = sticky.element.clone().addClass(settings.classes.placeholder).css({
							'visibility':'hidden'
						}).insertAfter(sticky.element);
					}
					sticky.element.css({
						'width'	: sticky.element.width()
					}).addClass(settings.classes.absolute);
					sticky.stopper = $(settings.stopper) || $(sticky.element.attr('data-stopper'))
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
						} else if ((sticky.units.doctop <= sticky.units.origin) && sticky.element.hasClass(settings.classes.fixed)) {
							sticky.disable();
						}
					}
				},
				
				'enable'	: function(top){
					top = top || sticky.units.top;
					sticky.element
						.removeClass(settings.classes.absolute)
						.addClass(settings.classes.fixed)
						.css('top',top);
				},
			
				'disable'	: function(){
					sticky.element
						.removeClass(settings.classes.fixed)
						.addClass(settings.classes.absolute)
						.css('top','auto');
				}
			}
			
			sticky.init($(this));
		});
	};
})(jQuery);
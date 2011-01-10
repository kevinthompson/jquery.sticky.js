(function($){
	$.fn.sticky = function( options ){
		
		var settings = {
			'offset'			:	20,
			'fixedClass'		:	'fixed',
			'absoluteClass'		:	'absolute',
			'placeholderClass'	:	'placeholder',
			'useClass'			:	true
		};
		
		this.each(function() {
			if (options) { 
		    	$.extend(settings,options);
			}
			
			var $stopper = $(settings.stopper);
			var hasStopper = $stopper.length > 0 ? true : false;
			var $sticky = $(this).css({
				'width'	: $(this).width()
			}).addClass(settings.absoluteClass);		
			
			var top = settings.offset - parseInt($(this).css('marginTop'));
			var stickyHeight = $sticky.outerHeight();
			var totalHeight = stickyHeight + parseInt($sticky.css('marginTop')) + parseInt($sticky.css('marginBottom'));
			var $placeholder = $('<div class="' + settings.placeholderClass + '">').css({
				'height': 1
			}).insertAfter($sticky);
			var $view = $(document);
			var originalStickyTop = $sticky.offset().top - settings.offset;

			var updatePosition = function(){
				var viewTop = $view.scrollTop();
				var bottomPosition = viewTop + top + totalHeight;
				if (hasStopper) {
					var stopperPosition = $stopper.offset().top - parseInt($stopper.css('marginTop'));
					if (bottomPosition > stopperPosition) {
						$sticky.removeClass(settings.absoluteClass).addClass(settings.fixedClass).css('top', top - (bottomPosition - stopperPosition));
					}
				}
				
				if (viewTop > originalStickyTop){
					$sticky.removeClass(settings.absoluteClass).addClass(settings.fixedClass).css('top',top);
				} else if ((viewTop <= originalStickyTop) && $sticky.hasClass(settings.fixedClass)) {
					$sticky.removeClass(settings.fixedClass).addClass(settings.absoluteClass).css('top','auto');
				}
			}

			updatePosition();
			$view.bind("scroll resize", function () {
				updatePosition();
			});
		});
	};
})(jQuery);
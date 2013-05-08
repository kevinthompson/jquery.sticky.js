/**
 * Sticky
 *
 * Keep interface elements fixed in place as the user scrolls.
 *
 * Copyright (c) 2013 Kevin Thompson <http://kevinthompson.info>
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @author:   Kevin Thompson <kevin@kevinthompson.info>
 * @link:     https://github.com/kevinthompson/jquery.sticky.js
 * @version:  2.0.0
 **/

;
(function($) {
  $.fn.sticky = function(options) {

    var settings = {

      // Basic Settings
      'offset': 20,
      'mode': 'fixed',
      'stopper': '',
      'speed': 500,

      // State Classes
      'classes': {
        'element': 'jquery-sticky-element',
        'start': 'jquery-sticky-start',
        'sticky': 'jquery-sticky-sticky',
        'stopped': 'jquery-sticky-stopped',
        'placeholder': 'jquery-sticky-placeholder'
      },

      // Events
      'onStick': '', // When the element becomes sticky
      'onStart': '', // When the element returns to the start
      'onStop': '' // When the element hits a stopper
    };

    this.each(function() {

      if (options) $.extend(settings, options);
      if ($(this).parent().hasClass(settings.classes.element)) return;

      var sticky = {

        'init': function($this) {

          // Define Sticky Element and Units (Force Animate Mode in Internet Explorer)
          sticky.element = $this.wrap('<div class="' + settings.classes.element + '" />').parent();
          sticky.units = {
            'start': sticky.element.offset().top
          };
          settings.states = [
            settings.classes.start,
            settings.classes.sticky,
            settings.classes.stopped
          ].join(' ');

          // Find Stopper
          if (settings.stopper != '') {
            var stoppers = $(settings.stopper),
              margin;
            if (stoppers.length > 0) {
              for (i = 0; i < stoppers.length && typeof(sticky.stopper) == 'undefined'; i++) {
                if ($(stoppers[i]).offset().top > sticky.element.offset().top + sticky.element.outerHeight(false)) {
                  sticky.stopper = $(stoppers[i]);
                }
              }
            }

            // Update Stop Position
            if (typeof(sticky.stopper) != 'undefined' && sticky.stopper.length > 0) {
              margin = parseInt(sticky.stopper.css('margin-top')) || 0;
              sticky.units.stop = sticky.stopper.offset().top - margin;
            }
          }

          // Create Placeholder
          sticky.placeholder = sticky.element.clone().empty().attr('class', settings.classes.placeholder).css({
            'opacity': 0,
            'height': sticky.element.height()
          }).insertBefore(sticky.element);

          // Move Sticky Element
          sticky.element.appendTo('body').css({
            'width': sticky.placeholder.width(),
            'left': sticky.placeholder.offset().left,
            'top': sticky.placeholder.offset().top,
            'margin-bottom': '0px',
            'position': 'absolute',
            'z-index': '999'
          });

          // Bind Events
          $(window).bind('resize scroll', function() {
            sticky.update();
          });
          sticky.update();
        },

        'update': function() {

          var margin;

          // Update Sticky Element CSS
          sticky.element.css({
            'width': sticky.placeholder.width(),
            'left': sticky.placeholder.offset().left
          });
          sticky.placeholder.css('height', sticky.element.height());
          sticky.units.start = sticky.placeholder.offset().top;

          if ((sticky.element.outerHeight(false) + settings.offset) < $(window).height()) {

            // Get Window Top
            sticky.units.doctop = $(document).scrollTop();

            // Update Animated Position
            if (sticky.element.hasClass(settings.classes.sticky) && settings.mode == 'animate') {
              sticky.animate(sticky.units.doctop + settings.offset);
            }

            // Update Stop Position
            if (typeof(sticky.stopper) != 'undefined' && sticky.stopper.length > 0) {
              margin = parseInt(sticky.stopper.css('margin-top')) || 0;
              sticky.units.stop = sticky.stopper.offset().top - margin;
            }

            // Stop at Stopper
            if (!sticky.element.hasClass(settings.classes.stopped) && typeof(sticky.stopper) != 'undefined' && sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset + sticky.element.outerHeight(false)) >= sticky.units.stop) {
              // Stop
              sticky.stop(sticky.units.stop - sticky.element.outerHeight(false), 'stop');

              // Trigger `onStop` Callback
              if (typeof settings.onStop == 'function') settings.onStop();
            }

            // Update Position
            else if (!sticky.element.hasClass(settings.classes.sticky) && sticky.units.doctop > (sticky.units.start - settings.offset) && (typeof(sticky.stopper) == 'undefined' || sticky.stopper.length == 0 || (sticky.stopper.length > 0 && (sticky.units.doctop + settings.offset + sticky.element.outerHeight(false)) < sticky.units.stop))) {

              // Stick or Animate
              sticky.stick(settings.offset);
              if (settings.mode == 'animate') sticky.animate(sticky.units.doctop + settings.offset);

              // Trigger `onStick` Callback
              if (typeof settings.onStick == 'function') settings.onStick();

              // Stop at starting position
            } else if (sticky.units.doctop <= (sticky.units.start - settings.offset)) {
              sticky.stop(sticky.units.start, 'start');

              // Trigger `onStart` Callback
              if (typeof settings.onStart == 'function') settings.onStart();
            }

            // Reset to Start
          } else if (!sticky.element.hasClass(settings.classes.start)) {
            sticky.stop(sticky.units.start, 'start');
          }
        },

        'animate': function(top) {
          clearTimeout(sticky.timer);
          sticky.timer = setTimeout(function() {
            if (top >= sticky.units.stop) {
              top = sticky.units.stop - sticky.element.outerHeight(false);
            } else if (top <= sticky.units.start) {
              top = sticky.units.start;
            }
            sticky.element.stop().animate({
              'top': top
            }, settings.speed);
          }, 100);
        },

        'stick': function(top) {
          sticky.element.removeClass(settings.states).addClass(settings.classes.sticky);

          if (settings.mode == 'fixed') {
            sticky.element.css({
              'top': top,
              'position': 'fixed'
            });
          }
        },

        'stop': function(top, location) {
          sticky.element.removeClass(settings.states).addClass(location == 'start' ? settings.classes.start : settings.classes.stopped);

          if (settings.mode == 'fixed') {
            sticky.element.css({
              'top': top,
              'position': 'absolute'
            });
          } else {
            sticky.animate(location == 'start' ? sticky.units.start : sticky.units.stop - sticky.element.outerHeight(false));
          }
        }
      }

      // Initialize Sticky Behavior
      sticky.init($(this));
    });
  };
})(jQuery);
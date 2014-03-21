(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {
			
			var s = settings;

			$( this ).addClass( 'slider_captcha' ).width( s.width ).append(
				$( '<span>' ).css( 'font-size', s.hinttext_size ).text( s.hinttext )).append( 
				$( '<div>' ).addClass( 'swipe-knob ui-draggable' ) ).append( 
				$( '<div>' ).addClass( 'knob-destiny' ));

			$( this ).find( '.swipe-knob' ).draggable({
				containment: "parent", 
				scrollSpeed: 70,
				axis: 'x',
				cursor: 'move',
				revert: 'invalid',
				zIndex: '1'
			});

			$( this ).find( '.knob-destiny' ).droppable({
				acccept: '.swipe-handle',
				tolerance: 'intersect',
				drop: function(event, ui) {
					$( this ).droppable( "option", "disabled", true );
					$( ui.draggable ).addClass( 'swipe_ended' ).css( 'left', 'auto' ).draggable({disabled: true});
				}
			})

			/*$( this ).find( '.swipe-knob' ).swipe({
				threshold:200,
				swipe: function(event, direction, distance, duration, fingerCount) {
					this.text("You swiped " + distance + "px");
				}
			});*/
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
			styles: {
				knobcolor: "",
				disabledknobcolor: "",
				backgroundcolor: ""
			},
			formid: "",
			width: "100%",
			hinttext: "Slide to Submit",
			hinttext_size: "",
			beforeUnlock : function() {},
			afterUnlock : function() {},
			beforeSubmit : function() {},
			afterSubmit : function() {}
		};

}( jQuery ));
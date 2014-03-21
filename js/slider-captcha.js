(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {
			
			var s = settings;

			$( this ).addClass( 'slider_captcha' ).width( s.width ).height( s.height ).css( 'background', s.styles.backgroundcolor ).append(
				$( '<span>' ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
				$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).width( s.height ).height( s.height ) ).append( 
				$( '<div>' ).addClass( 'knob-destiny' ).width( s.height ).height( s.height ) );

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
				drop: function(event, ui) { console.log( s.text_after_unlock.length );
					if( s.text_after_unlock.length )
						$( ui.draggable ).parent().find('span').text(s.text_after_unlock);

					$( this ).droppable( "option", "disabled", true );
					$( ui.draggable ).addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': s.styles.disabledknobcolor } ).draggable({disabled: true})
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
				disabledknobcolor: "auto",
				backgroundcolor: "",
				textcolor: ""
			},
			formid: "",
			width: "100%",
			height: "",
			hinttext: "Slide to Submit",
			hinttext_size: "",
			text_after_unlock: "Desbloqueado",
			beforeUnlock : function() {},
			afterUnlock : function() {},
			beforeSubmit : function() {},
			afterSubmit : function() {}
		};

}( jQuery ));
(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			if ( $form.length && $form.find( 'input[type="submit"]' ) )
				$form.find( 'input[type="submit"]' ).attr('disabled','disabled');

			$this.addClass( 'slider_captcha' ).width( s.width ).height( s.height ).css( 'background', s.styles.backgroundcolor ).append(
				$( '<span>' ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
				$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).width( s.height ).height( s.height ) ).append( 
				$( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knobcolor', s.styles.disabledknobcolor ).width( s.height ).height( s.height ) ).data( 'events', s.events ).data( 'form', $form);

		
			$this.find( '.swipe-knob' ).draggable({
				containment: "parent", 
				scrollSpeed: 70,
				axis: 'x',
				cursor: 'move',
				revert: 'invalid',
				zIndex: '1'
			});

			$this.find( '.knob-destiny' ).droppable({
				acccept: '.swipe-knob',
				tolerance: 'intersect',
				drop: function(event, ui) {

					var events = $( this ).parent().data( 'events' ),
						form = $( this ).parent().data( 'form' );

					// Event before unlock
					if ( events['beforeUnlock'] )
						events['beforeUnlock'].apply();

					if( s.text_after_unlock.length )
						$( ui.draggable ).parent().find('span').text( $( ui.draggable ).parent().find('span').data( 'text-unlocked' ) );

					$( this ).droppable( "option", "disabled", true );
					$( ui.draggable ).addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': $( this ).data( 'disabled-knobcolor' ) } ).draggable({ disabled: true })

					// Event after unlock
					if ( events['afterUnlock'] )
						events['afterUnlock'].apply();

					if ( form.length )
						form.find( 'input[type="submit"]' ).removeAttr( 'disabled' ).click( function () {
							
							// Event before submit
							if ( events['beforeSubmit'] )
								events['beforeSubmit'].apply();

						})
				}
			})
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		styles: {
			knobcolor: "",
			disabledknobcolor: "#5CDF3B",
			backgroundcolor: "",
			textcolor: ""
		},
		formid: "",
		width: "100%",
		height: "",
		hinttext: "Slide to Submit",
		hinttext_size: "",
		text_after_unlock: "Unlocked",
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {}		
		}
	};

}( jQuery ));
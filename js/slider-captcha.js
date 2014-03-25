(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			if ( $form.length && $form.find( 'input[type="submit"]' ) )
				$form.find( 'input[type="submit"]' ).attr('disabled','disabled');

			// Start slider criation
			$this.addClass( 'slider_captcha' ).width( s.width ).height( s.height ).css( 'background', s.styles.backgroundcolor );

			if ( s.type == "filled") {
				$this.append(
					$( '<span>' ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobcolor, 'left':s.height} ).height( s.height ).append(
					$( '<span>' ).addClass( 'knob_face' ).css({ 'top': s.face._top , 'right': s.face._right }) ) );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).height( s.height ) );
			}

			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knobcolor', s.styles.disabledknobcolor ).width( s.height ).height( s.height ) ).data( 'form', $form);
			// Finished slider criation

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
				tolerance: 'pointer',
				drop: function(event, ui) {

					var events = $( this ).parent().data( 'events' ),
						form = $( this ).parent().data( 'form' );

					// Event before unlock
					if ( events['beforeUnlock'] )
						events['beforeUnlock'].apply();

					if( s.text_after_unlock.length )
						$( ui.draggable ).parent().find('span:eq(0)').text( $( ui.draggable ).parent().find('span:eq(0)').data( 'text-unlocked' ) );

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

						});

						if ( events['submitAfterUnlock'] )
							form.submit();
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
			beforeSubmit: function() {},
			submitAfterUnlock: 0
		},
		type: "normal",
		face: {
			image: '',
			_top: 0,
			_right: 0
		}
	};

}( jQuery ));
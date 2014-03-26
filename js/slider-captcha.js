(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			if ( $form.length && $form.find( 'input[type="submit"]' ) ) {
				$form.find( 'input[type="submit"]' ).attr('disabled','disabled');
			}

			// Start slider criation
			$this.addClass( 'slider_captcha' ).width( s.styles.width ).height( s.styles.height ).css( 'background', s.styles.backgroundcolor );

			if ( s.type == "filled") {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobcolor, 'left': s.styles.height } ).height( s.styles.height ).append(
					$( '<span>' ).addClass( 'knob_face' ).css({ 'top': s.face._top , 'right': s.face._right }) ) );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).height( s.styles.height ) );
			}

			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knobcolor', s.styles.disabledknobcolor ).width( s.styles.height ).height( s.styles.height ) ).data( 'form', $form);
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
						slider_elem = $( this ).parent(),
						slider_text_elem = slider_elem.find( 'span:eq(0)' ),
						drag_elem = $( ui.draggable ),
						drop_elem = $( this ),
						form = slider_elem.data( 'form' );

					// Event before unlock
					if ( events['beforeUnlock'] && typeof( events['beforeUnlock'] ) == "function" )
						events['beforeUnlock'].apply();

					if( s.text_after_unlock.length )
						slider_text_elem.text( slider_text_elem.data( 'text-unlocked' ) );

					drop_elem.droppable( "option", "disabled", true );
					slider_text_elem.css( { 'z-index': 2, 'color': slider_text_elem.data( 'text-color-unlocked' ) } );
					drag_elem.addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': drop_elem.data( 'disabled-knobcolor' ) } ).draggable({ disabled: true });

					// Event after unlock
					if ( events['afterUnlock'] && typeof( events['afterUnlock'] ) == "function" )
						events['afterUnlock'].apply();

					if ( form.length ) {

						if ( events['validateOnServer'] )
							form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'slider_captcha_validated' ).val( 1 ) );
						
						form.find( 'input[type="submit"]' ).removeAttr( 'disabled' ).click( function () {
							// Event before submit
							if ( events['beforeSubmit'] && typeof( events['beforeSubmit'] ) == "function" )
								events['beforeSubmit'].apply();

						});

						if ( events['submitAfterUnlock'] )
							form.submit();
					}
				}
			})
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		type: "normal",
		styles: {
			knobcolor: "",
			disabledknobcolor: "#5CDF3B",
			backgroundcolor: "",
			textcolor: "",
			unlocktextcolor: "",
			width: "100%",
			height: ""
		},

		hinttext: "Slide to Submit",
		hinttext_size: "",
		text_after_unlock: "Unlocked",
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {},
			submitAfterUnlock: 0,
			validateOnServer: 0
		},
		
		face: {
			image: '',
			_top: '',
			_right: '',
			entypo_start: 'chevron-small-right',
			entypo_end: 'check'
		},

	};

}( jQuery ));
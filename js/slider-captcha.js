(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( true, {}, $.fn.sliderCaptcha.defaults, options );

		return this.each(function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			// Disable input submit form
			if ( $form.length && $form.find( 'input[type="submit"]' ) )
				$form.find( 'input[type="submit"]' ).attr('disabled','disabled');

			// Start slider criation
			$this.addClass( 'slider_captcha' ).width( s.styles.width ).height( s.styles.height ).css( 'background', s.styles.backgroundcolor );

			if ( s.type == "filled") {
				$this.append(
					$( '<span>' ).append( $( '<span>' ).text( s.hinttext ) ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobcolor, 'left': s.styles.height } ).height( s.styles.height ).append(
					$( '<span>' ).data( 'top-end', s.face._top_end ).data( 'right-end', s.face._right_end ).addClass( 'knob_face' ).css({ 'top': s.face._top_start , 'right': s.face._right_start }) ) );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.unlocktextcolor ).data( 'text-unlocked', s.text_after_unlock ).css( { 'font-size': s.hinttext_size, 'color': s.styles.textcolor } ).text( s.hinttext ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobcolor ).height( s.styles.height ).append(
					$( '<span>' ).addClass( 'knob_face' ) ) );
					// _top_end and _right_end end only matters for filled slider type
			}

			if ( s.face.entypo_start.length )
				$this.find( '.swipe-knob' ).data( 'start-icon', s.face.entypo_start ).addClass( 'icon-' + s.face.entypo_start );

			if ( s.face.entypo_end.length )
				$this.find( '.swipe-knob' ).data( 'end-icon', s.face.entypo_end );

			$this.find( '.knob_face' ).css( 'color', s.face.text_color_start ).data( 'end-text-color',  s.face.text_color_end );
			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knobcolor', s.styles.disabledknobcolor ).width( s.styles.height ).height( s.styles.height ) ).data( 'form', $form);
			// Finished slider criation

			$this.find( '.swipe-knob' ).draggable({
				containment: "parent", 
				scrollSpeed: 70,
				axis: 'x',
				cursor: 'move',
				revert: 'invalid',
				zIndex: '1',
				drag: function ( event, ui ) {
					console.log( 'Position', ui.offset, 'Max', $( this ).parent().find( 'span' )[0] );
				},
				stop: function( event, ui ) {
					console.log( 'Stopped' );
				},
				start: function( event, ui ) {
					console.log( 'Started' );
				}
			});

			$this.find( '.knob-destiny' ).droppable({
				acccept: '.swipe-knob',
				tolerance: 'pointer',
				drop: function(event, ui) {

					var events = $( this ).parent().data( 'events' ),
						$slider_elem = $( this ).parent(),
						$slider_text_elem = $slider_elem.find( 'span:eq(0)' ),
						$drag_elem = $( ui.draggable ),
						$drop_elem = $( this ),
						$form = $slider_elem.data( 'form' );


					if ( $drag_elem.find( '.knob_face' ).data( 'end-text-color' ) )
						$drag_elem.find( '.knob_face' ).css( 'color', $drag_elem.find( '.knob_face' ).data( 'end-text-color' ) );

					if ( $drag_elem.data( 'end-icon' ) ) {

						if ( $drag_elem.data( 'start-icon' ) )
							$drag_elem.removeClass( 'icon-' + $drag_elem.data( 'start-icon' ) );

						$drag_elem.addClass( 'icon-' + $drag_elem.data( 'end-icon' ) );

						if ( $drag_elem.find( 'span' ).data( 'top-end' ) )
							$drag_elem.find( 'span' ).css( 'top', $drag_elem.find( 'span' ).data( 'top-end' ) );

						if ( $drag_elem.find( 'span' ).data( 'right-end' ) )
							$drag_elem.find( 'span' ).css( 'right', $drag_elem.find( 'span' ).data( 'right-end' ) );
					}

					// Event before unlock
					if ( events['beforeUnlock'] && typeof( events['beforeUnlock'] ) == "function" )
						events['beforeUnlock'].apply();

					if( s.text_after_unlock.length )
						$slider_text_elem.text( $slider_text_elem.data( 'text-unlocked' ) );

					$drop_elem.droppable( "option", "disabled", true );
					$slider_text_elem.css( { 'z-index': 2, 'color': $slider_text_elem.data( 'text-color-unlocked' ) } );
					$drag_elem.addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': $drop_elem.data( 'disabled-knobcolor' ) } ).draggable({ disabled: true });

					// Event after unlock
					if ( events['afterUnlock'] && typeof( events['afterUnlock'] ) == "function" )
						events['afterUnlock'].apply();

					if ( $form.length ) {

						if ( events['validateOnServer'] )
							$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'slider_captcha_validated' ).val( 1 ) );
						
						$form.find( 'input[type="submit"]' ).removeAttr( 'disabled' ).click( function () {
							// Event before submit
							if ( events['beforeSubmit'] && typeof( events['beforeSubmit'] ) == "function" )
								events['beforeSubmit'].apply();

						});

						if ( events['submitAfterUnlock'] )
							$form.submit();
					}
				}
			})
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		type: 'normal',
		styles: {
			knobcolor: '',
			disabledknobcolor: '#5CDF3B',
			backgroundcolor: '',
			textcolor: '',
			unlocktextcolor: '',
			width: '100%',
			height: ''
		},

		hinttext: 'Slide to Submit',
		hinttext_size: '',
		text_after_unlock: 'Unlocked',
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {},
			submitAfterUnlock: 0,
			validateOnServer: 0
		},
		
		face: {
			// todo image face
			image: '',
			_top_start: '',
			_right_start: '',
			_top_end: '',
			_right_end: '',
			entypo_start: '',
			entypo_end: '',
			text_color_start: '',
			text_color_end: ''
		},

	};

}( jQuery ));
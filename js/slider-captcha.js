/*
 * Slider Captcha - jQuery plugin for Slider Captcha
 *
 * Copyright (c) 2014 DSI - Técnico Lisboa
 *
 * Licensed under the GPLv3 license:
 *   https://www.gnu.org/copyleft/gpl.html
 *
 * Version:  0.2.1
 *
 */

(function( $ ) {

	$.fn.sliderCaptcha = function( options ) {

		var settings = $.extend( true, {}, $.fn.sliderCaptcha.defaults, options );

		if ( settings && 'normal' != settings.type && 'filled' != settings.type ) {
			settings.type = 'normal';
		}

		if ( settings && 'overlap' != settings.textFeedbackAnimation && 'swipe_overlap' != settings.textFeedbackAnimation && 'swipe' != settings.textFeedbackAnimation ) {
			settings.textFeedbackAnimation = 'swipe';
		}

		return this.each( function() {

			var s = settings, 
				$this = $( this ),
				$form = $this.closest( "form" );

			// Disable submit button if submit after unlock
			if ( $form.length && $form.find( 'input[type="submit"]' ) && s.events.submitAfterUnlock ) {
					$form.find( 'input[type="submit"]' ).hide();
			} else {
				// Disable input submit form
				if ( $form.length && $form.find( 'input[type="submit"]' ) )
					$form.find( 'input[type="submit"]' ).attr('disabled','disabled');
			}

			// Start slider criation
			$this.addClass( 'slider_captcha' ).width( s.styles.width ).height( s.styles.height ).css( 'background', s.styles.backgroundColor ).data( 'options', s );

			if ( "filled" == s.type ) {
				$this.append(
					$( '<span>' ).append( $( '<span>' ).text( s.hintText ).css( "line-height", s.styles.height ) ).data( 'animation-type', s.textFeedbackAnimation ).data( 'text-color-unlocked', s.styles.unlockTextColor ).data( 'text-unlocked', s.textAfterUnlock ).css( { 'font-size': s.hintTextSize, 'color': s.styles.textColor, "line-height": s.styles.height } ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobColor, 'left': s.styles.height } ).height( s.styles.height ).append(
					$( '<span>' ).data( 'top-end', s.face.topEnd ).data( 'right-end', s.face.rightEnd ).addClass( 'knob_face' ).css({ 'top': s.face.topStart , 'right': s.face.rightStart, "line-height": s.styles.height }) ) );

					$this.find( 'span > span' ).css( 'left', 0 );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.unlockTextColor ).data( 'text-unlocked', s.textAfterUnlock ).css( { 'font-size': s.hintTextSize, 'color': s.styles.textColor } ).text( s.hintText ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css( 'background', s.styles.knobColor ).width( s.styles.height ).height( s.styles.height ).append(
					$( '<span>' ).data( 'top-end', s.face.topEnd ).data( 'right-end', s.face.rightEnd ).addClass( 'knob_face' ).css({ 'top': s.face.topStart , 'right': s.face.rightStart, "line-height": s.styles.height }) ) );
					// topEnd and rightEnd end only matters for filled slider type
			}

			if ( s.face.entypoStart.length )
				$this.find( '.swipe-knob' ).data( 'start-icon', s.face.entypoStart ).addClass( 'icon-' + s.face.entypoStart );

			if ( s.face.entypoEnd.length )
				$this.find( '.swipe-knob' ).data( 'end-icon', s.face.entypoEnd );

			$this.find( '.knob_face' ).css( 'color', s.face.textColorStart ).data( 'end-text-color',  s.face.textColorEnd );
			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knob-color', s.styles.disabledKnobColor ).width( s.styles.height ).height( s.styles.height ) ).data( 'form', $form);


			// Finished slider criation
			$this.find( '.swipe-knob' ).draggable({
				containment: "parent", 
				scrollSpeed: 70,
				axis: 'x',
				cursor: 'move',
				revert: 'invalid',
				zIndex: '1',
				drag: function ( event, ui ) {

					if ( $( this ).parent().find( 'span > span' ).parent().data( 'animation-type' ) ) {

						var $slider_elem = $( this ).parent(),
							slider_elem_coord = $slider_elem.get(0).getBoundingClientRect(),
							$feedback_elem = $slider_elem.find( 'span > span' ),
							feedback_elem_coord = $feedback_elem.get(0).getBoundingClientRect(),
							$feedback_elem_parent = $slider_elem.find( 'span > span' ).parent(),
							feedback_elem_parent = $feedback_elem_parent.get(0).getBoundingClientRect(),
							feedback_elem_x = 0;

						if ( 'swipe_overlap' == $feedback_elem.parent().data( 'animation-type' ) ) {
							// swipe_overlap
							if ( ui.offset.left + 10 + 5 + feedback_elem_parent.width > slider_elem_coord.width ) {
								feedback_elem_x = slider_elem_coord.width - feedback_elem_parent.width - feedback_elem_parent.left - 5;
							} else if ( feedback_elem_parent.left < ui.offset.left + 10) {
								feedback_elem_x = ui.offset.left - feedback_elem_parent.left + 10;
							}

							$feedback_elem.css( 'left', feedback_elem_x );
						} else if( 'swipe' == $feedback_elem.parent().data( 'animation-type' ) ) {
							// swipe
							feedback_elem_x = ( feedback_elem_parent.left < ui.offset.left + 10 ) ? ui.offset.left - feedback_elem_parent.left + 10 : 0;
							$feedback_elem.css( 'left', feedback_elem_x );
						}
					
					}

				},
				stop: function( event, ui ) {
					if ( $( this ).parent().find( 'span > span' ).parent().data( 'animation-type' ) )
						$( this ).parent().find( 'span > span' ).animate({ 'left': 0 }, 200);
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

						options = $slider_elem.data( 'options' );

					$form.find( ':focus' ).blur();


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
					if ( events['beforeUnlock'] && "function" == typeof( events['beforeUnlock'] ) )
						events['beforeUnlock'].apply();

					if( s.textAfterUnlock.length )
						$slider_text_elem.text( $slider_text_elem.data( 'text-unlocked' ) );

					$drop_elem.droppable( "option", "disabled", true );
					$slider_text_elem.css( { 'z-index': 2, 'color': $slider_text_elem.data( 'text-color-unlocked' ) } );
					$drag_elem.addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': $drop_elem.data( 'disabled-knob-color' ) } ).draggable({ disabled: true });

					// Event after unlock
					if ( events['afterUnlock'] &&  "function" == typeof( events['afterUnlock'] ) )
						events['afterUnlock'].apply();

					if ( $form.length ) {

						if ( events['validateOnServer'] )
							$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', events['validateOnServerParamName'] ).val( 1 ) );
						
						$form.find( 'input[type="submit"]' ).removeAttr( 'disabled' ).click( function () {
							// Event before submit
							if ( events['beforeSubmit'] &&  "function" == typeof( events['beforeSubmit'] ) )
								events['beforeSubmit'].apply();
						});

						if ( events['submitAfterUnlock'] ) {

							if ( !$form.find( 'input[type=submit]' ).length )
								$form.append( $('<input>').attr( "type", "submit" ).hide() )

							$form.find( 'input[type=submit]' ).click();

							if ( $form.find( ':focus' ).length ) {

								if ( events['noSubmit'] &&  "function" == typeof( events['noSubmit'] ) ) {
									events['noSubmit'].apply();
								}

								$slider_elem.empty().sliderCaptcha( options );
							}
						}
					}
				}
			})
		});
	};

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		type: 'normal',
		textFeedbackAnimation: 'overlap',
		styles: {
			knobColor: '',
			disabledKnobColor: '#5CDF3B',
			backgroundColor: '',
			textColor: '',
			unlockTextColor: '#000',
			width: '100%',
			height: ''
		},

		hintText: 'Swipe to Unlock',
		hintTextSize: '',
		textAfterUnlock: 'Unlocked',
		face: {
			// todo image face
			image: '',

			entypoStart: '',
			topStart: '',
			rightStart: '',
			textColorStart: '',

			entypoEnd: '',
			topEnd: '',
			rightEnd: '',
			textColorEnd: ''
		},
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {},
			noSubmit: function() {},
			submitAfterUnlock: 0,
			validateOnServer: 0,
			validateOnServerParamName: 'slider_captcha_validated'
		}
	};
}( jQuery ));
/*
 * Slider Captcha - jQuery plugin for Slider Captcha
 *
 * Copyright (c) 2014 DSI - Técnico Lisboa
 *
 * Licensed under the GPLv3 license:
 *   https://www.gnu.org/copyleft/gpl.html
 *
 * Version:  0.3.2
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

		settings.width = getUnitSize( settings.width );
		settings.height = getUnitSize( settings.height );

		settings.hintTextSize  = getUnitSize( settings.hintTextSize );

		settings.face.top = getUnitSize( settings.face.top );
		settings.face.right = getUnitSize( settings.face.right );

		settings.face.topAfterUnlock = getUnitSize( settings.face.topAfterUnlock );
		settings.face.rightAfterUnlock = getUnitSize( settings.face.rightAfterUnlock );

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
			$this.addClass( 'slider_captcha' ).width( s.width ).height( s.height ).css( 'background', s.styles.backgroundColor ).data( 'options', s );

			if ( "filled" == s.type ) {
				$this.append(
					$( '<span>' ).append( $( '<span>' ).text( s.hintText ).css( "line-height", s.height ) ).data( 'animation-type', s.textFeedbackAnimation ).data( 'text-color-unlocked', s.styles.textColorAfterUnlock ).data( 'text-unlocked', s.hintTextAfterUnlock ).css( { 'font-size': s.hintTextSize, 'color': s.styles.textColor, "line-height": s.height } ) ).append(
					$( '<div>' ).addClass( 'swipe-knob ui-draggable type_filled' ).css( {'background': s.styles.knobColor, 'left': s.height, 'position': 'absolute' } ).height( s.height ).append(
					$( '<span>' ).data( 'top-end', s.face.topAfterUnlock ).data( 'right-end', s.face.rightAfterUnlock ).addClass( 'knob_face' ).css({ 'top': s.face.top , 'right': s.face.right, "line-height": s.height }) ) );

					$this.find( 'span > span' ).css( 'left', 0 );
			} else {
				$this.append(
					$( '<span>' ).data( 'text-color-unlocked', s.styles.textColorAfterUnlock ).data( 'text-unlocked', s.hintTextAfterUnlock ).css( { 'font-size': s.hintTextSize, 'color': s.styles.textColor, "line-height": s.height } ).text( s.hintText ) ).append( 
					$( '<div>' ).addClass( 'swipe-knob ui-draggable' ).css({ 'background': s.styles.knobColor, 'position': 'absolute' }).width( s.height ).height( s.height ).append(
					$( '<span>' ).data( 'top-end', s.face.topAfterUnlock ).data( 'right-end', s.face.rightAfterUnlock ).addClass( 'knob_face' ).css({ 'top': s.face.top , 'right': s.face.right, "line-height": s.height }) ) );
					// topAfterUnlock and rightAfterUnlock end only matters for filled slider type
			}

			if ( s.face.icon.length )
				$this.find( '.swipe-knob' ).data( 'start-icon', s.face.icon ).addClass( 'icon-' + s.face.icon );

			if ( s.face.iconAfterUnlock.length )
				$this.find( '.swipe-knob' ).data( 'end-icon', s.face.iconAfterUnlock );

			$this.find( '.knob_face' ).css( 'color', s.face.textColor ).data( 'end-text-color',  s.face.textColorAfterUnlock );
			$this.data( 'events', s.events ).append( $( '<div>' ).addClass( 'knob-destiny' ).data( 'disabled-knob-color', s.styles.knobColorAfterUnlock ).width( s.height ).height( s.height ) ).data( 'form', $form);


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
							feedback_elem_x = 0,
							animation_type = $feedback_elem.parent().data( 'animation-type' );

						if ( 'swipe_overlap' == animation_type ) {
							// swipe_overlap
							if ( ui.position.left + 10 + 10 + feedback_elem_parent.width > slider_elem_coord.width ) {
								feedback_elem_x = slider_elem_coord.width - feedback_elem_parent.width - feedback_elem_parent.left + slider_elem_coord.left - 10;
							} else if ( feedback_elem_parent.left < ui.offset.left + 10) {
								feedback_elem_x = ui.offset.left - feedback_elem_parent.left + 10;
							}

							$feedback_elem.css( 'left', feedback_elem_x );
						} else if( 'swipe' == animation_type ) {
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

					if( s.hintTextAfterUnlock.length )
						$slider_text_elem.text( $slider_text_elem.data( 'text-unlocked' ) );

					$drop_elem.droppable( "option", "disabled", true );
					$slider_text_elem.css( { 'z-index': 2, 'color': $slider_text_elem.data( 'text-color-unlocked' ) } );
					$drag_elem.addClass( 'swipe_ended' ).css( { 'left': 'auto', 'background': $drop_elem.data( 'disabled-knob-color' ) } ).draggable({ disabled: true });

					// Event after unlock
					if ( events['afterUnlock'] &&  "function" == typeof( events['afterUnlock'] ) )
						events['afterUnlock'].apply();

					if ( $form.length ) {

						if ( events['validateOnServer'] ) {
							var result = 1;

							if ( events['highValidationOnServer'] ) {

								// Set cookie that expires each 2 minutes
								var h = generateHashOnlyLetters(5);
								createCookie( "sh", h, 2/24/60);
								// Get all necessary values
								var a = aRange(),
									deter = a * ( detRange() + (Number( $slider_elem.attr('id').length) % 4 ) + 1 );
									b = cdRange(),
									c = cdRange() * a,
									d = ( deter + b * c ) / a,
									M = a + "," + b + ",0," + c + "," + d + ",0,0,0,1";

								result =  "|" + M + "|=" + deter + ";" + h;
								$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'm' ).val( M ) );
								$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'sliderName' ).val( $slider_elem.attr('id') ) );
							}

							$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', events['validateOnServerParamName'] ).val( result ) );

						}
						
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


	var getUnitSize = function( n ) {
		if( !n )
			return n;

		if( n.toString().slice(-1) == "%" || n.toString().slice(-2) == "px" )
			return n;

		return parseInt( n ) + "px";
	}

	var randomNumber = function ( min, max ) {
		if ( max === undefined) {
			max = min;
			min = 0;
		}

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var getRandomNumber = function ( min, max ) {
		return function () {
			return randomNumber( min, max )
		}
	}

	var getRandomNumberNotNull = function ( min, max ) {
		return function () {
			if ( min * max > 0)
				return randomNumber( min, max )
			else
				return randomNumber(0,1) ? randomNumber( min, -1 ) : randomNumber( 1, max );
		}
	}

	var generateHash = function ( a ) {
		return function ( len ) {
		
			if ( "object" != typeof( a ) || !a.length )
				return "";

			var result_array = Array();

			for (var i = 0; i < len; i++) {

				var slot = randomNumber( a.length - 1 );

				if ( 1 < a[slot].length )
					result_array.push( String.fromCharCode( randomNumber( a[slot][0], a[slot][1] ) ) )
				else
					result_array.push( String.fromCharCode( randomNumber( a[slot][0] ) ) )
			}
			
			return result_array.join("");
		}
	}

	var generateHashOnlyLetters = generateHash([[65,90],[97,122]]);
	var aRange = getRandomNumberNotNull( -2, 2 ),
		detRange = getRandomNumber( 1, 4 ),
		cdRange = getRandomNumberNotNull( -4, 4 );

	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	// Plugin defaults
	$.fn.sliderCaptcha.defaults = {
		type: 'normal',
		textFeedbackAnimation: 'overlap',
		styles: {
			knobColor: '',
			knobColorAfterUnlock: '#5CDF3B',
			backgroundColor: '',
			textColor: '',
			textColorAfterUnlock: '#000'
		},
		width: '100%',
		height: '',
		hintText: 'Swipe to Unlock',
		hintTextSize: '',
		hintTextAfterUnlock: 'Unlocked',
		face: {
			// todo image face
			image: '',

			icon: '',
			top: '',
			right: '',
			textColor: '',

			iconAfterUnlock: '',
			topAfterUnlock: '',
			rightAfterUnlock: '',
			textColorAfterUnlock: ''
		},
		events: {
			beforeUnlock: function() {return !1},
			afterUnlock: function() {return !1},
			beforeSubmit: function() {return !1},
			noSubmit: function() {return !1},
			submitAfterUnlock: 0,
			validateOnServer: 0,
			highValidationOnServer: 0,
			validateOnServerParamName: 'slider_captcha_validated'
		}
	}
}( jQuery ));
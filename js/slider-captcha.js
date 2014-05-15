/*
 * Slider Captcha - jQuery plugin for Slider Captcha
 *
 * Copyright (c) 2014 DSI - Técnico Lisboa
 *
 * Licensed under the GPLv3 license:
 *   https://www.gnu.org/copyleft/gpl.html
 *
 * Version:  0.3.3
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

			if ( s['highValidationOnServer'] ) {
				console.log( "sh_" + $this.attr( 'id' ) );
				eraseCookie( "sh_" + $this.attr( 'id' ) );
			}

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
								createCookie( "sh_" + $slider_elem.attr( 'id' ), h, 1/2);
								// Get all necessary values
								var a = aRange(),
									deter = a * ( detRange() + (Number( $slider_elem.attr('id').length) % 4 ) + 1 );
									b = cdRange(),
									c = cdRange() * a,
									d = ( deter + b * c ) / a,
									M = a + "," + b + ",0," + c + "," + d + ",0,0,0,1";

								result = md5( "|" + M + "|=" + deter + ";" + h );
								$form.append( $( '<input>' ).attr( 'type', 'hidden' ).attr( 'name', 'm' ).val( M + "," + deter ) );
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

	function createCookie( name, value, days ) {
		if (days) {
			var date = new Date();
			date.setTime( date.getTime() + (days*24*60*60*1000) );
			var expires = "; expires=" + date.toGMTString();
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function eraseCookie( name ) {
		createCookie( name, "", -1 );
	}


	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Copyright (C) Paul Johnston 1999 - 2000.
	 * Updated by Greg Holt 2000 - 2001.
	 * See http://pajhome.org.uk/site/legal.html for details.
	 */

	function md5(str) {
	/*
	 * Convert a 32-bit number to a hex string with ls-byte first
	 */
		var hex_chr = "0123456789abcdef";
		function rhex(num) {
			str = "";
			for(j = 0; j <= 3; j++)
				str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
			hex_chr.charAt((num >> (j * 8)) & 0x0F);
			return str;
		}
	
		/*
		 * Convert a string to a sequence of 16-word blocks, stored as an array.
		 * Append padding bits and the length, as described in the MD5 standard.
		 */
		function str2blks_MD5(str) {
			nblk = ((str.length + 8) >> 6) + 1;
			blks = new Array(nblk * 16);
			for(i = 0; i < nblk * 16; i++) blks[i] = 0;
			for(i = 0; i < str.length; i++)
				blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
				blks[i >> 2] |= 0x80 << ((i % 4) * 8);
				blks[nblk * 16 - 2] = str.length * 8;
			return blks;
		}

		/*
		 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
	 	* to work around bugs in some JS interpreters.
	 	*/
		function add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		/*
		 * Bitwise rotate a 32-bit number to the left
	 	*/
		function rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		/*
	 	* These functions implement the basic operation for each round of the
	 	* algorithm.
	 	*/
		function cmn(q, a, b, x, s, t) {
			return add(rol(add(add(a, q), add(x, t)), s), b);
		}

		function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
		}
		
		function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		x = str2blks_MD5(str);
		a =  1732584193;
		b = -271733879;
		c = -1732584194;
		d =  271733878;

		for(i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
			d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
			c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
			b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
			a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
			d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
			c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
			b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
			a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
			d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
			c = ff(c, d, a, b, x[i+10], 17, -42063);
			b = ff(b, c, d, a, x[i+11], 22, -1990404162);
			a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
			d = ff(d, a, b, c, x[i+13], 12, -40341101);
			c = ff(c, d, a, b, x[i+14], 17, -1502002290);
			b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

			a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
			d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
			c = gg(c, d, a, b, x[i+11], 14,  643717713);
			b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
			a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
			d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
			c = gg(c, d, a, b, x[i+15], 14, -660478335);
			b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
			a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
			d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
			c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
			b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
			a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
			d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
			c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
			b = gg(b, c, d, a, x[i+12], 20, -1926607734);
			
			a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
			d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
			c = hh(c, d, a, b, x[i+11], 16,  1839030562);
			b = hh(b, c, d, a, x[i+14], 23, -35309556);
			a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
			d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
			c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
			b = hh(b, c, d, a, x[i+10], 23, -1094730640);
			a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
			d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
			c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
			b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
			a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
			d = hh(d, a, b, c, x[i+12], 11, -421815835);
			c = hh(c, d, a, b, x[i+15], 16,  530742520);
			b = hh(b, c, d, a, x[i+ 2], 23, -995338651);
			
			a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
			d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
			c = ii(c, d, a, b, x[i+14], 15, -1416354905);
			b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
			a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
			d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
			c = ii(c, d, a, b, x[i+10], 15, -1051523);
			b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
			a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
			d = ii(d, a, b, c, x[i+15], 10, -30611744);
			c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
			b = ii(b, c, d, a, x[i+13], 21,  1309151649);
			a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
			d = ii(d, a, b, c, x[i+11], 10, -1120210379);
			c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
			b = ii(b, c, d, a, x[i+ 9], 21, -343485551);
			
			a = add(a, olda);
			b = add(b, oldb);
			c = add(c, oldc);
			d = add(d, oldd);
		}
		return rhex(a) + rhex(b) + rhex(c) + rhex(d);
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
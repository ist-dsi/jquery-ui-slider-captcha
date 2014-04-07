A Slider Captcha with cool style
========================

The jQuery Slider Captcha provides a slider interface, based in jQuery-UI slider, to unlock or submit forms or other type of elements. In other words, this plugin replaces traditional captcha. 

Compatibility

The slider is totaly functional in all modern browsers. Slider is full responsive and can be used in touch devices.


Usage

This plugin requires jQuery, jQuery UI, jQuery UI Touch Punch Improved. We suggest that this resources should be include at the end of head tag. The plugin css should be loaded in the same way. Note that some of listed resources have dependecies and should be loaded in the right position.

<link rel="stylesheet" href="/path/to/slider-captcha.css" media="screen">

<script src="/path/to/jquery.min.js"></script>

<script src="/path/to/jquery.ui.core.js"></script>
<script src="/path/to/jquery.ui.widget.js"></script>
<script src="/path/to/jquery.ui.mouse.js"></script>
<script src="/path/to/jquery.ui.draggable.js"></script>
<script src="/path/to/jquery.ui.droppable.js"></script>

<script src="/path/to/jquery.ui.touch-punch-improved.js"></script>

<script src="/path/to/slider-captcha.js"></script>


Initialization

After the document load, you can use the plugin inside a $(document).ready function:

$(document).ready(function() {
	$( '#slider' ).sliderCaptcha();	
})


Full customization

All available options. The following example uses the default options.

$(document).ready( function () {
	$( '#slider' ).sliderCaptcha({
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
			entypoStart: '',
			topStart: '',
			rightStart: '',
			textColorStart: '',
			entypoEnd: '',
			topEnd: '',
			rightEnd: '',
			textColorEnd: ''
		},

		// events
		events: {
			beforeUnlock: function() {},
			afterUnlock: function() {},
			beforeSubmit: function() {},
			submitAfterUnlock: 0,
			validateOnServer: 0,
			validateOnServerParamName: 'slider_captcha_validated'
		}		
	});
})


Options

All the options demystified:

	type: (default 'normal' ) The options 'normal' and 'filled' are eligible. The latter causes the slider to fill the slider bar while user control it.

	textFeedbackAnimation: (default 'overlap' ) Swipe out, pushed or overlaped 
	
	styles: (default { knobColor: '', disabledKnobColor: '#5CDF3B', backgroundColor: '', textColor: '', unlockTextColor: '#000', width: '100%', height: '' } )

	hintText (default 'Swipe to Unlock') Text to be displayed in initial state.

	hintTextSize '' (default '') Hint text font size.
	
	textAfterUnlock (default 'Unlocked') Text to be displayed after the slider has been unlocked.

	face (default { entypoStart: '', topStart: '', rightStart: '', textColorStart: '', entypoEnd: '', topEnd: '', rightEnd: '', textColorEnd: '' }) All the options 

	events (default { beforeUnlock: function() {}, afterUnlock: function() {}, beforeSubmit: function() {}, submitAfterUnlock: 0, validateOnServer: 0, validateOnServerParamName: 'slider_captcha_validated' }) 

Examples



License

This plugin is available under the GPLv3 license (https://www.gnu.org/copyleft/gpl.html).

Changelog


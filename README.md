A Slider Captcha with cool style
========================

The jQuery Slider Captcha provides a slider interface, based in jQuery-UI slider, to unlock or submit forms or other type of elements. In other words, this plugin replaces traditional captcha. 

This plugin was developed by the Computer and Network Services of Técnico Lisboa due to usability concerns with the traditional captcha tool. We wanted to provide a more fluid and quick interaction to the user, while maintaining the validation pattern that a web form requires. This plugin was inspired in similar approaches found in the web.


## Compatibility

The slider is totaly functional in all modern browsers. Slider is full responsive and can be used in touch devices.


## Usage

This plugin requires jQuery, jQuery UI, jQuery UI Touch Punch Improved. We suggest that this resources should be include at the end of head tag. The plugin css should be loaded in the same way. Note that some of listed resources have dependecies and should be loaded in the right position.

```html
<link rel="stylesheet" href="/path/to/slider-captcha.css" media="screen">

<script src="/path/to/jquery.min.js"></script>

<script src="/path/to/jquery.ui.core.js"></script>
<script src="/path/to/jquery.ui.widget.js"></script>
<script src="/path/to/jquery.ui.mouse.js"></script>
<script src="/path/to/jquery.ui.draggable.js"></script>
<script src="/path/to/jquery.ui.droppable.js"></script>

<script src="/path/to/jquery.ui.touch-punch-improved.js"></script>

<script src="/path/to/slider-captcha.js"></script>
```

## Initialization

After the document load, you can use the plugin inside a `$(document).ready` function:

```javascript
$(document).ready(function() {
	$( '#slider' ).sliderCaptcha();	
})
```

## Full customization

All available options. The following example uses the default options.

```javascript
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
```

## Options

All the options demystified:

	`type`: (default `'normal'`) The options `'normal'` and 'filled' are eligible. The latter causes the slider to fill the slider bar while user control it.

	`textFeedbackAnimation`: (default `'overlap'`) This option is only available with the 'filled' slider type. Push and swipe out the feedback text in slider bar ('swipe'), push the feedback text in slider bar ( 'swipe_overlap' ) or overlap text feedback ( 'overlap' ).
	
	`styles`: (default `{ knobColor: '', disabledKnobColor: '#5CDF3B', backgroundColor: '', textColor: '', unlockTextColor: '#000', width: '100%', height: '' }` ) General styles, including color, text and dimensions options.

	`hintText`: (default `'Swipe to Unlock'`) Text to be displayed in initial state.

	`hintTextSize`: '' (default `''`) Hint text font size.
	
	`textAfterUnlock`: (default `'Unlocked'`) Text to be displayed after the slider has been unlocked.

	`face`: (default `{ entypoStart: '', topStart: '', rightStart: '', textColorStart: '', entypoEnd: '', topEnd: '', rightEnd: '', textColorEnd: '' }`) Slider knob options, including face content (entypo font) , color and offset.

	`events`: (default `{ beforeUnlock: function() {}, afterUnlock: function() {}, beforeSubmit: function() {}, submitAfterUnlock: 0, validateOnServer: 0, validateOnServerParamName: 'slider_captcha_validated' }`) Events options, like functions to be called before and after unlock and before submit. Here can be configured if the validation will be performed in server (validateOnServer) and with which param name in form request  should be used (validateOnServerParamName), and if submit should be performed after the unlock (submitAfterUnlock).


## Examples

### Example 1 

### Example 2 

## Changelog

### 0.1
 - Initial release.

## License

This plugin is available under the [GPLv3 license](https://www.gnu.org/copyleft/gpl.html).




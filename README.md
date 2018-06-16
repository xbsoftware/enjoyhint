[![npm version](https://badge.fury.io/js/enjoyhint.js.svg)](https://www.npmjs.com/package/enjoyhint.js)
[![monthly](https://img.shields.io/npm/dm/enjoyhint.js.svg)](https://www.npmjs.com/package/enjoyhint.js)
[![total](https://img.shields.io/npm/dt/enjoyhint.js.svg)](https://www.npmjs.com/package/enjoyhint.js)


EnjoyHint
=========
**EnjoyHint** is a web-tool that provides the simplest way to create interactive tutorials and hints for your site or web-application. It can also be used to highlight and sign application elements.  

EnjoyHint is free software distributed under the terms of MIT license.

#### Demo
* [A guide on EnjoyHint](http://darron1217.github.io/enjoyhint.js/docs/index.html)

#### Dependencies
EnjoyHint require the following plugins and libs:

* jQuery > 1.7
* KineticJS v5.1.0 (included into js file)

#### Installation
You can install it through `npm` package manager:
```
npm install enjoyhint.js
```
Alternative way:
- Download the latest version of EnjoyHint
- Extract the archive with EnjoyHint.
- Move the EnjoyHint directory to somewhere on your webserver
- Insert next lines into your page's \<head\> tag:
```html
  <link href="<pathontheserver>/enjoyhint/enjoyhint.css" rel="stylesheet">
  <script src="<pathontheserver>/enjoyhint/enjoyhint.min.js"></script>
```

#### Initialization and configuration:
```javascript
//initialize instance
var enjoyhint_instance = new EnjoyHint({});

//simple config.
//Only one step - highlighting(with description) "New" button
//hide EnjoyHint after a click on the button.
var enjoyhint_script_steps = [
  {
    'click .new_btn' : 'Click the "New" button to start creating your project'
  }  
];

//set script config
enjoyhint_instance.set(enjoyhint_script_steps);

//run Enjoyhint script
enjoyhint_instance.run();
```

#### Script Configuration
The sequence of steps can be only linear for now. So, the script config is an array. Every element of this array is the config for some step.

#### Example of script configuration
Highlight some button and after you click on it, highlight some panel:
```javascript
var enjoyhint_script_steps = [
  {
    'click .some_btn' : 'Click on this btn'
  },  
  {
    'click .some_panel' : 'Click on this panel'
  }  
];
```

#### Properties of instance configuration
* `container` - scrollable container (default `body`)
* `animation_time` - time between scroll animation and arrow render (default ms `800`)

```javascript
//initialize instance
var enjoyhint_instance = new EnjoyHint({
  container: '.main-panel'
});
```

#### Events
**Script Events**:
* `onStart` - fires on the first step.
* `onEnd` - fires after the last step in script.
* `onSkip` - fires after user has clicked skip, or close.
* `onNext` - fires at the start of each step.
```javascript
var enjoyhint_instance = new EnjoyHint({
  onStart:function(){
    //do something
  }
});
```

#### Properties of the step configuration
* `"event selector" : "description"` - to describe a step you should set an event type, selecte element and add description for this element (hint)
* `description
* `keyCode` - the code of a button, which triggers the next EnjoyHint step upon a click. Defined by the “key” event. (“key #block” : “hello”).
* `event_selector` - if you need to attach an event (that was set in "event" property) to other selector, you can use this one  
* `timeout` - delay before the moment, when an element is highlighted   
* `shape` - shape for highlighting (circle|rect)
* `radius` -  if the shape of "circle" is specified, we can set the radius.
* `margin` - margin for the highlight shape (for Ex.:10)  
* `top` - top margin for the shape of "rect" type  
* `right` - right margin for the shape of "rect" type  
* `bottom` - bottom margin for the shape of "rect" type  
* `left` - left margin for the shape of "rect" type
* `scrollAnimationSpeed` - sets the auto scroll speed (ms).
* `nextButton` - allows applying its classes and names for the button Nеxt.
* `skipButton` - allows applying its classes and names for the button Skip. For the example :
```javascript
	var options = {
                    "next #block": 'Hello.',
                    "nextButton" : {className: "myNext", text: "NEXT"},
                    "skipButton" : {className: "mySkip", text: "SKIP"},

                }
  ```
* `showSkip` - shows or hides the Skip button (true|false)
* `showNext` - shows or hides the Next button (true|false)




#### Non-standard events:
* `auto` - Triggers event on selector automatically, and continues to the next step.  For example, you need to click on the same button on the second step imediatelly after the first step and go to the next step after it. Then you can use "auto" in the "event_type" property and "click" in 'event' property.
```javascript
enjoyhint_instance.set( [ {
    'auto selector' : 'This is what happens when you click this button.',
    event: 'click'
} ] );
```
* `custom` - this value is very usefull if you need to go to the next step by event in your app code. For example, you want to go to the next step only after some data have been loaded in your application. Then you should use the "custom" event_type and the "trigger" method of the EnjoyHint instance.
```javascript
enjoyhint_instance.set( [ {
    'custom selector' : 'This element is loading',
    event: 'custom_event_name',
    onBeforeStart: function () {
        $.get('/load/some_data', function(data){
          enjoyhint_instance.trigger('custom_event_name');
        });
    }
} ] );
```
* `next` - Wait for next button to be pushed.
* `key` - Wait for button defined by the `keyCode` step parameter to be triggered on element.


#### Tour Methods
* `stop()` - End script
* `reRunScript(current_step)` - Restart script at current_step.
* `set(steps_array)` - Set current steps configuration.
* `setCurrentStep(current_step)` - Set the step to resume at.
* `run()` - Run the current script.
* `resume()` - Resume the script from the step where it was stopped.
* `getCurrentStep()` - Returns the current step index.
* `trigger( "next" | "skip" | custom_event_name )` - Trigger the relevant script action.

#### Events
**Step Events**:  
* `onBeforeStart` - fires before the step is started.
```javascript
var enjoyhint_script_steps = [
  {
    selector:'.some_btn',//jquery selector
    event:'click',
    description:'Click on this btn',
    onBeforeStart:function(){
      //do something
    }
  }
];
```

#### Changelogs

##### 1.1.4
* Be more careful with calls to .off()
* Improve Documentation
* Add animation_time as a parameter
* Allow .trigger() to trigger custom events

##### 1.1.1
* Disable element click when next button shown

##### 1.1.0
* Allow multiple run() on one instance

##### 1.0.6
* Fix `getBoundingClientRect()` error bug
* Change label CSS text-align from `center` to `left`

##### 1.0.5
* Add instance option `container`

##### 1.0.3

* Fix auto scroll to the element
* Fix demo page scroll error
* Change z-indexes from 10xx to 20xx

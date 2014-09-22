
About
=========

**EnjoyHint** is a web-tool that provides the simplest way to create interactive tutorials and hints for your site or web-application. It can also be used to highlight and sign application elements.  

EnjoyHint is free software distributed under the terms of MIT license.
  
Check out this [issue tracker demo with EnjoyHint](http://xbsoftware.com/products/enjoyhint/) and a [TODO app demo](http://xbsoftware.github.io/enjoyhint/) ([downloadable package](http://xbsoftware.github.io/enjoyhint/enjoyhint_todo_demo.zip))

Dependencies
=========
EnjoyHint require the following plugins and libs:

  1. Jquery >1.7
  2. kineticJS v5.1.0(included into js file)

Installation
=========
1. Download the latest version of EnjoyHint
2. Extract the archive with EnjoyHint.
3. Move the EnjoyHint directory to somewhere on your webserver
4. Insert next lines into your page's \<head\> tag:
```
  <link href="<pathontheserver>/enjoyhint/enjoyhint.css" rel="stylesheet">
  
  <script src="<pathontheserver>/enjoyhint/enjoyhint.min.js"></script>
```

Initialization and configuration:
=========
```
//initialize instance
var enjoyhint_instance = new EnjoyHint({});

//simple config. 
//Only one step - highlighting(with description) "New" button 
//hide EnjoyHint after a click on the button.
var enjoyhint_script_steps = [
  {
    selector:'.new_btn',//jquery selector
    event:'click',
    description:'Click the "New" button to start creating your project'
  }  
];

//set script config
enjoyhint_instance.setScript(enjoyhint_script_steps);

//run Enjoyhint script
enjoyhint_instance.runScript();
```


Script Configuration
=========

The sequence of steps can be only linear for now. So, the script config is an array. Every element of this array is the config for some step.

Example. 
Highlight some button and after you click on it, highlight some panel:
```
var enjoyhint_script_steps = [
  {
    selector:'.some_btn',//jquery selector
    event:'click',
    description:'Click on this btn'
  },  
  {
    selector:'.some_panel',//jquery selector
    event:'click',
    description:'Click on this panel'
  }  
];
```


Properties of the step configuration:  
**selector** - jquery selector of the DOM-element, that will be highlighted  
**event** - a jquery event that is set for the element defined in the selector. When it fires, the next step is triggered.   
**key_code** - key code for any "key*" event. Event fires only if key code of the pressed key is equal to this property.    
**event_selector** - if you need to attach an event (that was set in "event" property) to other selector, you can use this one  
**description** - description for the highlighted element  
**timeout** - delay before the moment, when an element is highlighted   
**shape** - shape for highlighting (circle|rect)  
**margin** - margin for the highlight shape (for Ex.:10)  
**top** - top margin for the shape of "rect" type  
**right** - right margin for the shape of "rect" type  
**bottom** - bottom margin for the shape of "rect" type  
**left** - left margin for the shape of "rect" type  
**event_type** - type of event that will get you to the next step(auto|custom|next)

Event Types descriptions:  
**auto** - for example, you need to click on the same button on the second step imediatelly after the first step and go to the next step after it. Then you can use "auto" in the "event_type" property and "click" in "event" property.

**custom** - this value is very usefull if you need to go to the next step by event in your app code. For example, you want to go to the next step only after some data have been loaded in your application. Then you should use the "custom" event_type and the "trigger" method of the EnjoyHint instance.  
```
//Example of using custom event_type
$.get('/load/some_data', function(data){
  //trigger method has only one argument: event_name.(equal to the value of event property in step config)
  enjoyhint_instance.trigger('custom_event_name');
});
```  
**next** - when you set value of event_type to "next", you will see the "Next" btn on this step.



Methods
=========
**setScript** - set current steps configuration. Arguments: config  
**runScript** - run the current script. Has no arguments  
**resumeScript** - resume the script from the step where it was stopped. Has no arguments  
**getCurrentStep** - returns the current step index  


Events
=========

**Script Events**:
  

onStart - fires on the first step  
onEnd - fires after the last step in script
```
var enjoyhint_instance = new EnjoyHint({
  onStart:function(){
    //do something
  }
});
```

**Step Events**:  
  
onBeforeStart - fires before the step is started

```
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


About
=========

**EnjoyHint** is a simplest way to create interactive tutorials and hints for your site or web-application. Also it can be used for highlighting and signing application elements. 

Dependencies
=========
EnjoyHint require next plugins and libs:

  1. Jquery >1.7
  2. kineticJS v5.1.0(included in the pack)

Installation
=========
1. Download latest version of enjoyhint
2. Extract archive with enjoyhint.
3. Move the enjoyhint directory to somewhere on your webserver
4. Insert next lines into your page's head tag:
```
  <link href="<pathontheserver>/enjoyhint/jquery.enjoyhint.css" rel="stylesheet">
  
  <script src="<pathontheserver>/enjoyhint/jquery.enjoyhint.js"></script>
  <script src="<pathontheserver>/enjoyhint/kinetic.min.js"></script>
  <script src="<pathontheserver>/enjoyhint/enjoyhint.js"></script>
```

Initialization and configuration:
=========
```
//initialize instance
var enjoyhint_instance = new EnjoyHint({});

//simple config. 
//Only one step - highlighting(with description) "New" button 
//and after click on it, hide EnjoyHint.
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

Sequence of steps can be only linear for now. So script config is an array. Every element of this array is the config for some step.

Example. 
Highlight some btn and then after click on it highlight some panel :
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


Properties of the step config:  
**selector** - jquery selector of DOM-element, that will be highlighted  
**event** - jquery event name. It fires for element that set in "selector" property  
**key_code** - Key code for any "key*" event. Event fires only if keyCode of pressed key is equal to this property.    
**event_selector** - if you need to attach event (that was set in "event" property) to other selector, you can use this one  
**description** - description for highlighted element  
**timeout** - delay before moment, when element will be highlighted   
**shape** - shape for highlighting(circle|rect)  
**margin** - margin for highlight shape(for Ex.:10)  
**top** - top margin for shape of "rect" type  
**right** - right margin for shape of "rect" type  
**bottom** - bottom margin for shape of "rect" type  
**left** - left margin for shape of "rect" type  
**event_type** - type of event that will get you to the next step(auto|custom|next)

Event Types descriptions:  
**auto** - For example you need click on the same btn on the second step imediatelly after first step and go to the next step after it. Then you can use "auto" in event_type property and "click" in "event" property.

**custom** - This value is very usefull if you need to change step by the event in your code. For example you want to go to the next step only after some data have been loaded in your application. Then you should use "custom" event_type and "trigger" method of enjoyhint instance.  
```
//Example of using custom event_type
$.get('/load/some_data', function(data){
  //trigger method have only one argument: event_name.(equal to the value of event property in step config)
  enjoyhint_instance.trigger('custom_event_name');
});
```  
**next** - When you set value of event_type to "next", you will see "Next" btn on this step.



Methods
=========
**setScript** - Set current steps config. Arguments: config  
**runScript** - run current script. Have no any arguments  
**resumeScript** - resume script from step where it was closed. Have no any arguments  



Events
=========

**Script Events**:
  

onStart - Fires on fisrst step  
onEnd - Fires after last step in script
```
var enjoyhint_instance = new EnjoyHint({
  onStart:function(){
    //do something
  }
});
```

**Step Events**:  
  
onBeforeStart - Fires Before step started

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


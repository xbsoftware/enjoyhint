EnjoyHint
=========
**EnjoyHint** is a web-tool that provides the simplest way to create interactive tutorials and hints for your site or web-application. It can also be used to highlight and sign application elements.  

EnjoyHint is free software distributed under the terms of MIT license.
  
#### Demo
* [TODO app demo](http://xbsoftware.github.io/enjoyhint/) ([downloadable package](http://xbsoftware.github.io/enjoyhint/enjoyhint_todo_demo.zip))
* [A small guide on EnjoyHint](http://xbsoftware.github.io/enjoyhint/example1.html)

#### Dependencies
EnjoyHint has no runtime dependencies. It uses native DOM APIs and SVG for the
overlay, spotlight, arrows, events, and scrolling.

#### Installation
You can install it through the `node` package manager:
```
npm install xbs-enjoyhint
```
Alternative way:
- Download the latest version of EnjoyHint from GitHub.
- Extract the archive with EnjoyHint.
- Move the EnjoyHint directory to somewhere on your webserver.
- Install development dependencies with `npm install` only if you want to build or test the library.
- Insert next lines into your page's \<head\> tag:
```html
  <!-- Enjoyhint library -->
  <link href="<pathontheserver>/enjoyhint/dist/enjoyhint.css" rel="stylesheet">
  <script src="<pathontheserver>/enjoyhint/dist/enjoyhint.min.js"></script>
```

#### Using with Angular
v5 is a dependency-free ESM/CJS build, so Angular can import EnjoyHint like any other library. Start the tour after the view (and step targets) exist, and destroy it when the host component is destroyed. If the tour would outlive the component (for example across a route change), stop or destroy it when leaving that view.

```typescript
import { AfterViewInit, OnDestroy, Component } from '@angular/core';
import EnjoyHint from 'xbs-enjoyhint';
// Styles load via the package side-effect CSS import.
// Optional explicit import if your bundler does not follow JS CSS imports:
// import 'xbs-enjoyhint/dist/enjoyhint.css';

@Component({ /* ... */ })
export class TourHostComponent implements AfterViewInit, OnDestroy {
  private tour?: EnjoyHint;

  ngAfterViewInit(): void {
    this.tour = new EnjoyHint({});
    this.tour.set([
      { 'click .new_btn': 'Click the "New" button' },
    ]);
    this.tour.run();
  }

  ngOnDestroy(): void {
    this.tour?.destroy();
  }
}
```

`import EnjoyHint from 'xbs-enjoyhint'` auto-injects styles at runtime for ESM/CJS (including Angular CLI, which cannot process CSS side-effect imports from `node_modules`). The CSS path is also exported as `xbs-enjoyhint/dist/enjoyhint.css` and `xbs-enjoyhint/enjoyhint.css` for optional `<link>` / global styles. UMD (`enjoyhint.min.js`) still expects a separate `<link>` to `dist/enjoyhint.css`.

Highlighting targets inside Angular Material dialogs (`MD-DIALOG` / `dialogClosing`) is supported. The pre-v5 bundler errors (`Can't resolve './jquery.enjoyhint.js'`, `global is not defined`) do not apply to v5.

#### Initialization and configuration:
```javascript
//initialize instance
var enjoyhint_instance = new EnjoyHint({
  // Optional global button defaults (applied to every step; per-step fields override)
  nextButton: { text: "Continue", className: "my-next" },
  skipButton: { text: "Exit", className: "my-skip" },
  prevButton: { text: "Back", className: "my-prev" },
});

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

Initialization options also include:
* `nextButton` / `prevButton` / `skipButton` — default `{ text, className }` for all steps. A step may override individual fields; missing fields fall through to these defaults.
* `btnNextText` / `btnSkipText` — **deprecated.** Prefer `nextButton.text` / `skipButton.text`. Still honored when the corresponding button object does not set `text`.
* `dir` — `"ltr"` (default) or `"rtl"` for tour chrome direction (see RTL support below).
* `backgroundColor`, `onStart`, `onEnd`, `onSkip`, `onNext` — overlay color and tour lifecycle callbacks.

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

#### Properties of the step configuration
* `"event selector" : "description"` - to describe a step you should set an event type, selecte element and add description for this element (hint)
* `selector` / `event` / `description` - object-form fields for the same step data. Omit `selector` for a **targetless** step (see below).
* `description` may include HTML. Links written as `<a href="...">...</a>` are clickable and always open in a new tab; the rest of the label still lets clicks pass through to the highlighted element.
* `arrowColor` - the color of a marker that accepts all CSS colors.
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
* `nextButton` - allows applying its classes and names for the button Next (overrides init defaults field-by-field).
* `skipButton` - allows applying its classes and names for the button Skip (overrides init defaults field-by-field).
* `prevButton` - allows applying its classes and names for the button Previous (overrides init defaults field-by-field). For the example :
```javascript
	var options = {
                    "next #block": 'Hello.',
                    "nextButton" : {className: "myNext", text: "myNEXT"},
                    "skipButton" : {className: "mySkip", text: "mySKIP"},
                    "prevButton" : {className: "myPrev", text: "myPREV"}
                }
  ```
* `showSkip` - shows or hides the Skip button (true|false)
* `showNext` - shows or hides the Next button (true|false)
* `showPrev` - shows or hides the Previous button (true|false)

#### Targetless steps (no selector / no spotlight)
Omit `selector` to show a full-screen dim with centered description text and the usual Next / Prev / Skip / Close buttons — no spotlight hole and no arrow. Use the object form (shorthand keys like `"next #banner"` always imply a selector):

```javascript
var enjoyhint_script_steps = [
  {
    event: "next",
    event_type: "next",
    description: "Welcome. Click Next to begin."
  },
  {
    "click .new_btn": "Click the New button"
  }
];
```

You can also use `event_type: "custom"` with `trigger()`, or `event: "key"` with `keyCode` (listened on `document`). Shape / margin / arrow options are ignored on targetless steps. A non-empty `selector` whose element is missing still ends the tour.

#### RTL support (`dir` option)
Pass `dir: "rtl"` (or `"ltr"`, the default) when creating the EnjoyHint instance. This controls tour chrome direction independently of the host page, so RTL pages no longer break overlay layout, and RTL tours can mirror chrome without moving the spotlight off the real target.

```javascript
var enjoyhint_instance = new EnjoyHint({
  dir: "rtl"
});
```

With `dir: "rtl"`, EnjoyHint mirrors:
* Close button — top-left instead of top-right
* Nav button row — Skip → Next → Prev (horizontal mirror of Prev → Next → Skip)
* Label hide slide — off the right edge instead of the left
* Label text flow — right-to-left

Spotlight shape/position, event blockers, arrow endpoints, and step shape offsets (`left` / `right` / `top` / `bottom` / `margin`) stay tied to physical element coordinates in both modes. `dir` is tour-wide and set only at construction; EnjoyHint does not auto-detect the page’s `dir` or `lang`.

#### Non-standard events:
* `auto` - for example, you need to click on the same button on the second step imediatelly after the first step and go to the next step after it. Then you can use "auto" in the "event_type" property and "click" in "event" property.
* `custom` - this value is very usefull if you need to go to the next step by event in your app code. For example, you want to go to the next step only after some data have been loaded in your application. Then you should use the "custom" event_type and the "trigger" method of the EnjoyHint instance.  
```javascript
//Example of using custom event_type
$.get('/load/some_data', function(data){
  //trigger method has only one argument: event_name.(equal to the value of event property in step config)
  enjoyhint_instance.trigger('custom_event_name');
});
```  
* `next` - when you set value of event_type to "next", you will see the "Next" btn on this step.
* `key` - tells EnjoyHint to go to the next step when you click on the button defined by the keyCode


#### Methods
* `set` - set current steps configuration. Arguments: config  
* `run` - run the current script. Has no arguments  
* `resume` - resume the script from the step where it was stopped. Has no arguments  
* `getCurrentStep` - returns the current step index
* `trigger` -  After writing this code you can either move to the next step or finish with EnjoyHint (next|skip)

#### Events
**Script Events**:
* `onStart` - fires on the first step.
* `onEnd` - fires after the last step in script.
* `onSkip` - fires after user has clicked skip.
```javascript
var enjoyhint_instance = new EnjoyHint({
  onStart:function(){
    //do something
  }
});
```
**Step Events**:  
* `onBeforeStart` - fires before the step is started. Return `false` to skip the step without rendering and advance to the next one (consecutive skips chain). Tour `onNext` does not fire for skipped steps.
```javascript
var enjoyhint_script_steps = [
  {
    selector:'.some_btn',//jquery selector
    event:'click',
    description:'Click on this btn',
    onBeforeStart:function(){
      //do something
      // return false; // skip this step
    }
  }
];
```

#### Release notes

##### v.5

* Rewritten in TypeScript with native DOM and SVG rendering.
* Removed runtime dependencies on jQuery, jQuery.scrollTo, and KineticJS.
* Existing `EnjoyHint` initialization, methods, callbacks, and step configuration remain compatible.
* For script-tag usage, remove the old external dependency scripts and load `dist/enjoyhint.min.js`.

##### v.4

* Fixed label position bugs
* Fixed arrow position bugs
* Fixed resize bugs
* Added responsive design
* Added mobile support
* Added possibility to go back to previous step
* Added possibility to select the color of a marker
* Added possibility to customize previous button





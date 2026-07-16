var tourWasSkipped = false;

//initialize instance
var enjoyhint_instance = new EnjoyHint({
    // dir: "rtl",
    onSkip: function () {
        tourWasSkipped = true;
        updateTourControls();
    },
    onEnd: function () {
        tourWasSkipped = false;
        updateTourControls();
    }
});

//simple config.
//Only one step - highlighting(with description) "New" button
//hide EnjoyHint after a click on the button.
var enjoyhint_script_steps = [
    {
        event: "next",
        event_type: "next",
        description:
            "A step can omit <text style='color: #00ebe7'>selector</text> to show centered text with no spotlight.<br>" +
            "Click Next to begin the tour."
    },
    {
        "next #banner": 'Hello, I\'d like to tell you about EnjoyHint.<br> Click "Next" to proceed.'
    },
    {
        "next #buttons": "You can select different blocks. For example, let's select title.<br>" +
            "This event has a very simple code.<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #title '</text> : <text style='color: #2bff3c'>' Some description '</text> <br>" +
            "}<br>" +
            "<text style='color: #00ebe7'>next</text> - event (all events are described in the documentation)<br>" +
            "<text style='color: #00ebe7'>#title</text> - selector <br>" +
            "<text style='color: #00ebe7'>Some description</text> - Description for the block <br>"
    },
    {
        "click .btn-success" : "For example, let's set a handler for a button click event.<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' click .btn-success '</text> : <text style='color: #2bff3c'>' Some description '</text> <br>" +
            "}<br>" +
            "Click the button and move on.",
        showSkip: false
    },
    {
        "next #button6" : "You can highlight blocks by selecting them in a circle. <br>" +
            "<text style='color: #00ebe7'>shape</text> - you can define shape of highligting (rectangular||circle)<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some description ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' shape '</text> :  <text style='color: #2bff3c'>' circle '</text> <br>" +
            "}<br>" +
            "The circle radius seems to be too small.<br> Click 'Next' to fix it.",
        shape : 'circle'
    },
    {
        "next #mini_button" : "At this step we fix radius<br>" +
            "<text style='color: #00ebe7'>radius</text> - sets the size of the circle radius<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some description ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' shape '</text> :  <text style='color: #2bff3c'>' circle '</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' radius '</text> : 80<br>" +
            "}<br>",
        shape : 'circle',
        radius: 80
    },
    {
        "next #animationSpeed" : "Sometimes you need to scroll the page either very slowly (as we've just done) or very fast.<br>" +
            "<text style='color: #00ebe7'>scrollAnimationSpeed</text> - sets the speed for the scroll page<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' next #selector '</text> : <text style='color: #2bff3c'>' Some description ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' scrollAnimationSpeed '</text> : 2500<br>" +
            "}<br>",
        scrollAnimationSpeed : 2500
    },
    {
        "key #suc_input" : "You can attach handlers to keyboard events.<br>" +
            "<text style='color: #00ebe7'>keyCode</text> - key code for any 'key' event.<br>" +
            "{<br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' key #selector '</text> : <text style='color: #2bff3c'>' Some description ',</text> <br>" +
            "<text style='color: #00a6eb'>&nbsp &nbsp ' keyCode '</text> : 13<br>" +
            "}<br>" +
            "Enter some text and press 'Enter'",
        keyCode : 13
    },
    {
        "next #type" : "From the second step onward you can use the <b>Previous</b> button to revisit earlier hints.<br>" +
            "Try it, or click Next to continue."
    },
    {
        "next #text_select2" : "Button labels can be customized per step.<br>" +
            "<text style='color: #00ebe7'>nextButton</text>, <text style='color: #00ebe7'>prevButton</text>, and <text style='color: #00ebe7'>skipButton</text> accept custom text and classes.",
        nextButton: { text: "Continue", className: "custom-next-demo" },
        prevButton: { text: "Back", className: "custom-prev-demo" },
        skipButton: { text: "Exit tour", className: "custom-skip-demo" }
    },
    {
        "next #progress-basic" : "The arrow color can be customized with <text style='color: #00ebe7'>arrowColor</text>.",
        arrowColor: "#e74c3c"
    },
    {
        event: "next",
        event_type: "next",
        description:
            "Descriptions can include clickable HTML links.<br>" +
            'Try <a href="https://github.com/xbsoftware/enjoyhint">EnjoyHint on GitHub</a> — links open in a new tab.<br>' +
            "Click Next to continue."
    },
    {
        "next #pr_btm" : "Use <text style='color: #00ebe7'>margin</text> to enlarge rectangular highlights around small targets.",
        margin: 30
    },
    {
        selector: "#change_checkbox",
        event: "click",
        event_type: "auto",
        description: "<text style='color: #00ebe7'>auto</text> steps fire the configured event automatically.<br>" +
            "This one also uses <text style='color: #00ebe7'>timeout</text> to delay the start.",
        timeout: 400
    },
    {
        selector: "#def_but",
        event: "proceed",
        event_type: "custom",
        description: "<text style='color: #00ebe7'>custom</text> steps wait for <code>enjoyhint.trigger('proceed')</code> from your code.<br>" +
            "Click the highlighted button to continue."
    },
    {
        "next #inputEmail" : "A step can wait before rendering with <text style='color: #00ebe7'>timeout</text>.",
        timeout: 500
    },
    {
        "click #buttons_ex" : "Use <text style='color: #00ebe7'>event_selector</text> to highlight one element while listening on another.<br>" +
            "The button group is highlighted, but click <b>Success</b> to continue.",
        event_selector: "#buttons_ex a.btn-success",
        showSkip: false
    },
    {
        "next #iframe-demo-button" : "Elements inside iframes are highlighted using coordinates translated to the parent page.<br>" +
            "Without this, the hint would appear too high when the target lives in an embedded frame.",
        showNext: true
    },
    {
        "click .alert-success strong" : "Set <text style='color: #00ebe7'>showNext: true</text> on click steps so users can click Next instead of the target.<br>" +
            "Click the alert text or Next to finish.",
        showNext: true,
        onBeforeStart: function () {
            document.querySelector(".alert-success")?.scrollIntoView({ block: "center" });
        }
    }

];

document.getElementById("def_but")?.addEventListener("click", function () {
    enjoyhint_instance.trigger("proceed");
});

//set script config
enjoyhint_instance.set(enjoyhint_script_steps);

function canResumeTour() {
    return tourWasSkipped && enjoyhint_instance.getCurrentStep() < enjoyhint_script_steps.length;
}

function updateTourControls() {
    var resumeBtn = document.getElementById("tour-resume-btn");
    if (resumeBtn) {
        resumeBtn.disabled = !canResumeTour();
    }
}

document.getElementById("tour-resume-btn")?.addEventListener("click", function () {
    if (!canResumeTour()) {
        return;
    }

    tourWasSkipped = false;
    enjoyhint_instance.resume();
    updateTourControls();
});

document.getElementById("tour-restart-btn")?.addEventListener("click", function () {
    tourWasSkipped = false;
    enjoyhint_instance.run();
    updateTourControls();
});

window.__example1Test = {
  hint: enjoyhint_instance,
  start: function () {
    enjoyhint_instance.run();
  },
  resume: function () {
    enjoyhint_instance.resume();
  },
  restart: function () {
    enjoyhint_instance.run();
  },
  goToStep: function (step) {
    enjoyhint_instance.reRunScript(step);
  },
  getCurrentStep: function () {
    return enjoyhint_instance.getCurrentStep();
  },
  trigger: function (eventName) {
    enjoyhint_instance.trigger(eventName);
  },
  setTourWasSkipped: function (skipped) {
    tourWasSkipped = skipped;
    updateTourControls();
  },
};

updateTourControls();

if (!/[\?&]e2e(?:=1)?(?:&|$)/.test(location.search)) {
  enjoyhint_instance.run();
}
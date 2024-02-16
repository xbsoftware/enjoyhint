"use strict";
(function(factory){
  // AMD
  if(typeof define === 'function' && define.amd) {
    define(['jquery', './jquery.enjoyhint.js', 'jquery.scrollto'], factory);
  }
  // CommonJS
  else if (typeof require === 'function' && typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('./jquery.enjoyhint.js'), require('jquery.scrollto'));
  }
  // Global
  else {
    window.EnjoyHint = factory(jQuery)
  }
})(function($){
  var EnjoyHint = function(configs) {
    var $event_element;
    var that = this;
    var _options = configs || {};
    var BTN_NEXT_TEXT = _options.btnNextText || 'Next';
    var BTN_SKIP_TEXT = _options.btnSkipText || 'Skip';
    var BTN_PREV_TEXT = _options.btnPrevText || 'Previous';
  
    var SHAPE_BACKGROUND_COLOR = _options.backgroundColor || "rgba(0,0,0,0.6)";
  
    var body = "body"; // TODO: Is it possible case when we need to define enjoyhint somewhere else?
  
    var defaults = {
      onStart: function() {},
  
      onEnd: function() {},
  
      onSkip: function() {},
  
      onNext: function() {}
    };
  
    var options = $.extend(defaults, _options);
    var data = [];
    var current_step = 0;
  
    var $body = $(body);
  
    /********************* PRIVATE METHODS ***************************************/
  
    var init = function() {
      if ($(".enjoyhint")) {
        $(".enjoyhint").remove();
      }
  
      $body.css({ overflow: "hidden" });
  
      $(document).on("touchmove", lockTouch);
  
      $body.enjoyhint({
        onNextClick: function() {
          nextStep();
        },
        onPrevClick: function(){
          prevStep();
        },
        onSkipClick: function() {
          options.onSkip();
          skipAll();
        },
        fill: SHAPE_BACKGROUND_COLOR,
        nextText: BTN_NEXT_TEXT,
        skipText: BTN_SKIP_TEXT,
        prevText: BTN_PREV_TEXT
      });
    };
  
    var lockTouch = function(e) {
      e.preventDefault();
    };
  
    var destroyEnjoy = function() {
      $(".enjoyhint").remove();
      $body.css({ overflow: "auto" });
      $(document).off("touchmove", lockTouch);
    };
  
    that.clear = function() {
      var $nextBtn = $(".enjoyhint_next_btn");
      var $skipBtn = $(".enjoyhint_skip_btn");
      var $prevBtn = $(".enjoyhint_prev_btn");

      $prevBtn.removeClass(that.prevUserClass);
      $nextBtn.removeClass(that.nextUserClass);
      $nextBtn.text(BTN_NEXT_TEXT);
      $skipBtn.removeClass(that.skipUserClass);
      $skipBtn.text(BTN_SKIP_TEXT);
    };
  
    function hideCurrentHint(){
      $body.enjoyhint("render_circle", []);
      $("#enjoyhint_label").remove();
      $("#enjoyhint_arrpw_line").remove();
      $body.enjoyhint("hide_prev");
      $body.enjoyhint("hide_next");
      $body.enjoyhint("hide_skip");
    };

    var stepAction = function() {
      if (!(data && data[current_step])) {
        $body.enjoyhint("hide");
        options.onEnd();
        destroyEnjoy();
        return;
      }
      
      options.onNext();
  
      var $enjoyhint = $(".enjoyhint");
  
      $enjoyhint.removeClass("enjoyhint-step-" + current_step);
      $enjoyhint.removeClass("enjoyhint-step-" + (current_step + 1));
      $enjoyhint.removeClass("enjoyhint-step-" + (current_step + 2));
      $enjoyhint.addClass("enjoyhint-step-" + (current_step + 1));
  
      var step_data = data[current_step];

      var scrollSpeed = step_data.scrollAnimationSpeed;
  
      if (
        step_data.onBeforeStart &&
        typeof step_data.onBeforeStart === "function"
      ) {
        step_data.onBeforeStart();
      }
  
      var timeout = step_data.timeout || 0;
  
      setTimeout(function() {
        if (!step_data.selector) {
          for (var prop in step_data) {
            if (step_data.hasOwnProperty(prop) && prop.split(" ")[1]) {
              step_data.selector = prop.split(" ")[1];
              step_data.event = prop.split(" ")[0];
  
              if (
                prop.split(" ")[0] == "next" ||
                prop.split(" ")[0] == "auto" ||
                prop.split(" ")[0] == "custom"
              ) {
                step_data.event_type = prop.split(" ")[0];
              }
  
              step_data.description = step_data[prop];
            }
          }
        }
  
        setTimeout(function() {
          that.clear();
        }, 250);

        var isHintInViewport = $(step_data.selector).get(0).getBoundingClientRect();
        if(isHintInViewport.top < 0 || isHintInViewport.bottom > (window.innerHeight || document.documentElement.clientHeight)){
            hideCurrentHint();
            $(document.body).scrollTo(step_data.selector, step_data.scrollAnimationSpeed || 250, {offset: -200});
        }
        else {
          // if previous button has been clicked and element are in viewport to prevent custom step scrollAnimationSpeed set scrollSpeed to default
          scrollSpeed = 250;
        }
  
        setTimeout(function() {
          var $element = $(step_data.selector);
          var event = makeEventName(step_data.event);
          $body.enjoyhint("show");
          $event_element = $element;
  
          if (step_data.event_selector) {
            $event_element = $(step_data.event_selector);
          }
          
          $event_element.off(event)
          $element.off("keydown");

          if (!step_data.event_type && step_data.event == "key") {
            $element.keydown(function(event) {
              if (event.which == step_data.keyCode) {
                current_step++;
                stepAction();
              }
            });
          }
  
          if (step_data.showNext !== true) {
            $body.enjoyhint("hide_next");
          }
          
          $body.enjoyhint("hide_prev");

          if(current_step !== 0) {
            $body.enjoyhint("show_prev");
          }

          if (step_data.showPrev == false) {
            $body.enjoyhint("hide_prev");
        }

          if (step_data.showSkip == false) {
            $body.enjoyhint("hide_skip");
          } else {
            $body.enjoyhint("show_skip");
          }
  
  
          if (step_data.nextButton) {
            var $nextBtn = $(".enjoyhint_next_btn");
  
            $nextBtn.addClass(step_data.nextButton.className || "");
            $nextBtn.text(step_data.nextButton.text || "Next");
            that.nextUserClass = step_data.nextButton.className;
          }

          if (step_data.prevButton) {
            var $prevBtn = $(".enjoyhint_prev_btn");

            $prevBtn.addClass(step_data.prevButton.className || "");
            $prevBtn.text(step_data.prevButton.text || "Previous");
            that.prevUserClass = step_data.prevButton.className;
          }

          if (step_data.skipButton) {
            var $skipBtn = $(".enjoyhint_skip_btn");
  
            $skipBtn.addClass(step_data.skipButton.className || "");
            $skipBtn.text(step_data.skipButton.text || "Skip");
            that.skipUserClass = step_data.skipButton.className;
          }
  
          if (step_data.event_type) {
            switch (step_data.event_type) {
              case "auto":
                $element[step_data.event]();
  
                switch (step_data.event) {
                  case "click":
                    break;
                }
                current_step++;
                stepAction();
                return;
  
              case "custom":
                on(step_data.event, function() {
                  current_step++;
                  off(step_data.event);
                  stepAction();
                });
  
                break;
  
              case "next":
                $body.enjoyhint("show_next");
                break;
            }
          } else {
            $event_element.on(event, function(e) {
              if (step_data.keyCode && e.keyCode != step_data.keyCode) {
                return;
              }
  
              current_step++;
              stepAction(); // clicked
            });
          }

          var max_habarites = Math.max(
            $element.outerWidth(),
            $element.outerHeight()
          );
          var radius = step_data.radius || Math.round(max_habarites / 2) + 5;
          var offset = $element.offset();
          var w = $element.outerWidth();
          var h = $element.outerHeight();
          var shape_margin =
            step_data.margin !== undefined ? step_data.margin : 10;
  
          var coords = {
            x: offset.left + Math.round(w / 2),
            y: offset.top + Math.round(h / 2) - $(document).scrollTop()
          };
  
          var shape_data = {
            enjoyHintElementSelector: step_data.selector,
            center_x: coords.x,
            center_y: coords.y,
            text: step_data.description,
            arrowColor: step_data.arrowColor,
            top: step_data.top,
            bottom: step_data.bottom,
            left: step_data.left,
            right: step_data.right,
            margin: step_data.margin,
            scroll: step_data.scroll
          };

          var customBtnProps = {
              nextButton: step_data.nextButton,
              prevButton: step_data.prevButton
          }

          if (shape_data.center_x === 0 && shape_data.center_y === 0) {
            $body.enjoyhint("hide");
            destroyEnjoy();
            return console.log("Error: Element position couldn't be reached");
          }
  
          if (step_data.shape && step_data.shape == "circle") {
            shape_data.shape = "circle";
            shape_data.radius = radius;
          } else {
            shape_data.radius = 0;
            shape_data.width = w + shape_margin;
            shape_data.height = h + shape_margin;
          }
  
          $body.enjoyhint("render_label_with_shape", shape_data, that.stop, customBtnProps);
          
        }, scrollSpeed + 20 || 270);
      }, timeout);
    };
  
    var nextStep = function() {
      current_step++;
      stepAction();
    };

    var prevStep = function() {
      current_step--;
      stepAction();
    };
  
    var skipAll = function() {
      var step_data = data[current_step];
      var $element = $(step_data.selector);
  
      off(step_data.event);
      $element.off(makeEventName(step_data.event));
  
      destroyEnjoy();
    };
  
    var makeEventName = function(name, is_custom) {
      return name + (is_custom ? "custom" : "") + ".enjoy_hint";
    };
  
    var on = function(event_name, callback) {
      $body.on(makeEventName(event_name, true), callback);
    };
  
    var off = function(event_name) {
      $body.off(makeEventName(event_name, true));
    };
  
    /********************* PUBLIC METHODS ***************************************/
  
    window.addEventListener(
      "resize",
      function() {
        if ($event_element != null) {
          $body.enjoyhint(
            "redo_events_near_rect",
            $event_element[0].getBoundingClientRect()
          );
        }
      },
      false
    );
  
    that.stop = function() {
      skipAll();
    };
  
    that.reRunScript = function(cs) {
      current_step = cs;
      stepAction();
    };
  
    that.runScript = function() {
      current_step = 0;
      options.onStart();
      stepAction();
    };
  
    that.resumeScript = function() {
      stepAction();
    };
  
    that.setCurrentStep = function(cs) {
      current_step = cs;
    };
  
    that.getCurrentStep = function() {
      return current_step;
    };
  
    that.trigger = function(event_name) {
      switch (event_name) {
        case "next":
          nextStep();
          break;
  
        case "skip":
          skipAll();
          break;
  
        default: $body.trigger(makeEventName(event_name, true));
      }
    };
  
    that.setScript = function(_data) {
      if (!(_data instanceof Array) && _data.length < 1) {
        throw new Error("Configurations list isn't correct.");
      }
  
      data = _data;
    };
  
    //support deprecated API methods
    /**
     * Configure data list
     */
    that.set = function(_data) {
      that.setScript(_data);
    };
  
    that.setSteps = function(_data) {
      that.setScript(_data);
    };
  
    that.run = function() {
      that.runScript();
    };
  
    that.resume = function() {
      that.resumeScript();
    };
  
    init();
  };
  return EnjoyHint;
})



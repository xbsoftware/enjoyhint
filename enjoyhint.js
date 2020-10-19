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
    var BTN_NEXT_TEXT = _options.btnNextText;
    var BTN_SKIP_TEXT = _options.btnSkipText;
  
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
        fill: SHAPE_BACKGROUND_COLOR
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


;CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

(function(factory) {
  'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'kinetic'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = factory(require('jquery'), require('kinetic'));
	} else {
		// Global
		factory(jQuery, Kinetic);
	}
})(function($, Kinetic) {
  var that;
  var originalLabelLeft, originalLabelTop;
  var originalArrowLeft, originalArrowTop;
  var originalCenterX, originalCenterY;
  var originalSkipbuttonLeft, originalSkipbuttonTop;
  var prevWindowWidth, prevWindowHeight;
  var originalWidth = window.innerWidth,
    originalHeight = window.innerHeight;

  var methods = {
    init: function(options) {
      return this.each(function() {
        var defaults = {
          onNextClick: function() {},
          onSkipClick: function() {},
          onPrevClick: function() {},

          animation_time: 800
        };

        this.enjoyhint_obj = {};
        that = this.enjoyhint_obj;

        that.resetComponentStuff = function() {
          originalLabelLeft = null;
          originalLabelTop = null;
          originalArrowLeft = null;
          originalArrowTop = null;
          originalCenterX = null;
          originalCenterY = null;
          originalSkipbuttonLeft = null;
          originalSkipbuttonTop = null;
          prevWindowWidth = null;
          prevWindowHeight = null;
          originalWidth = window.innerWidth;
          originalHeight = window.innerHeight;
        };

        var $that = $(this);
        that.options = $.extend(defaults, options);

        //general classes
        that.gcl = {
          chooser: "enjoyhint"
        };

        // classes
        that.cl = {
          enjoy_hint: "enjoyhint",
          hide: "enjoyhint_hide",
          disable_events_element: "enjoyhint_disable_events",
          btn: "enjoyhint_btn",
          skip_btn: "enjoyhint_skip_btn",
          close_btn: "enjoyhint_close_btn",
          next_btn: "enjoyhint_next_btn",
          previous_btn: "enjoyhint_prev_btn",
          main_canvas: "enjoyhint_canvas",
          main_svg: "enjoyhint_svg",
          svg_wrapper: "enjoyhint_svg_wrapper",
          svg_transparent: "enjoyhint_svg_transparent",
          kinetic_container: "kinetic_container"
        };

        function makeSVG(tag, attrs) {
          var el = document.createElementNS("http://www.w3.org/2000/svg", tag);

          for (var k in attrs) {
            el.setAttribute(k, attrs[k]);
          }

          return el;
        }

        // =======================================================================
        // ========================---- enjoyhint ----==============================
        // =======================================================================

        that.canvas_size = {
          w: $(window).width() * 1.4,
          h: $(window).height() * 1.4
        };

        var canvas_id = "enj_canvas";

        that.enjoyhint = $("<div>", {
          class: that.cl.enjoy_hint + " " + that.cl.svg_transparent
        }).appendTo($that);
        that.enjoyhint_svg_wrapper = $("<div>", {
          class: that.cl.svg_wrapper + " " + that.cl.svg_transparent
        }).appendTo(that.enjoyhint);
        that.$stage_container = $(
          '<div id="' + that.cl.kinetic_container + '">'
        ).appendTo(that.enjoyhint);
        that.$canvas = $(
          '<canvas id="' +
            canvas_id +
            '" width="' +
            that.canvas_size.w +
            '" height="' +
            that.canvas_size.h +
            '" class="' +
            that.cl.main_canvas +
            '">'
        ).appendTo(that.enjoyhint);
        that.$svg = $(
          '<svg width="' +
            that.canvas_size.w +
            '" height="' +
            that.canvas_size.h +
            '" class="' +
            that.cl.main_canvas +
            " " +
            that.cl.main_svg +
            '">'
        ).appendTo(that.enjoyhint_svg_wrapper);

        var defs = $(makeSVG("defs"));
        var marker = $(
          makeSVG("marker", {
            id: "arrowMarker",
            viewBox: "0 0 36 21",
            refX: "21",
            refY: "10",
            markerUnits: "strokeWidth",
            orient: "auto",
            markerWidth: "16",
            markerHeight: "12"
          })
        );
        var polilyne = $(
          makeSVG("path", {
            style: "fill:none; stroke:rgb(255,255,255); stroke-width:2",
            d: "M0,0 c30,11 30,9 0,20",
            id: "poliline"
          })
        );

        defs.append(marker.append(polilyne)).appendTo(that.$svg);

        that.kinetic_stage = new Kinetic.Stage({
          container: that.cl.kinetic_container,
          width: that.canvas_size.w,
          height: that.canvas_size.h,
          scaleX: 1
        });

        that.layer = new Kinetic.Layer();

        that.rect = new Kinetic.Rect({
          fill: options.fill,
          width: that.canvas_size.w,
          height: that.canvas_size.h
        });

        var $top_dis_events = $("<div>", {
          class: that.cl.disable_events_element
        }).appendTo(that.enjoyhint);
        var $bottom_dis_events = $top_dis_events
          .clone()
          .appendTo(that.enjoyhint);
        var $left_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
        var $right_dis_events = $top_dis_events
          .clone()
          .appendTo(that.enjoyhint);

        var stopPropagation = function(e) {
          e.stopImmediatePropagation();
        };

        $("button").focusout(stopPropagation);
        $top_dis_events.click(stopPropagation);
        $bottom_dis_events.click(stopPropagation);
        $left_dis_events.click(stopPropagation);
        $right_dis_events.click(stopPropagation);

        that.$skip_btn = $("<div>", { class: that.cl.skip_btn })
          .appendTo(that.enjoyhint)
          .html("Skip")
          .click(function(e) {
            that.hide();
            that.options.onSkipClick();
          });

        that.$next_btn = $("<div>", { class: that.cl.next_btn })
          .appendTo(that.enjoyhint)
          .html("Next")
          .click(function(e) {
            that.options.onNextClick();
          });

        that.$close_btn = $("<div>", { class: that.cl.close_btn })
          .appendTo(that.enjoyhint)
          .html("")
          .click(function(e) {
            that.hide();
            that.options.onSkipClick();
          });

        that.$prev_btn = $("<div>", { class: that.cl.previous_btn })
          .appendTo(that.enjoyhint)
          .html("Previous")
          .click(function(e) {
            that.options.onPrevClick();
          });


        that.$canvas.mousedown(function(e) {
          $("canvas").css({ left: "4000px" });

          var BottomElement = document.elementFromPoint(e.clientX, e.clientY);
          $("canvas").css({ left: "0px" });

          $(BottomElement).click();

          return false;
        });

        var circle_r = 0;
        var shape_init_shift = 130;

        that.shape = new Kinetic.Shape({
          radius: circle_r,
          center_x: -shape_init_shift,
          center_y: -shape_init_shift,
          width: 0,
          height: 0,
          sceneFunc: function(context) {
            var ctx = this.getContext("2d")._context;
            var pos = this.pos;
            var def_comp = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();

            var x = this.attrs.center_x - Math.round(this.attrs.width / 2);
            var y = this.attrs.center_y - Math.round(this.attrs.height / 2);
            ctx.roundRect(
              x,
              y,
              this.attrs.width,
              this.attrs.height,
              this.attrs.radius
            );

            ctx.fill();

            ctx.globalCompositeOperation = def_comp;
          }
        });

        that.shape.radius = circle_r;
        that.layer.add(that.rect);
        that.layer.add(that.shape);
        that.kinetic_stage.add(that.layer);

        var doit;

        $(window).on("resize", function() {
          clearTimeout(doit);
          $('.enjoyhint_next_btn').css('visibility', 'hidden');
          $('.enjoyhint_prev_btn').css('visibility', 'hidden');
          $('.enjoyhint_skip_btn').css('visibility', 'hidden');
          $('.enjoy_hint_label').remove()
          $("#enjoyhint_arrpw_line").remove()
          if (!$(that.stepData.enjoyHintElementSelector).is(":visible")) {
            that.stopFunction();
            $(window).off("resize");
            return;
          }

          var boundingClientRect = $(
            that.stepData.enjoyHintElementSelector
          )[0].getBoundingClientRect();
          
          that.shape.attrs.center_x = Math.round(
            boundingClientRect.left + boundingClientRect.width / 2
          );
          that.shape.attrs.center_y = Math.round(
            boundingClientRect.top + boundingClientRect.height / 2
          );
          that.shape.attrs.width = boundingClientRect.width + 11;
          that.shape.attrs.height = boundingClientRect.height + 11;

          function renderAfterResize(){
            var newDataCoords = $(that.stepData.enjoyHintElementSelector).get(0).getBoundingClientRect();

            that.stepData.center_x = newDataCoords.left + newDataCoords.width/2;
            that.stepData.center_y = newDataCoords.top + newDataCoords.height/2;
            that.stepData.width = newDataCoords.width + 11;
            that.stepData.height = newDataCoords.height + 11;

            that.renderLabelWithShape(that.stepData, that.customBtnProps);
            $('.enjoyhint_next_btn').css('visibility', 'visible');
            $('.enjoyhint_prev_btn').css('visibility', 'visible');
            $('.enjoyhint_skip_btn').css('visibility', 'visible');
          }

          doit = setTimeout(function() {
            if(boundingClientRect.top < 0 || boundingClientRect.bottom > (window.innerHeight || document.documentElement.clientHeight)){
              $(document.body).scrollTo(that.stepData.enjoyHintElementSelector, 150, {offset: -200, onAfter:renderAfterResize});
            }
            else renderAfterResize();
          }, 150);


          var newWidth = window.innerWidth;
          var newHeight = window.innerHeight;
          var scaleX = newWidth / originalWidth;
          var scaleY = newHeight / originalHeight;

          that.kinetic_stage.setAttr("width", originalWidth * scaleX);
          that.kinetic_stage.setAttr("height", originalHeight * scaleY);

          that.rect = new Kinetic.Rect({
            fill: options.fill,
            width: window.innerWidth,
            height: window.innerHeight
          });

          that.layer.removeChildren();
          that.layer.add(that.rect);
          that.layer.add(that.shape);
          that.kinetic_stage.draw();
        });

        var enjoyhint_elements = [
          that.enjoyhint,
          $top_dis_events,
          $bottom_dis_events,
          $left_dis_events,
          $right_dis_events
        ];

        that.show = function() {
          that.enjoyhint.removeClass(that.cl.hide);
        };

        that.hide = function() {
          that.enjoyhint.addClass(that.cl.hide);

          var tween = new Kinetic.Tween({
            node: that.shape,
            duration: 0.002,
            center_x: -shape_init_shift,
            center_y: -shape_init_shift
          });

          tween.play();
        };

        that.hide();

        that.hideNextBtn = function() {
          that.$next_btn.addClass(that.cl.hide);
          that.nextBtn = "hide";
        };

        that.hidePrevBtn = function() {
          that.$prev_btn.addClass(that.cl.hide);
          that.prevBtn = "hide";
        };

        that.showPrevBtn = function() {
          that.$prev_btn.removeClass(that.cl.hide);
          that.prevBtn = "show";
        };

        that.showNextBtn = function() {
          that.$next_btn.removeClass(that.cl.hide);
          that.nextBtn = "show";
        };

        that.hideSkipBtn = function() {
          that.$skip_btn.addClass(that.cl.hide);
        };

        that.showSkipBtn = function() {
          that.$skip_btn.removeClass(that.cl.hide);
        };

        that.renderCircle = function(data) {
          var r = data.r || 0;
          var x = data.x || 0;
          var y = data.y || 0;

          var tween = new Kinetic.Tween({
            node: that.shape,
            duration: 0.2,
            center_x: x,
            center_y: y,
            width: r * 2,
            height: r * 2,
            radius: r
          });

          tween.play();

          var left = x - r;
          var right = x + r;
          var top = y - r;
          var bottom = y + r;
          var margin = 20;

          return {
            x: x,
            y: y,
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            conn: {
              left: {
                x: left - margin,
                y: y
              },
              right: {
                x: right + margin,
                y: y
              },
              top: {
                x: x,
                y: top - margin
              },
              bottom: {
                x: x,
                y: bottom + margin
              }
            }
          };
        };

        that.renderRect = function(data, timeout) {
          var r = data.r || 0;
          var x = data.x || 0;
          var y = data.y || 0;
          var w = data.w || 0;
          var h = data.h || 0;
          var margin = 20;

          var tween = new Kinetic.Tween({
            node: that.shape,
            duration: timeout,
            center_x: x,
            center_y: y,
            width: w,
            height: h,
            radius: r
          });

          tween.play();

          var half_w = Math.round(w / 2);
          var half_h = Math.round(h / 2);
          var left = x - half_w;
          var right = x + half_w;
          var top = y - half_h;
          var bottom = y + half_h;

          return {
            x: x,
            y: y,
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            conn: {
              left: {
                x: left - margin,
                y: y
              },
              right: {
                x: right + margin,
                y: y
              },
              top: {
                x: x,
                y: top - margin
              },
              bottom: {
                x: x,
                y: bottom + margin
              }
            }
          };
        };

        that.renderLabel = function(data) {
          var x = data.x || 0;
          that.originalElementX = x;
          var y = data.y || 0;
          var text = data.text || 0;

          var label = that.getLabelElement({
            x: x,
            y: y,
            text: data.text
          });

          var label_w = label.width();
          var label_h = label.height();
          var label_left = label.offset().left;
          var label_right = label.offset().left + label_w;
          var label_top = label.offset().top - $(document).scrollTop();
          var label_bottom = label.offset().top - $(document).scrollTop() + label_h;

          var margin = 10;

          var conn_left = {
            x: label_left - margin,
            y: label_top + Math.round(label_h / 2)
          };

          var conn_right = {
            x: label_right + margin,
            y: label_top + Math.round(label_h / 2)
          };

          var conn_top = {
            x: label_left + Math.round(label_w / 2),
            y: label_top - margin
          };

          var conn_bottom = {
            x: label_left + Math.round(label_w / 2),
            y: label_bottom + margin
          };

          label.detach();

          setTimeout(function() {
            $("#enjoyhint_label").remove();
            label.appendTo(that.enjoyhint);
          }, that.options.animation_time / 2);

          return {
            label: label,
            left: label_left,
            right: label_right,
            top: label_top,
            bottom: label_bottom,
            conn: {
              left: conn_left,
              right: conn_right,
              top: conn_top,
              bottom: conn_bottom
            }
          };
        };

        that.setMarkerColor = function(color){

            function isValidColor(value) {
                const temp = new Option().style;
                temp.color = value;
                return temp.color !== '';
            }

            if (isValidColor(color)){
                return [$("#poliline"), $("#enjoyhint_arrpw_line")].forEach(function(element){
                    element.css("stroke", color);
                });
            }

            $("#poliline").css("stroke", "rgb(255,255,255)")
            console.log("Error: invalid color name property - " + color);
        }

        that.renderArrow = function(data) {
          var x_from = data.x_from || 0;
          var y_from = data.y_from || 0;
          var x_to = data.x_to || 0;
          var y_to = data.y_to || 0;
          var by_top_side = data.by_top_side;
          var control_point_x = 0;
          var control_point_y = 0;
  
          if (by_top_side === 'hor') {
            control_point_x = x_to
            control_point_y = y_from
          }
          else {
            control_point_x = x_from
            control_point_y = y_to
          }

          that.enjoyhint.addClass(that.cl.svg_transparent);

          setTimeout(function() {
            $("#enjoyhint_arrpw_line").remove();
            
            var d =
              "M" +
              x_from +
              "," +
              y_from +
              " Q" +
              control_point_x +
              "," +
              control_point_y +
              " " +
              x_to +
              "," +
              y_to;
            that.$svg.append(
              makeSVG("path", {
                style: "fill:none; stroke:rgb(255,255,255); stroke-width:3",
                "marker-end": "url(#arrowMarker)",
                d: d,
                id: "enjoyhint_arrpw_line"
              })
            );

            if(that.stepData.arrowColor) {
                that.setMarkerColor(that.stepData.arrowColor)
            } else {
                $("#poliline").css("stroke", "rgb(255, 255, 255)");
            }

            that.enjoyhint.removeClass(that.cl.svg_transparent);
          }, that.options.animation_time / 2);
        };

        that.getLabelElement = function(data) {
          return $("<div>", {
            class: "enjoy_hint_label",
            id: "enjoyhint_label"
          })
            .css({
              top: data.y + "px",
              left: data.x + "px"
            })
            .html(data.text)
            .appendTo(that.enjoyhint);
        };

        that.disableEventsNearRect = function(rect) {
          $top_dis_events
            .css({
              top: "0",
              left: "0"
            })
            .height(rect.top);

          $bottom_dis_events.css({
            top: rect.bottom + "px",
            left: "0"
          });

          $left_dis_events
            .css({
              top: "0",
              left: 0 + "px"
            })
            .width(rect.left);

          $right_dis_events.css({
            top: "0",
            left: rect.right + "px"
          });
        };

        (function($) {
          $.event.special.destroyed = {
            remove: function(o) {
              if (o.handler) {
                o.handler();
              }
            }
          };
        })($);

        that.renderLabelWithShape = function(data, customBtnProps) {
          that.stepData = data;
          that.customBtnProps = customBtnProps;

          function findParentDialog(element) {
            if (element.tagName === "MD-DIALOG") {
              return element;
            } else if (typeof element.tagName == "undefined") {
              return null;
            } else {
              return findParentDialog($(element).parent()[0]);
            }
          }

          var dialog = findParentDialog(
            $(that.stepData.enjoyHintElementSelector)[0]
          );

          if (dialog != null) {
            $(dialog).on("dialogClosing", function() {
              that.stopFunction();
              return;
            });
          }

          that.resetComponentStuff();

          var shape_type = data.shape || "rect";
          var shape_data = {};

          var half_w = 0;
          var half_h = 0;

          var shape_offsets = {
            top: data.top || 0,
            bottom: data.bottom || 0,
            left: data.left || 0,
            right: data.right || 0
          };

          switch (shape_type) {
            case "circle":
              half_w = half_h = data.radius;

              var sides_pos = {
                top: data.center_y - half_h + shape_offsets.top,
                bottom: data.center_y + half_h - shape_offsets.bottom,
                left: data.center_x - half_w + shape_offsets.left,
                right: data.center_x + half_w - shape_offsets.right
              };

              var width = sides_pos.right - sides_pos.left;
              var height = sides_pos.bottom - sides_pos.top;
              data.radius = Math.round(Math.min(width, height) / 2);

              //new half habarites
              half_w = half_h = Math.round(data.radius / 2);

              var new_half_w = Math.round(width / 2);
              var new_half_h = Math.round(height / 2);

              //new center_x and center_y
              data.center_x = sides_pos.left + new_half_w;
              data.center_y = sides_pos.top + new_half_h;

              shape_data = that.renderCircle({
                x: data.center_x,
                y: data.center_y,
                r: data.radius
              });

              break;

            case "rect":
              half_w = Math.round(data.width / 2);
              half_h = Math.round(data.height / 2);

              var sides_pos = {
                top: data.center_y - half_h + shape_offsets.top,
                bottom: data.center_y + half_h - shape_offsets.bottom,
                left: data.center_x - half_w + shape_offsets.left,
                right: data.center_x + half_w - shape_offsets.right
              };

              data.width = sides_pos.right - sides_pos.left;
              data.height = sides_pos.bottom - sides_pos.top;

              half_w = Math.round(data.width / 2);
              half_h = Math.round(data.height / 2);

              //new center_x and center_y
              data.center_x = sides_pos.left + half_w;
              data.center_y = sides_pos.top + half_h;

              shape_data = that.renderRect(
                {
                  x: data.center_x,
                  y: data.center_y,
                  w: data.width,
                  h: data.height,
                  r: data.radius
                },
                0.2
              );

              break;
          }

          var body_size = {
            w: that.enjoyhint.width(),
            h: that.enjoyhint.height()
          };

          var label = that.getLabelElement({
            x: 0,
            y: 0,
            text: data.text
          });

          var label_width = label.outerWidth();
          var label_height = label.outerHeight();
          label.remove();
          var top_offset = data.center_y - half_h;
          var bottom_offset = body_size.h - (data.center_y + half_h);
          var left_offset = data.center_x - half_w;
          var right_offset = body_size.w - (data.center_x + half_w);

          var label_shift = window.innerHeight < 670 ? 130 : 150;
          var label_margin = window.innerHeight < 670 ? 0 : 40;
          var label_shift_with_label_height =
            label_shift + label_height + label_margin;
          var label_ver_offset = half_h + label_shift;

          var areas_for_label = [
            {name: 'right_center', common_area: right_offset * window.innerHeight, width: right_offset, height: window.innerHeight},
            {name: 'right_top', common_area: right_offset * top_offset, width: right_offset, height: top_offset},
            {name: 'right_bottom', common_area: right_offset * bottom_offset, width: right_offset, height: bottom_offset},
            {name: 'left_center', common_area: left_offset * window.innerHeight, width: left_offset, height: window.innerHeight},
            {name: 'left_top', common_area: left_offset * top_offset, width: left_offset, height: top_offset},
            {name: 'left_bottom', common_area: left_offset * bottom_offset, width: left_offset, height: bottom_offset},
            {name: 'center_top', common_area: window.innerWidth * top_offset, width: window.innerWidth, height: top_offset},
            {name: 'center_bottom', common_area: window.innerWidth * bottom_offset, width: window.innerWidth, height: bottom_offset},
          ];
          var label_horizontal_space_required = label_width;
          var label_vertical_space_required = window.innerHeight <= 670 ? label_shift_with_label_height : label_shift_with_label_height + 20;

          var areas_priority = areas_for_label
            .sort(function(area1, area2){return area1.common_area - area2.common_area})

          var label_hor_side = 'oversized';
          for (var i = 0; i < areas_priority.length; i++) {
              var name = areas_priority[i].name;
              var area = areas_priority[i]
              if (
                area.width > label_horizontal_space_required
                && area.height > label_vertical_space_required
              ) {
                  label_hor_side = name;
              }
          }

          var data_width_size = data.shape === "circle" ? data.radius * 2 :
            data.width ? data.width : data.radius * 2;

          var data_height_size = data.shape === "circle" ? data.radius * 2 :
            data.height ? data.height : data.radius * 2;

          var right_position = data.center_x + data_width_size/2 + 80;
          var left_position = data.center_x - label_width - data_width_size/2 - 80;
          var central_position = window.innerWidth / 2 - label_width / 2;
          var top_position = data.center_y - label_ver_offset - label_height;
          var bottom_position = data.center_y + label_ver_offset;
          var central_ver_position = window.innerHeight/2 - label_vertical_space_required/2 + 20;
          
          var label_x, label_y, x_to, y_to, x_from, y_from;
          
          var by_top_side = "hor"

          switch(label_hor_side) {
            case "center_top":
                label_y = top_position;
                label_x = central_position;
                x_to = data.center_x;
                y_to = data.center_y - data_height_size/2 - 20;
                break;
            case "center_bottom":
                label_y = bottom_position;
                label_x = central_position;
                x_to = data.center_x;
                y_to = data.center_y + data_height_size/2 + 20;
                break;
            case 'left_center':
                label_y = central_ver_position;
                label_x = left_position;
                x_to = data.center_x - data_width_size/2 - 20;
                y_to = data.center_y;
                by_top_side = "ver";  
                break;
            case 'left_top':
                label_y = top_position;
                label_x = left_position;
                x_to = data.center_x - data_width_size/2;
                y_to = data.center_y - 20;
                break;
            case 'left_bottom':
                label_y = bottom_position;
                label_x = left_position;
                x_to = data.center_x - data_width_size/2;
                y_to = data.center_y + 20;
                by_top_side = "ver";  
                break;
            case 'right_center':
                label_y = central_ver_position;
                label_x = right_position;
                x_to = data.center_x + data_width_size/2 + 20;
                y_to = data.center_y;
                by_top_side = "ver";  
                break;
            case 'right_top':
                label_y = top_position;
                label_x = right_position;
                x_to = data.center_x + data_width_size/2;
                y_to = data.center_y - 20;
                break;            
            case 'right_bottom':
                label_y = bottom_position;
                label_x = right_position;
                x_to = data.center_x + data_width_size/2;
                y_to = data.center_y + 20;
                by_top_side = "ver";  
                break;
            case 'oversized':
              setTimeout(function(){
                $("#enjoyhint_arrpw_line").remove();
                $('.enjoy_hint_label').css({
                  'border-radius': '20px',
                  '-webkit-border-radius': '20px',
                  '-moz-border-radius': '20px',
                  'background-color': '#272A26',
                  '-webkit-transition': 'background-color ease-out 0.5s',
                  '-moz-transition': 'background-color ease-out 0.5s',
                  '-o-transition': 'background-color ease-out 0.5s',
                  'transition': 'background-color ease-out 0.5s'
                })
              }, 450)
                label_y = central_ver_position
                label_x = central_position;
                break;
          }

          x_from = label_x + label_width/2;
          y_from = (data.center_y > label_y + label_height/2) ? label_y + label_height : label_y;
          // if data center out of window y scale
          if(data.center_y < 0) {
            y_to = 20
          }
          else if ( data.center_y > window.innerHeight + 20 ) {
            y_to = window.innerHeight - 20
          };

          // if element at the same position as hint
          if(data.center_y >= label_y && data.center_y <= label_y + label_height) {
            x_from = data.center_x > label_x ? label_x + label_width : label_x;
            y_from = data.center_y;
          }

          that.renderLabel({
            x: label_x,
            y: label_y,
            text: data.text
          });

          setTimeout(function(){
            var summoryButtonWidth = that.$next_btn.width() + that.$skip_btn.width() + that.$prev_btn.width() + 30;
            var distance = label_x - 100;
            var ver_button_position = label_y + label_height + 40
            
            if (summoryButtonWidth + label_x > x_to) {
            distance = x_to >= x_from ? x_to + 20 : label_x + label_width/2
            }
              
            if (summoryButtonWidth + distance > window.innerWidth || distance < 0) {
              distance = 10;
              ver_button_position = y_from < y_to ? label_y - 80 : label_y + label_height + 40
            }

            var initial_distance = distance;
            var initial_ver_position = ver_button_position;

            if (window.innerWidth <= 640) {
              distance = 10;
              ver_button_position = 10;
              that.$next_btn.html('&#8250;');
              that.$prev_btn.html('&#8249;');
            }
            else {
              distance = initial_distance;
              ver_button_position = initial_ver_position;
			  that.$next_btn.html(customBtnProps.nextButton && customBtnProps.nextButton.text ? 
					customBtnProps.nextButton.text : 'Next');
			  that.$prev_btn.html(customBtnProps.prevButton && customBtnProps.prevButton.text ? 
					customBtnProps.prevButton.text : 'Previous');
            }

            that.$prev_btn.css({
              left: distance,
              top: ver_button_position
            });

            var left_next = distance + that.$prev_btn.width() + 10;
            var left_skip = distance + that.$prev_btn.width() + that.$next_btn.width() + 20;

            if (that.nextBtn === "hide") {
              left_skip = distance + that.$prev_btn.width() + 10;
            }

            if(that.prevBtn === "hide") {
              left_next = distance;
              left_skip = distance + that.$next_btn.width() + 10;
            }

            that.$next_btn.css({
              left: left_next,
              top: ver_button_position
            })

            that.$skip_btn.css({
              left: left_skip,
              top: ver_button_position
            });
          }, 0)

          that.$close_btn.css({
            right: 10,
            top: 10
          });

          that.disableEventsNearRect({
            top: shape_data.top,
            bottom: shape_data.bottom,
            left: shape_data.left,
            right: shape_data.right
          });

          that.renderArrow({
            x_from: x_from,
            y_from: y_from,
            x_to: x_to,
            y_to: y_to,
            by_top_side: by_top_side,
          });
        };

        that.clear = function() {
          that.ctx.clearRect(0, 0, 3000, 2000);
        };

        return this;
      });
    },

    set: function(val) {
      this.each(function() {
        this.enjoyhint_obj.setValue(val);
      });

      return this;
    },

    show: function() {
      this.each(function() {
        this.enjoyhint_obj.show();
      });

      return this;
    },

    hide: function() {
      this.each(function() {
        this.enjoyhint_obj.hide();
      });

      return this;
    },

    hide_next: function() {
      this.each(function() {
        this.enjoyhint_obj.hideNextBtn();
      });

      return this;
    },

    hide_prev: function() {
      this.each(function() {
        this.enjoyhint_obj.hidePrevBtn();
      });

      return this;
    },

    show_prev: function() {
      this.each(function() {
        this.enjoyhint_obj.showPrevBtn();
      });

      return this;
    },

    show_next: function() {
      this.each(function() {
        this.enjoyhint_obj.showNextBtn();
      });

      return this;
    },

    hide_skip: function() {
      this.each(function() {
        this.enjoyhint_obj.hideSkipBtn();
      });

      return this;
    },

    show_skip: function() {
      this.each(function() {
        this.enjoyhint_obj.showSkipBtn();
      });

      return this;
    },

    render_circle: function(x, y, r) {
      this.each(function() {
        this.enjoyhint_obj.renderCircle(x, y, r);
      });

      return this;
    },

    render_label: function(x, y, r) {
      this.each(function() {
        this.enjoyhint_obj.renderLabel(x, y, r);
      });

      return this;
    },

    render_label_with_shape: function(data, stopFunction, customBtnProps) {
      this.each(function() {
        that.stopFunction = stopFunction;
        this.enjoyhint_obj.renderLabelWithShape(data, customBtnProps);
      });

      return this;
    },

    redo_events_near_rect: function(rect) {
      that.disableEventsNearRect({
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      });
    },

    clear: function() {
      this.each(function() {
        this.enjoyhint_obj.clear();
      });

      return this;
    },

    close: function(val) {
      this.each(function() {
        this.enjoyhint_obj.closePopdown();
      });

      return this;
    }
  };

  $.fn.enjoyhint = function(method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + method + " does not exist on $.numinput");
    }

    return this;
  };
});

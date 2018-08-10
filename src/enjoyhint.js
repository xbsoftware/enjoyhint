var EnjoyHint = function (_options) {

    var $event_element;
    var that = this;

    var defaults = {

        onStart: function () {

        },

        onEnd: function () {

        },

        onSkip: function () {

        },

        onNext: function () {

        },

        container: 'body',

        animation_time: 800
    };

    var options = $.extend(defaults, _options);
    var data = [];
    var current_step = 0;

    $body = $(options.container);


    /********************* PRIVATE METHODS ***************************************/

    var init = function () {

        if ($('.enjoyhint')) {

            $('.enjoyhint').remove();
        }

        $body.enjoyhint({

            onNextClick: function () {

                nextStep();
            },

            onSkipClick: function () {

                options.onSkip();
                skipAll();
            },

            animation_time: options.animation_time
        });
    };

    var lockTouch = function(e) {

        e.preventDefault();
    };

    var destroyEnjoy = function () {
        options.onEnd();
        $body.enjoyhint('clear');
        $body.enjoyhint('hide');
        $body.css({'overflow':'auto'});
        $(document).off("touchmove", lockTouch);
    };

    that.clear = function(){

        var $nextBtn = $('.enjoyhint_next_btn');
        var $skipBtn = $('.enjoyhint_skip_btn');

        $nextBtn.removeClass(that.nextUserClass);
        $nextBtn.text("Next");
        $skipBtn.removeClass(that.skipUserClass);
        $skipBtn.text("Skip");
    };

    var stepAction = function () {

        if (!(data && data[current_step])) {
            destroyEnjoy();
            return;
        }

        options.onNext();

        var $enjoyhint = $('.enjoyhint');

        $enjoyhint.removeClass("enjoyhint-step-" + current_step);
        $enjoyhint.removeClass("enjoyhint-step-" + (current_step + 1));
        $enjoyhint.addClass("enjoyhint-step-" + (current_step + 1));

        var step_data = data[current_step];

        if (step_data.onBeforeStart && typeof step_data.onBeforeStart === 'function') {

            step_data.onBeforeStart();
        }

        var timeout = step_data.timeout || 0;

        setTimeout(function () {

            if (!step_data.selector) {

                for (var prop in step_data) {

                    if (step_data.hasOwnProperty(prop) && prop.split(" ")[1]) {

                        step_data.selector = prop.split(" ")[1];
                        var tempEvent = prop.split(" ")[0];

                        if (tempEvent === 'next' || tempEvent === 'auto' || tempEvent === 'custom') {

                            step_data.event_type = tempEvent;
                        } else {
                            step_data.event = tempEvent;
                        }

                        step_data.description = step_data[prop];
                    }
                }
            }

            setTimeout(function () {

                that.clear();
            }, 250);

            $body.scrollTo(step_data.selector, step_data.scrollAnimationSpeed || 250, {offset: -100});

            setTimeout(function () {

                var $element = $(step_data.selector);
                var event = makeEventName(step_data.event);

                $body.enjoyhint('show');
                $body.enjoyhint('hide_next');
                $event_element = $element;

                if (step_data.event_selector) {

                    $event_element = $(step_data.event_selector);
                }

                if (!step_data.event_type && step_data.event == "key") {

                    $element.keydown(function (event) {

                        if (event.which == step_data.keyCode) {

                            current_step++;
                            stepAction();
                        }
                    });
                }

                if (step_data.showNext == true) {

                    $body.enjoyhint('show_next');
                }

                if (step_data.showSkip == false) {

                    $body.enjoyhint('hide_skip');
                } else {

                    $body.enjoyhint('show_skip');
                }

                if (step_data.showSkip == true) {

                }

                if (step_data.nextButton) {

                    var $nextBtn = $('.enjoyhint_next_btn');

                    $nextBtn.addClass(step_data.nextButton.className || "");
                    $nextBtn.text(step_data.nextButton.text || "Next");
                    that.nextUserClass = step_data.nextButton.className;
                }

                if (step_data.skipButton) {

                    var $skipBtn = $('.enjoyhint_skip_btn');

                    $skipBtn.addClass(step_data.skipButton.className || "");
                    $skipBtn.text(step_data.skipButton.text || "Skip");
                    that.skipUserClass = step_data.skipButton.className;
                }

                if (step_data.event_type) {

                    switch (step_data.event_type) {

                        case 'auto':

                            $element[step_data.event]();

                            switch (step_data.event) {

                                case 'click':
                                    break;
                            }

                            current_step++;
                            stepAction();

                            return;
                            break;

                        case 'custom':

                            on(step_data.event, function () {

                                current_step++;
                                off(step_data.event);
                                stepAction();
                            });

                            break;

                        case 'next':

                            $body.enjoyhint('show_next');
                            break;
                    }

                } else {

                    $event_element.on(event, function (e) {

                        if (step_data.keyCode && e.keyCode != step_data.keyCode) {

                            return;
                        }

                        current_step++;
                        $(this).off(event);

                        stepAction(); // clicked
                    });
                }

                var updateShapeData = function () {
                    $element = $(step_data.selector);

                    var rect = $element[0].getBoundingClientRect();
                    var w = rect.width;
                    var h = rect.height;
                    var max_habarites = Math.max(w, h);
                    var radius = step_data.radius || Math.round(max_habarites / 2) + 5;
                    var offset = $element.offset();
                    var shape_margin = (step_data.margin !== undefined) ? step_data.margin : 10;

                    var coords = {
                        x: offset.left + Math.round(w / 2),
                        y: offset.top + Math.round(h / 2) - $(document).scrollTop()
                    };

                    var shape_data = {
                        enjoyHintElementSelector: step_data.selector,
                        center_x: coords.x,
                        center_y: coords.y,
                        text: step_data.description,
                        top: step_data.top,
                        bottom: step_data.bottom,
                        left: step_data.left,
                        right: step_data.right,
                        margin: step_data.margin,
                        scroll: step_data.scroll
                    };

                    if (step_data.shape && step_data.shape == 'circle') {

                        shape_data.shape = 'circle';
                        shape_data.radius = radius;
                    } else {

                        shape_data.radius = 0;
                        shape_data.width = w + shape_margin;
                        shape_data.height = h + shape_margin;
                    }
                    return shape_data;
                };
                var _shape_data = updateShapeData();

                $body.enjoyhint('render_label_with_shape', _shape_data, that.stop, updateShapeData);

                if (step_data.event == "next") {

                    $body.enjoyhint('disable_element_events');
                }
            }, step_data.scrollAnimationSpeed + 20 || 270);
        }, timeout);
    };

    var nextStep = function() {
        current_step++;
        stepAction();
    };

    var skipAll = function() {
       stopRunningStep();
       destroyEnjoy();
    };

    var stopRunningStep = function() {
       var step_data = data[current_step];
       var $element = $(step_data.selector);

       off(step_data.event);
       $element.off(makeEventName(step_data.event));
       $element.off(makeEventName(step_data.event), true);
    };

    var makeEventName = function (name, is_custom) {

        return name + (is_custom ? 'custom' : '') + '.enjoy_hint';
    };

    var on = function (event_name, callback) {

        $body.on(makeEventName(event_name, true), callback);
    };

    var off = function (event_name) {

        $body.off(makeEventName(event_name, true));
    };


    /********************* PUBLIC METHODS ***************************************/

    $(window).on('resize.enjoy_hint_permanent', function() {

        if ($event_element[0]) {
            $body.enjoyhint('redo_events_near_rect', $event_element[0].getBoundingClientRect());
        }
    });

    that.stop = function() {

        skipAll();
    };

    that.reRunScript = function(cs) {
        stopRunningStep();
        current_step = cs;
        stepAction();
    };

    that.runScript = function () {
        $body.css({'overflow':'hidden'});
        $(document).on("touchmove",lockTouch);

        current_step = 0;
        options.onStart();
        stepAction();
    };

    that.resumeScript = function () {

        stepAction();
    };

    that.setCurrentStep = function(cs) {

        current_step = cs;
    };

    that.getCurrentStep = function () {

        return current_step;
    };

    that.trigger = function (event_name) {

        switch (event_name) {

            case 'next':

                nextStep();
                break;

            case 'skip':

                skipAll();
                break;

            // Trigger a custom event
            default:
                $body.trigger(makeEventName(event_name, true));
                break;
        }
    };

    that.setScript = function (_data) {

        if (_data) {

            data = _data;
        }
    };

    // Goes to the most recent valid user triggered step
    that.previousStep = function () {
        current_step--;

        // If the element of this step is no longer visible (like a modal, or a different tab) we want to keep going back.
        while (current_step > 0 && (data[current_step].event_type === "auto" || $(data[current_step].selector).is(':visible') === false)) {
            current_step--;
        }

        if (current_step <= 0) {
            current_step = 0;
        }

        that.reRunScript(current_step);
    };

    //support deprecated API methods
    that.set = function (_data) {

        that.setScript(_data);
    };

    that.setSteps = function (_data) {

        that.setScript(_data);
    };

    that.run = function () {

        that.runScript();
    };

    that.resume = function () {

        that.resumeScript();
    };

    init();
};

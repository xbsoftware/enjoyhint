var EnjoyHint = function (_options) {
    var that = this;
    // Some options
    var defaults = {
        onStart: function () {

        },
        onEnd: function () {

        },
        onSkip: function () {

        }
    };
    var options = $.extend(defaults, _options);


    var data = [];
    var current_step = 0;

    $body = $('body');

    /********************* PRIVAT METHODS ***************************************/
    var init = function () {
        if ($('.enjoyhint'))
            $('.enjoyhint').remove();
        $('body').css({'overflow':'hidden'});
        $(document).on("touchmove",lockTouch);

        $body.enjoyhint({
            onNextClick: function () {
                nextStep();
            },
            onSkipClick: function () {
                skipAll();
            }
        });
    };

    var lockTouch = function(e) {
        e.preventDefault();
    };

    var destroyEnjoy = function () {
        $body = $('body');
        $('.enjoyhint').remove();
        $("body").css({'overflow':'auto'});
        $(document).off("touchmove", lockTouch);

    };

    that.clear = function(){
        //(Remove userClass and set default text)
        $(".enjoyhint_next_btn").removeClass(that.nextUserClass);
        $(".enjoyhint_next_btn").text("Next");
        $(".enjoyhint_skip_btn").removeClass(that.skipUserClass);
        $(".enjoyhint_skip_btn").text("Skip");
    }

    var $body = $('body');

    var stepAction = function () {
        if (data && data[current_step]) {
            $(".enjoyhint").removeClass("enjoyhint-step-"+current_step);
            $(".enjoyhint").addClass("enjoyhint-step-"+(current_step+1));
            var step_data = data[current_step];
            if (step_data.onBeforeStart && typeof step_data.onBeforeStart === 'function') {
                step_data.onBeforeStart();
            }
            var timeout = step_data.timeout || 0;
            setTimeout(function () {
                if (!step_data.selector) {
                    for (var prop in step_data) {
                        if (step_data.hasOwnProperty(prop) && prop.split(" ")[1]) {
                            var space_index = prop.indexOf(" ");
                            step_data.event = prop.slice(0, space_index);
                            step_data.selector = prop.slice(space_index + 1);
                            if (step_data.event == 'next' || step_data.event == 'auto' || step_data.event == 'custom') {
                                step_data.event_type = step_data.event;
                            }
                            step_data.description = step_data[prop];
                        }
                    }
                }
                setTimeout(function(){
                    that.clear();
                }, 250);
                $(document.body).scrollTo(step_data.selector, step_data.scrollAnimationSpeed || 250, {offset: -100});
                setTimeout(function () {
                    var $element = $(step_data.selector);
                    var event = makeEventName(step_data.event);

                    $body.enjoyhint('show');
                    $body.enjoyhint('hide_next');
                    var $event_element = $element;
                    if (step_data.event_selector) {
                        $event_element = $(step_data.event_selector);
                    }
                    if (!step_data.event_type && step_data.event == "key"){
                        $element.keydown(function( event ) {
                            if ( event.which == step_data.keyCode ) {
                                current_step++;
                                stepAction();
                            }
                        });
                    }
                    if (step_data.showNext == true){
                        $body.enjoyhint('show_next');
                    }
                    if (step_data.showSkip == false){
                        $body.enjoyhint('hide_skip');
                    }else{
                        $body.enjoyhint('show_skip');
                    }
                    if (step_data.showSkip == true){

                    }


                    if (step_data.nextButton){
                        $(".enjoyhint_next_btn").addClass(step_data.nextButton.className || "");
                        $(".enjoyhint_next_btn").text(step_data.nextButton.text || "Next");
                        that.nextUserClass = step_data.nextButton.className
                    }

                    if (step_data.skipButton){
                        $(".enjoyhint_skip_btn").addClass(step_data.skipButton.className || "");
                        $(".enjoyhint_skip_btn").text(step_data.skipButton.text || "Skip");
                        that.skipUserClass = step_data.skipButton.className
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
                        $body.on(event, step_data.event_selector || step_data.selector, function (e) {
                            if (step_data.keyCode && e.keyCode != step_data.keyCode) {
                                return;
                            }
                            current_step++;
                            $(this).off(event);

                            stepAction();
                        });

                    }
                    var max_habarites = Math.max($element.outerWidth(), $element.outerHeight());
                    var radius = step_data.radius  || Math.round(max_habarites / 2) + 5;
                    var offset = $element.offset();
                    var w = $element.outerWidth();
                    var h = $element.outerHeight();
                    var shape_margin = (step_data.margin !== undefined) ? step_data.margin : 10;
                    var coords = {
                        x: offset.left + Math.round(w / 2) ,
                        y: offset.top + Math.round(h / 2)  - $(document).scrollTop()
                    };
                    var shape_data = {
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
                    $body.enjoyhint('render_label_with_shape', shape_data);
                }, step_data.scrollAnimationSpeed + 20 || 270);
            }, timeout);
        } else {
            $body.enjoyhint('hide');
            options.onEnd();
            destroyEnjoy();
        }

    };

    var nextStep = function(){
        current_step++;
        stepAction();
    };
    var skipAll = function(){
        var step_data = data[current_step];
        var $element = $(step_data.selector);
        off(step_data.event);
        $element.off(makeEventName(step_data.event));
        options.onSkip();
        destroyEnjoy();
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
    that.runScript = function () {
        current_step = 0;
        options.onStart();
        stepAction();
    };

    that.resumeScript = function () {
        stepAction();
    };

    that.getCurrentStep = function () {
        return current_step;
    };

    that.trigger = function (event_name) {
        switch (event_name) {
            case 'next':
                nextStep();
                break
            case 'skip':
                skipAll();
                break
            default:
                nextStep();
                break
        }
    };

    that.setScript = function (_data) {
        if (_data) {
            data = _data;
        }
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
;CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
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

(function ($) {
    var methods = {
        init: function (options) {
            return this.each(function () {
                var defaults = {
                    onNextClick: function () {
                    },
                    onSkipClick: function () {
                    },
                    animation_time: 800
                };


                this.enjoyhint_obj = {};
                var that = this.enjoyhint_obj;
                var $that = $(this);
                var $body = $('body');
                that.options = jQuery.extend(defaults, options);

                //general classes
                that.gcl = {
                    chooser: 'enjoyhint'
                };

                // classes
                that.cl = {
                    enjoy_hint: 'enjoyhint',
                    hide: 'enjoyhint_hide',
                    disable_events_element: 'enjoyhint_disable_events',
                    btn: 'enjoyhint_btn',
                    skip_btn: 'enjoyhint_skip_btn',
                    close_btn: 'enjoyhint_close_btn',
                    next_btn: 'enjoyhint_next_btn',
                    main_canvas: 'enjoyhint_canvas',
                    main_svg: 'enjoyhint_svg',
                    svg_wrapper: 'enjoyhint_svg_wrapper',
                    svg_transparent: 'enjoyhint_svg_transparent',
                    kinetic_container: 'kinetic_container'
                };
                function makeSVG(tag, attrs) {
                    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                    for (var k in attrs)
                        el.setAttribute(k, attrs[k]);
                    return el;
                }

                // =======================================================================
                // ========================---- enjoyhint ----==============================
                // =======================================================================
                that.canvas_size = {
                    w: $(window).width()*1.4,
                    h: $(window).height()*1.4
                };
                var canvas_id = "enj_canvas";

                that.enjoyhint = $('<div>', {'class': that.cl.enjoy_hint + ' ' + that.cl.svg_transparent}).appendTo($that);
                that.enjoyhint_svg_wrapper = $('<div>', {'class': that.cl.svg_wrapper + ' ' + that.cl.svg_transparent}).appendTo(that.enjoyhint);
                that.$stage_container = $('<div id="' + that.cl.kinetic_container + '">').appendTo(that.enjoyhint);
                that.$canvas = $('<canvas id="' + canvas_id + '" width="' + that.canvas_size.w + '" height="' + that.canvas_size.h + '" class="' + that.cl.main_canvas + '">').appendTo(that.enjoyhint);
                that.$svg = $('<svg width="' + that.canvas_size.w + '" height="' + that.canvas_size.h + '" class="' + that.cl.main_canvas + ' ' + that.cl.main_svg + '">').appendTo(that.enjoyhint_svg_wrapper);
                var defs = $(makeSVG('defs'));
                var marker = $(makeSVG('marker', {id: "arrowMarker", viewBox: "0 0 36 21", refX: "21", refY: "10", markerUnits: "strokeWidth", orient: "auto", markerWidth: "16", markerHeight: "12"}));
                var polilyne = $(makeSVG('path', {style: "fill:none; stroke:rgb(255,255,255); stroke-width:2", d: "M0,0 c30,11 30,9 0,20"}));
                defs.append(marker.append(polilyne)).appendTo(that.$svg);
                that.kinetic_stage = new Kinetic.Stage({
                    container: that.cl.kinetic_container,
                    width: that.canvas_size.w,
                    height: that.canvas_size.h
                });

                that.layer = new Kinetic.Layer();
                that.rect = new Kinetic.Rect({
//          x: 0,
//          y: 0,
                    fill: 'rgba(0,0,0,0.6)',
                    width: that.canvas_size.w,
                    height: that.canvas_size.h
                });

                var $top_dis_events = $('<div>', {'class': that.cl.disable_events_element}).appendTo(that.enjoyhint);
                var $bottom_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
                var $left_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
                var $right_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);

                that.$skip_btn = $('<div>', {'class': that.cl.skip_btn}).appendTo(that.enjoyhint).html('Skip').click(function (e) {
                    that.hide();
                    that.options.onSkipClick();
                });
                that.$next_btn = $('<div>', {'class': that.cl.next_btn}).appendTo(that.enjoyhint).html('Next').click(function (e) {
                    that.options.onNextClick();
                });

                that.$close_btn = $('<div>', {'class': that.cl.close_btn}).appendTo(that.enjoyhint).html('').click(function (e){
                    that.hide();
                    that.options.onSkipClick();
                });

                that.$canvas.mousedown(function (e) {
                    $('canvas').css({left: '4000px'});

                    var BottomElement = document.elementFromPoint(e.clientX, e.clientY);
                    $('canvas').css({left: '0px'});

                    $(BottomElement).click();
//          that.$canvas.show();
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
                    sceneFunc: function (context) {
                        var ctx = this.getContext("2d")._context;
                        var pos = this.pos;
                        var def_comp = ctx.globalCompositeOperation;
                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.beginPath();

                        var x = this.attrs.center_x - Math.round(this.attrs.width / 2);
                        var y = this.attrs.center_y - Math.round(this.attrs.height / 2);
                        ctx.roundRect(x, y, this.attrs.width, this.attrs.height, this.attrs.radius);
                        ctx.fillStyle = "red";
                        ctx.fill();

                        ctx.globalCompositeOperation = def_comp;
                    }
                });
                that.shape.radius = circle_r;
                that.layer.add(that.rect);
                that.layer.add(that.shape);
                that.kinetic_stage.add(that.layer);

                var enjoyhint_elements = [
                    that.enjoyhint,
                    $top_dis_events,
                    $bottom_dis_events,
                    $left_dis_events,
                    $right_dis_events
                ];

                that.show = function () {
                    that.enjoyhint.removeClass(that.cl.hide);
                };

                that.hide = function () {
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

                that.hideNextBtn = function () {
                    that.$next_btn.addClass(that.cl.hide);
                    that.nextBtn = "hide";
                };
                that.showNextBtn = function () {
                    that.$next_btn.removeClass(that.cl.hide);
                    that.nextBtn = "show";
                };

                that.hideSkipBtn = function () {
                    that.$skip_btn.addClass(that.cl.hide);
                };
                that.showSkipBtn = function () {
                    that.$skip_btn.removeClass(that.cl.hide);
                };





                that.renderCircle = function (data) {
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


                that.renderRect = function (data) {
                    var r = data.r || 0;
                    var x = data.x || 0;
                    var y = data.y || 0;
                    var w = data.w || 0;
                    var h = data.h || 0;
                    var margin = 20;
                    var tween = new Kinetic.Tween({
                        node: that.shape,
                        duration: 0.2,
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
                that.renderLabel = function (data) {
                    var x = data.x || 0;
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
                    var label_top = label.offset().top - $(document).scrollTop();;
                    var label_bottom = label.offset().top + label_h;

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
                    setTimeout(function () {
                        $('#enjoyhint_label').remove();
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
                that.renderArrow = function (data) {
                    var x_from = data.x_from || 0;
                    var y_from = data.y_from || 0;
                    var x_to = data.x_to || 0;
                    var y_to = data.y_to || 0;
                    var by_top_side = data.by_top_side;
                    var control_point_x = 0;
                    var control_point_y = 0;
                    if (by_top_side) {
                        if (y_from >= y_to) {
                            control_point_y = y_to;
                            control_point_x = x_from;
                        } else {
                            control_point_y = y_from;
                            control_point_x = x_to;
                        }
                    } else {
                        if (y_from >= y_to) {
                            control_point_y = y_from;
                            control_point_x = x_to;
                        } else {
                            control_point_y = y_to;
                            control_point_x = x_from;
                        }
                    }

                    var text = data.text || '';
                    that.enjoyhint.addClass(that.cl.svg_transparent);
                    setTimeout(function () {
                        $('#enjoyhint_arrpw_line').remove();
                        var d = 'M' + x_from + ',' + y_from + ' Q' + control_point_x + ',' + control_point_y + ' ' + x_to + ',' + y_to;
                        that.$svg.append(makeSVG('path', {style: "fill:none; stroke:rgb(255,255,255); stroke-width:3", 'marker-end': "url(#arrowMarker)", d: d, id: 'enjoyhint_arrpw_line'}));
                        that.enjoyhint.removeClass(that.cl.svg_transparent);

                    }, that.options.animation_time / 2);
                };


                that.getLabelElement = function (data) {
                    return $('<div>', {"class": 'enjoy_hint_label', id: 'enjoyhint_label'})
                        .css({
                            'top': data.y + 'px',
                            'left': data.x + 'px'
                        })
                        .html(data.text).appendTo(that.enjoyhint);

                };


                that.disableEventsNearRect = function (rect) {
                    $top_dis_events.css({
                        top: '0',
                        left: '0'
                    }).height(rect.top);
                    $bottom_dis_events.css({
                        top: rect.bottom + 'px',
                        left: '0'
                    });
                    $left_dis_events.css({
                        top: '0',
                        left: 0 + 'px'
                    }).width(rect.left);
                    $right_dis_events.css({
                        top: '0',
                        left: rect.right + 'px'
                    });
                };


                that.renderLabelWithShape = function (data) {
                    var shape_type = data.shape || 'rect';
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
                        case 'circle':
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
                        case 'rect':
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
                            shape_data = that.renderRect({
                                x: data.center_x,
                                y: data.center_y,
                                w: data.width,
                                h: data.height,
                                r: data.radius,
                            });
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

                    var label_hor_side = (body_size.w - data.center_x) < data.center_x ? 'left' : 'right';
                    var label_ver_side = (body_size.h - data.center_y) < data.center_y ? 'top' : 'bottom';
                    var label_shift = 150;
                    var label_margin = 40;
                    var label_shift_with_label_width = label_shift + label_width + label_margin;
                    var label_shift_with_label_height = label_shift + label_height + label_margin;
                    var label_hor_offset = half_w + label_shift;
                    var label_ver_offset = half_h + label_shift;

                    var label_x = (label_hor_side == 'left') ? data.center_x - label_hor_offset - label_width : data.center_x + label_hor_offset;
                    var label_y = (label_ver_side == 'top') ? data.center_y - label_ver_offset - label_height : data.center_y + label_ver_offset;
                    if (top_offset < label_shift_with_label_height && bottom_offset < label_shift_with_label_height) {
                        label_y = data.center_y + label_margin;
                    }
                    if (left_offset < label_shift_with_label_width && right_offset < label_shift_with_label_width) {
                        label_x = data.center_x;
                    }

                    var label_data = that.renderLabel({
                        x: label_x,
                        y: label_y,
                        text: data.text
                    });

                    that.$next_btn.css({
                        left: label_x,
                        top: label_y + label_height + 20
                    });
                    var left_skip = label_x + that.$next_btn.width() + 10;
                    if (that.nextBtn == "hide"){
                        left_skip = label_x;
                    }

                    that.$skip_btn.css({
                        left: left_skip,
                        top: label_y + label_height + 20
                    });
                    that.$close_btn.css({
                        right : 10,
                        top: 10
                    });


                    that.disableEventsNearRect({
                        top: shape_data.top,
                        bottom: shape_data.bottom,
                        left: shape_data.left,
                        right: shape_data.right
                    });


                    var x_to = 0;
                    var y_to = 0;
                    var arrow_side = false;
                    var conn_label_side = 'left';
                    var conn_circle_side = 'left';

                    var is_center = (label_data.left <= shape_data.x && label_data.right >= shape_data.x);
                    var is_left = (label_data.right < shape_data.x);
                    var is_right = (label_data.left > shape_data.x);

                    var is_abs_left = (label_data.right < shape_data.left);
                    var is_abs_right = (label_data.left > shape_data.right);

                    var is_top = (label_data.bottom < shape_data.top);
                    var is_bottom = (label_data.top > shape_data.bottom);
                    var is_mid = (label_data.bottom >= shape_data.y && label_data.top <= shape_data.y);
                    var is_mid_top = (label_data.bottom <= shape_data.y && !is_top);
                    var is_mid_bottom = (label_data.top >= shape_data.y && !is_bottom);


                    function setArrowData(l_s, c_s, a_s) {
                        conn_label_side = l_s;
                        conn_circle_side = c_s;
                        arrow_side = a_s;
                    }

                    function sideStatements(top_s, mid_top_s, mid_s, mid_bottom_s, bottom_s) {
                        var statement = [];
                        if (is_top) {
                            statement = top_s;
                        } else if (is_mid_top) {
                            statement = mid_top_s;
                        } else if (is_mid) {
                            statement = mid_s;
                        } else if (is_mid_bottom) {
                            statement = mid_bottom_s;
                        } else {//bottom
                            statement = bottom_s;
                        }
                        if (!statement) {
                            return;
                        } else {
                            setArrowData(statement[0], statement[1], statement[2]);
                        }
                    }


                    if (is_center) {
                        if (is_top) {
                            setArrowData('bottom', 'top', 'top');
                        } else if (is_bottom) {
                            setArrowData('top', 'bottom', 'bottom');
                        } else {
                            return;
                        }
                    } else if (is_left) {
                        sideStatements(
                            ['right', 'top', 'top'],//top
                            ['bottom', 'left', 'bottom'],//mid_top
                            ['right', 'left', 'top'],//mid
                            ['top', 'left', 'top'],//mid_bot
                            ['right', 'bottom', 'bottom']//bot
                        );
                    } else {//right
                        sideStatements(
                            ['left', 'top', 'top'],//top
                            ['bottom', 'right', 'bottom'],//mid_top
                            ['left', 'right', 'top'],//mid
                            ['top', 'right', 'top'],//mid_bot
                            ['left', 'bottom', 'bottom']//bot
                        );
                    }

                    var label_conn_coordinates = label_data.conn[conn_label_side];
                    var circle_conn_coordinates = shape_data.conn[conn_circle_side];
                    var by_top_side = (arrow_side == 'top') ? true : false;
                    that.renderArrow({
                        x_from: label_conn_coordinates.x,
                        y_from: label_conn_coordinates.y,
                        x_to: circle_conn_coordinates.x,
                        y_to: circle_conn_coordinates.y,
                        by_top_side: by_top_side
                    });

                };

                that.clear = function () {
                    that.ctx.clearRect(0, 0, 3000, 2000);
                };

                return this;
            });
        },

        set: function (val) {
            this.each(function () {
                this.enjoyhint_obj.setValue(val);
            });
            return this;
        },

        show: function () {
            this.each(function () {
                this.enjoyhint_obj.show();
            });
            return this;
        },

        hide: function () {
            this.each(function () {
                this.enjoyhint_obj.hide();
            });
            return this;
        },

        hide_next: function () {
            this.each(function () {
                this.enjoyhint_obj.hideNextBtn();
            });
            return this;
        },

        show_next: function () {
            this.each(function () {
                this.enjoyhint_obj.showNextBtn();
            });
            return this;
        },

        hide_skip: function () {
            this.each(function () {
                this.enjoyhint_obj.hideSkipBtn();
            });
            return this;
        },

        show_skip: function () {
            this.each(function () {
                this.enjoyhint_obj.showSkipBtn();
            });
            return this;
        },

        render_circle: function (x, y, r) {
            this.each(function () {
                this.enjoyhint_obj.renderCircle(x, y, r);
            });
            return this;
        },

        render_label: function (x, y, r) {
            this.each(function () {
                this.enjoyhint_obj.renderLabel(x, y, r);
            });
            return this;
        },

        render_label_with_shape: function (data) {
            this.each(function () {
                this.enjoyhint_obj.renderLabelWithShape(data);
            });
            return this;
        },

        clear: function () {
            this.each(function () {
                this.enjoyhint_obj.clear();
            });
            return this;
        },

        close: function (val) {
            this.each(function () {
                this.enjoyhint_obj.closePopdown();
            });
            return this;
        }
    };

    $.fn.enjoyhint = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.numinput');
        }
        return this;
    };
})(window.jQuery);


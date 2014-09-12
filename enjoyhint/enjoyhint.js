var EnjoyHint = function(_options){
  var that = this;
  // Some options
  var defaults = {
    onStart:function(){
      
    },
    onEnd: function(){
      
    }
  };
  var options = $.extend(defaults,_options);
  
  
  var data = [];
  var current_step = 0;
  
  $body = $('body');
  
  /********************* PRIVAT METHODS ***************************************/
  var init = function(){
    $body.enjoyhint({
      onNextClick:function(){
        current_step++;
        stepAction();
      },
      onSkipClick:function(){
        var step_data = data[current_step];
        var $element = $(step_data.selector);
        off(step_data.event);
        $element.off(makeEventName(step_data.event));
      }
    });
  };
  
  var $body = $('body');
  var stepAction = function(){
    
    if(data && data[current_step]){
      var step_data = data[current_step];
      if(step_data.onBeforeStart && typeof step_data.onBeforeStart === 'function'){
        step_data.onBeforeStart();
      }
      var timeout = step_data.timeout||0;
      setTimeout(function(){
        var $element = $(step_data.selector);
        var event = makeEventName(step_data.event);
        
        $body.enjoyhint('show');
        $body.enjoyhint('hide_next');
        var $event_element = $element;
        if(step_data.event_selector){
          $event_element = $(step_data.event_selector);
        }
        if(step_data.event_type){
          switch(step_data.event_type){
            case 'auto':
              $element[step_data.event]();
              switch(step_data.event){
                case 'click':
                  break;
              }
              current_step++;
              stepAction();
              return;
              break;
            case 'custom':
              on(step_data.event, function(){
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
          $event_element.on(event, function(e){
            if(step_data.key_code && e.keyCode != step_data.key_code){
              return;
            }
            current_step++;
            $(this).off(event);
            
            stepAction();
          });
          
        }
        var max_habarites = Math.max($element.outerWidth(), $element.outerHeight());
        var radius = Math.round(max_habarites/2)+5;
        var offset = $element.offset();
        var w = $element.outerWidth();
        var h = $element.outerHeight();
        var shape_margin = (step_data.margin !== undefined)?step_data.margin:10;
        var coords = {
          x: offset.left + Math.round(w/2),
          y: offset.top + Math.round(h/2)
        };
        var shape_data = {
          center_x:coords.x,
          center_y:coords.y,
          text:step_data.description,
          top:step_data.top,
          bottom:step_data.bottom,
          left:step_data.left,
          right:step_data.right,
          margin:step_data.margin
        };
        
        if(step_data.shape && step_data.shape == 'circle'){
          shape_data.shape = 'circle';
          shape_data.radius = radius;
        } else {
          shape_data.radius = 0;
          shape_data.width = w+shape_margin;
          shape_data.height = h+shape_margin;
        }
        $body.enjoyhint('render_label_with_shape',shape_data);
        
      },timeout);
      
    } else {
      $body.enjoyhint('hide');
      options.onEnd();
    }
    
  };
  
  var makeEventName = function(name,is_custom){
    return name+(is_custom?'custom':'')+'.enjoy_hint';
  };
  
  var on = function(event_name, callback){
    $body.on(makeEventName(event_name,true),callback);
  };
  var off = function(event_name){
    $body.off(makeEventName(event_name,true));
  };
  
  /********************* PUBLIC METHODS ***************************************/
  that.runScript = function(){
    current_step = 0;
    options.onStart();
    stepAction();
  };
  
  that.resumeScript = function(){
    stepAction();
  };
  
  that.getCurrentStep = function(){
    return current_step;
  };
  

  that.trigger = function(event_name){
    $body.trigger(makeEventName(event_name,true));
  };
  
  that.setScript = function(_data){
    if(_data){
      data = _data;
    }
  };
  

  init();
};

/*!
* jQuery UI SmartTouch
*
* Copyright 2013, Mikhail Lyamin
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* Depends:
* jquery.ui.widget.js
* jquery.ui.mouse.js
*/

(function ($) 
{
 //Ignore browsers without touch support
 if (!('ontouchend' in document)) 
 {
  return;
 }
 
 //window.alert('process touch');
 
 //plugin states
 //0 - not touched
 //1 - touched but not processed
 //2 - started processing
 //3 - canceling processing
 var touch_state=0;
 
 //default delay=500ms
 var delay=500;
 
 //variable for setTimeout's result
 var timeout_var=null;
 
 //info about initial touch event
 var processed_event;
 
 var mouseProto = $.ui.mouse.prototype;
 var _mouseInit = mouseProto._mouseInit;
 
 
 mouseProto._touchStart = function (event) 
 {
  
  
  if (!this._mouseCapture(event.originalEvent.changedTouches[0]))
  {
   return;
  }
  
  //process first touch
  if (touch_state==0)
  {
   //start processing
   touch_state=1;
   prepareEvent(event);
  }
  //process second touch (pinch)
  else if (touch_state==1)
  {
   cancelProcessingEmpty();
   touch_state=0;
  }
  //do not process additional touches 
  else if (touch_state==2)
  {
   event.preventDefault();
  }
  //let all events pass
  else if (touch_state==3)
  {
   //do nothing;
  }
 }


 mouseProto._touchMove = function (event) 
 {
  //movement inside scroll or pinch - do not interfere
  if (touch_state==0)
  {
   //return;
  }
  //process scroll
  else if (touch_state==1)
  {
   cancelProcessingEmpty();
  }
  //movement during processing
  else if (touch_state==2)
  {
   event.preventDefault();
   throwEvent(event,'mousemove');
  }
  //let all events pass
  else if (touch_state==3)
  {
   //return;
  }
 } 
 
 mouseProto._touchEnd = function (event) 
 {
  if (!this._mouseCapture(event.originalEvent.changedTouches[0]))
  {
   return;
  }
  
  //end of scroll or pinch - do not interfere
  if (touch_state==0)
  { 
   //return;
  }
  //click without movement
  else if (touch_state==1)
  {
   cancelProcessingEmpty();
   throwEvent(processed_event,'mouseover');
   throwEvent(processed_event,'mousemove');
   throwEvent(processed_event,'mousedown');
   throwEvent(event,'mouseup');
   throwEvent(event,'mouseout');
   throwEvent(event,'mouseclick');
   touch_state=0;
  }
  //end movement
  else if (touch_state==2)
  {
   throwEvent(event,'mouseup');
   throwEvent(event,'mouseout');
   touch_state=0;
   event.preventDefault();
   //return;
  }
  //let all events pass
  else if (touch_state==3)
  {
   //return;
  }
 } 
 
 //start timer 
 function prepareEvent(event)
 {
  processed_event=event;
  timeout_var=setTimeout(function ()
  {
   touch_state=2;
   throwEvent(processed_event,'mouseover');
   throwEvent(processed_event,'mousedown');
   throwEvent(processed_event,'mousemove');
  },delay);
 }
 
 
 function cancelProcessingEmpty()
 {
  clearTimeout(timeout_var);
 }
 
 function throwEvent(event,type)
 {
  
  var touch = event.originalEvent.changedTouches[0];
  var simulatedEvent = document.createEvent('MouseEvents');
    
  // Initialize the simulated mouse event using the touch event's coordinates
  simulatedEvent.initMouseEvent
  (
   type,    // type
   true,             // bubbles                    
   true,             // cancelable                 
   window,           // view                       
   1,                // detail                     
   touch.screenX,    // screenX                    
   touch.screenY,    // screenY                    
   touch.clientX,    // clientX                    
   touch.clientY,    // clientY                    
   false,            // ctrlKey                    
   false,            // altKey                     
   false,            // shiftKey                   
   false,            // metaKey                    
   0,                // button                     
   null              // relatedTarget              
  );

  
  // Dispatch the simulated event to the target element
  event.target.dispatchEvent(simulatedEvent);
  
 }

 
 mouseProto._mouseInit = function () 
 {
    
  var self = this;

  // Delegate the touch handlers to the widget's element
  self.element
   .bind('touchstart', $.proxy(self, '_touchStart'))
   .bind('touchmove', $.proxy(self, '_touchMove'))
   .bind('touchend', $.proxy(self, '_touchEnd'));

  // Call the original $.ui.mouse init method
  _mouseInit.call(self);
 };


})(jQuery);
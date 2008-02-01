/**
 * The Render Engine
 * KeyboardInputComponent
 * 
 * A component which responds to keyboard events and notifies
 * a list of functions by passing the event to them.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2008 Brett Fattori (brettf@renderengine.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var KeyboardInputComponent = InputComponent.extend({

   downFn: null,
   
   upFn: null,
   
   pressFn: null,
   
   
   /**
    * Create an instance of a keyboard input component.
    *
    * @param name {String} The unique name of the component.
    * @param priority {Number} The priority of the component among other input components.
    */
   constructor: function(name, priority) {
      this.base(name, priority);
      
      this.downFn = function(eventObj) {
         eventObj.data[0]._keyDownListener(eventObj);
         return false;
      };
      
      this.upFn = function(eventObj) {
         eventObj.data[0]._keyUpListener(eventObj);
         return false;
      };
      
      this.pressFn = function(eventObj) {
         eventObj.data[0]._keyPressListener(eventObj);
         return false;
      };

      EventEngine.setHandler(document, [this], "keydown", this.downFn);
      EventEngine.setHandler(document, [this], "keyup", this.upFn);
      EventEngine.setHandler(document, [this], "keypress", this.pressFn);
   },
   
   /**
    * Destroy this instance and remove all references.
    */
   destroy: function() {
      EventEngine.clearHandler(document, "keydown", this.downFn);
      EventEngine.clearHandler(document, "keyup", this.upFn);
      EventEngine.clearHandler(document, "keypress", this.pressFn);
      this.notifyLists = null;
      this.downFn = null;
      this.upFn = null;
      this.pressFn = null;
      
      this.base();
   },
   
   /**
    * Add a recipient function for the event type specified.  The event
    * type should be one of: "keyDown", "keyUp", "keyPress".  The function
    * will be passed the event object as its only parameter.
    *
    * @param type {String} One of the three types.
    * @param fn {Function} The function to call when the event triggers.
    */
   addRecipient: function(type, thisObj, fn) {
      type = type.toLowerCase().replace(/key/,"");
      this.base(type, thisObj, fn);
   },

   /**
    * Remove a recipient function for the event type specified.  The event
    * type should be one of: "keyDown", "keyUp", "keyPress".
    *
    * @param type {String} One of the three types.
    * @param fn {Function} The function to remove from the notification list.
    */
   removeRecipient: function(type, thisObj, fn) {
      type = type.toLowerCase().replace(/key/,"");
      this.base(type, thisObj, fn);
   },
   
   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      this.notifyRecipients("down", eventObj);
   },
   
   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      this.notifyRecipients("up", eventObj);
   },
   
   /**
    * @private
    */
   _keyPressListener: function(eventObj) {
      this.notifyRecipients("press", eventObj);
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "KeyboardInputComponent";
   }

});
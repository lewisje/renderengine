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
   
   notifyLists: null,   
   
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
      };
      
      this.upFn = function(eventObj) {
         eventObj.data[0]._keyUpListener(eventObj);
      };
      
      this.pressFn = function(eventObj) {
         eventObj.data[0]._keyPressListener(eventObj);
      };

      EventEngine.setHandler(document, [this], "keydown", this.downFn);
      EventEngine.setHandler(document, [this], "keyup", this.upFn);
      EventEngine.setHandler(document, [this], "keypress", this.pressFn);
      this.notifyLists = { down: [], up: [], press: [] };
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
      this.notifyLists[type].push({parent: thisObj, func: fn});
   },
   
   /**
    * Remove a recipient function for the event type specified.  The event
    * type should be one of: "keyDown", "keyUp", "keyPress".
    *
    * @param type {String} One of the three types.
    * @param fn {Function} The function to remove from the notification list.
    */
   removeRecipient: function(type, thisObj, fn) {
      var o = {parent: thisObj, func: fn};
      type = type.toLowerCase().replace(/key/,"");
      var idx = -1;
      if (Array.prototype.indexof)
      {
         idx = this.notifyLists[type].indexOf(o);   
      }
      else
      {
         for (var i = 0; i < this.notifyLists[type].length; i++)
         {
            if (this.notifyLists[type][i] == o)
            {
               idx = i;
               break;
            }
         }
      }
      
      this.slice(idx, 1);
   },
   
   /**
    * Run through the list of recipients functions for the
    * event type specified.  Optimized for speed if the list
    * is large.
    * @private
    */
   _runList: function(type, eventObj) {
      // Using Duff's device with loop inversion
      var p = 0;
      var s = null;
      switch(this.notifyLists[type].length & 0x3)
      {
         case 3:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 2:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 1:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
      }
      
      if (p < this.notifyLists[type].length)
      {
         do
         {
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

         } while (p < this.notifyLists[type].length);
      }
   },
   
   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      this._runList("down", eventObj);
   },
   
   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      this._runList("up", eventObj);
   },
   
   /**
    * @private
    */
   _keyPressListener: function(eventObj) {
      this._runList("press", eventObj);
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
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
 
var KeyboardInputComponent = BaseComponent.extend({

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
      this.base(name, priority || 1.0);
      
      this.downFn = function(event, thisObj) {
         thisObj._keyDownListener(event);
      };
      
      this.upFn = function(event, thisObj) {
         thisObj._keyUpListener(event);
      };
      
      this.pressFn = function(event, thisObj) {
         thisObj._keyPressListener(event);
      };

      Events.setHandler(document, [this], "keydown", this.downFn);
      Events.setHandler(document, [this], "keyup", this.upFn);
      Events.setHandler(document, [this], "keypress", this.pressFn);
      this.notifyLists = { down: [], up: [], press: [] };
      
      this.base();
   },
   
   /**
    * Destroy this instance and remove all references.
    */
   destroy: function() {
      Events.clearHandler(document, "keydown", this.downFn);
      Events.clearHandler(document, "keyup", this.upFn);
      Events.clearHandler(document, "keypress", this.pressFn);
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
   addRecipient: function(type, fn) {
      type = type.toLowerCase().replace(/key/,"");
      this.notifyLists[type].push(fn);
   },
   
   /**
    * Remove a recipient function for the event type specified.  The event
    * type should be one of: "keyDown", "keyUp", "keyPress".
    *
    * @param type {String} One of the three types.
    * @param fn {Function} The function to remove from the notification list.
    */
   removeRecipient: function(type, fn) {
      type = type.toLowerCase().replace(/key/,"");
      var idx = -1;
      if (Array.prototype.indexof)
      {
         idx = this.notifyLists[type].indexOf(fn);   
      }
      else
      {
         for (var i = 0; i < this.notifyLists[type].length; i++)
         {
            if (this.notifyLists[type][i] === fn)
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
   _runList: function(type, event) {
      // Using Duff's device with loop inversion
      var p = 0;
      switch(this.notifyLists[type].length & 0x3)
      {
         case 3:
            this.notifyLists[type][p++](event);
         case 2:
            this.notifyLists[type][p++](event);
         case 1:
            this.notifyLists[type][p++](event);
      }
      
      if (p < this.notifyLists[type].length)
      {
         do
         {
            this.notifyLists[type][p++](event);
            this.notifyLists[type][p++](event);
            this.notifyLists[type][p++](event);
            this.notifyLists[type][p++](event);
         } while (p < this.notifyLists[type].length);
      }
   },
   
   /**
    * @private
    */
   _keyDownListener: function(event) {
      this._runList("down", event);
   },
   
   /**
    * @private
    */
   _keyUpListener: function(event) {
      this._runList("down", event);
   },
   
   /**
    * @private
    */
   _keyPressListener: function(event) {
      this._runList("down", event);
   }

});
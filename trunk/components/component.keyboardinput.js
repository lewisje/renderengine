/**
 * The Render Engine
 * KeyboardInputComponent
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

// Includes
Engine.include("/engine/engine.events.js");
Engine.include("/components/component.input.js");

Engine.initObject("KeyboardInputComponent", "InputComponent", function() {

/**
 * @class A component which responds to keyboard events and notifies
 * its host object by calling one of three methods.  The host object
 * should implement any of the following methods to receive the corresponding event:
 * <ul>
 * <li>onKeyDown - A key was pressed down</li>
 * <li>onKeyUp - A key was released</li>
 * <li>onKeyPress - A key was pressed and released</li>
 * </ul>
 *
 * @extends InputComponent
 */
var KeyboardInputComponent = InputComponent.extend(/** @scope KeyboardInputComponent.prototype */{

   downFn: null,

   upFn: null,

   pressFn: null,

   /**
    * Create an instance of a keyboard input component.
    *
    * @param name {String} The unique name of the component.
    * @param priority {Number} The priority of the component among other input components.
    * @constructor
    */
   constructor: function(name, priority) {
      this.base(name, priority);
   },

   release: function() {
      this.base();
      this.downFn = null;
      this.upFn = null;
      this.pressFn = null;
   },

   /**
    * Set the host object this component exists within.  Additionally, this
    * component sets up the event listeners.  Due to key events occurring
    * less often than mouse events, every component listening for them will
    * attach a listener.
    *
    * @param hostObject {HostObject} The object which hosts this component
    */
   setHostObject: function(hostObject) {
      this.base(hostObject);

      this.downFn = function(eventObj) {
         eventObj.data.owner._keyDownListener(eventObj);
         return false;
      };

      this.upFn = function(eventObj) {
         eventObj.data.owner._keyUpListener(eventObj);
         return false;
      };

      this.pressFn = function(eventObj) {
         eventObj.data.owner._keyPressListener(eventObj);
         return false;
      };

      var context = hostObject.getRenderContext();
      if (this.getHostObject().onKeyDown)
      {
			context.addEvent("keydown", {owner: this}, this.downFn);
      }

      if (this.getHostObject().onKeyUp)
      {
			context.addEvent("keyup", {owner: this}, this.upFn);
      }

      if (this.getHostObject().onKeyPress)
      {
			context.addEvent("keypress", {owner: this}, this.pressFn);
      }
   },

   /**
    * Destroy this instance and remove all references.
    */
   destroy: function() {
      var context = this.getHostObject().getRenderContext();
      if (this.getHostObject().onKeyDown)
      {
			context.removeEvent("keydown");
      }

      if (this.getHostObject().onKeyUp)
      {
			context.removeEvent("keyup");
      }

      if (this.getHostObject().onKeyPress)
      {
			context.removeEvent("keypress");
      }
      this.downFn = null;
      this.upFn = null;
      this.pressFn = null;

      this.base();
   },

   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      if (this.getHostObject().onKeyDown)
      {
         this.getHostObject().onKeyDown(eventObj);
      }
   },

   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      if (this.getHostObject().onKeyUp)
      {
         this.getHostObject().onKeyUp(eventObj);
      }
   },

   /**
    * @private
    */
   _keyPressListener: function(eventObj) {
      if (this.getHostObject().onKeyPress)
      {
         this.getHostObject().onKeyPress(eventObj);
      }
   }

}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf KeyboardInputComponent
    */
   getClassName: function() {
      return "KeyboardInputComponent";
   }
});

return KeyboardInputComponent;

});
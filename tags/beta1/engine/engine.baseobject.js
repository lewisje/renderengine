/**
 * The Render Engine
 * BaseObject
 *
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
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/engine/engine.events.js");

Engine.initObject("BaseObject", "PooledObject", function() {

/**
 * @class The base object class which represents an object within
 * the engine.  All objects should extend from this class mainly due to
 * the fact that the object intelligently will inherit a <tt>destroy</tt>
 * method.  This method gives the object an opportunity to clean up
 * object references, thus keeping the memory requirements low.
 * @extends PooledObject
 */
var BaseObject = PooledObject.extend(/** @scope BaseObject.prototype */{

   element: null,

   events: null,

	constructor: function(name) {
		this.base(name);
		this.events = {};
	},

	destroy: function() {
		// We need to make sure to remove any event's attached to us
		// that weren't already cleaned up
		for (var ref in this.events) {
			var fn = this.events[ref];
			var type = ref.split(",")[1];
			if (fn) {
				EventEngine.clearHandler(this.getElement(), type, fn);
			}
		}

		this.base();
	},

   release: function() {
      this.base();
      this.element = null;
      this.events = null;
   },

   /**
    * Set the element which will represent this object within
    * its rendering context.
    *
    * @param element {HTMLElement} The HTML element this object is associated with.
    */
   setElement: function(element) {
      this.element = element;
   },

   /**
    * Get the element which represents this object within its rendering context.
    *
    * @return The HTML element
    */
   getElement: function() {
      return this.element;
   },

   /**
    * Abstract update method to set the state of the object.
    *
    * @param renderContext {RenderContext} The context the object exists within
    * @param time {Number} The current engine time, in milliseconds
    */
   update: function(renderContext, time) {
   },

   /**
    * Add an event handler to this object if it has an associated HTML element.
    *
    * @param ref {Object} The object reference which is assigning the event
    * @param type {String} The event type to respond to
    * @param [data] {Array} Optional data to pass to the handler when it is invoked.
    * @param fn {Function} The function to trigger when the event fires
    */
   addEvent: function(ref, type, data, fn) {
      if (this.getElement()) {
			Console.info(ref.getName() + " attach event '" + type + "' to " + this.getName());
         EventEngine.setHandler(this.getElement(), type, data || fn, fn);

         // Remember the handler by the reference object's name and event type
         var func = $.isFunction(data) ? data : fn;
         this.events[ref.getName() + "," + type] = func;
      }
   },

   /**
    * Remove the event handler assigned to the object's associated HTML element
    * for the given type.
    *
    * @param ref {Object} The object reference which assigned the event
    * @param type {String} The event type to remove
    */
   removeEvent: function(ref, type) {
      if (this.getElement()) {
			// Find the handler to remove
			var fn = this.events[ref.getName() + "," + type];
			if (fn) {
				Console.info(ref.getName() + " remove event '" + type + "' from " + this.getName());
	         EventEngine.clearHandler(this.getElement(), type, fn);
			}
         // Remove the reference
         delete this.events[ref.getName() + "," + type];
      }
   }

 }, /** @scope BaseObject */{

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "BaseObject";
   }

});

return BaseObject;

});

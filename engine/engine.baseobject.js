/**
 * The Render Engine
 * BaseObject
 *
 * @fileoverview The object from which most renderable engine objects will
 *               need to derive.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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
Engine.include("/engine.pooledobject.js");
Engine.include("/engine.events.js");

Engine.initObject("BaseObject", "PooledObject", function() {

/**
 * @class The base object class which represents an object within
 * the engine.  All objects should extend from this class mainly due to
 * the fact that the object will inherit a <tt>destroy</tt>
 * method.  This method gives the object an opportunity to clean up
 * object references, thus keeping the memory usage in check.
 * <p/>
 * This object also enhances the event handling provided by the {@link EventEngine}.
 * It will remember events assigned to the object so that they can be automatically
 * cleaned up when the object is destroyed.
 * <p/>
 * If you are working with an object that represents an HTML element (node),
 * this object is ideal to extend from.  It has methods for assigning and
 * accessing that element.
 * <p/>
 * The {@link #update} is called each time a frame is generated by the engine 
 * to update the object within the scene graph. In this method, you'll be able to 
 * update the components and perform general housekeeping.
 * 
 * @param name {String} The name of the object
 * @extends PooledObject
 * @constructor
 * @description Create a base object. 
 */
var BaseObject = PooledObject.extend(/** @scope BaseObject.prototype */{

   element: null,
   
   jQObject: null,

   events: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name);
      this.events = {};
      this.jQObject = null;
   },

   /**
    * Destroy the object, cleaning up any events that have been
    * attached to this object.
    */
   destroy: function() {
      // We need to make sure to remove any event's attached to us
      // that weren't already cleaned up
      for (var ref in this.events) {
         var r = ref;
         var fn = this.events[r];
         var type = r.split(",")[1];
         if (fn) {
            EventEngine.clearHandler(this.getElement(), type, fn);
         }
      }

		if (this.element != null && this.element != document) {
			$(this.element).empty().remove();
		}

      this.base();
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.element = null;
      this.events = null;
      this.jQObject = null;
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
    * @return {HTMLElement} The HTML element
    */
   getElement: function() {
      return this.element;
   },
   
   /**
    * A helper method to provide access to the jQuery object wrapping the
    * element for this object.  This allows direct access to the DOM.
    *
    * @return {jQuery} A jQuery object
    */
   jQ: function() {
      if (!this.jQObject && this.element) {
         this.jQObject = $(this.element);
      }
      return this.jQObject;
   },

   /**
    * Abstract update method to set the state of the object.  This method
    * will be called each frame that is generated by the engine.  The
    * context where the object will be rendered is passed, along with the
    * current engine time.  Use this method to update components and
    * perform housekeeping on the object.
    *
    * @param renderContext {RenderContext} The context the object exists within
    * @param time {Number} The current engine time, in milliseconds
    */
   update: function(renderContext, time) {
   },

   /**
    * Add an event handler to this object, as long as it has an associated HTML element.
    *
    * @param ref {Object} The object reference which is assigning the event
    * @param type {String} The event type to respond to
    * @param [data] {Array} Optional data to pass to the handler when it is invoked.
    * @param fn {Function} The function to trigger when the event fires
    */
   addEvent: function(ref, type, data, fn) {
		if (ref == null) {
			// This is a global assignment to the document body.  Many listeners
			// may collect data from the event handler.
			Console.info("Global assignment of event '" + type + "'");
			EventEngine.setHandler(document.body, type, data || fn, fn);
         this.events["document," + type] = func;
		} else if (this.getElement()) {
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
   	if (ref == null) {
   		// This was a global assignment to the document body.  Clean it up
   		Console.info("Global event '" + type + "' removed");
         var fn = this.events["document," + type];
   		EventEngine.clearHandler(document.body, type, fn);
   	} else if (ref != null && this.getElement()) {
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

 }, /** @scope BaseObject.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} "BaseObject"
    */
   getClassName: function() {
      return "BaseObject";
   }

});

return BaseObject;

});

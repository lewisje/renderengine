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
Engine.include("/platform/engine.pooledobject.js");
Engine.include("/platform/engine.events.js");

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

   release: function() {
      this.base();
      this.element = null;
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
    * Add an event handler to objects that have an associated HTML element.
    *
    * @param type {String} The event type to respond to
    * @param fn {Function} The function to trigger when the event fires
    */
   addEvent: function(type, fn) {
      if (this.getElement()) {
         EventEngine.setHandler(this.getElement(), type, fn);
      }
   },

   /**
    * Remove an event handler assigned to the object's associated HTML element.
    *
    * @param type {String} The event type to remove
    * @param fn {Function} The handler function to remove
    */
   removeEvent: function(type, fn) {
      if (this.getElement()) {
         EventEngine.clearHandler(this.getElement(), type, fn);
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

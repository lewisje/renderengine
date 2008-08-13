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
    * @type element {BaseObject}
    * @memberOf BaseObject
    */
   setElement: function(element) {
      this.element = element;
   },

   /**
    * Get the element which represents this object within its rendering context.
    *
    * @return The element
    * @type BaseObject
    * @memberOf BaseObject
    */
   getElement: function() {
      return this.element;
   },

   /**
    * Update the state of the object.
    */
   update: function(renderContext, time) {
   },

   addEvent: function(type, fn) {
      if (this.getElement()) {
         EventEngine.setHandler(this.getElement(), type, fn);
      }
   },

   removeEvent: function(type, fn) {
      if (this.getElement()) {
         EventEngine.clearHandler(this.getElement(), type, fn);
      }
   }
}, {

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf BaseObject
    */
   getClassName: function() {
      return "BaseObject";
   }

});

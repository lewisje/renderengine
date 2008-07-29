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
 *
 */
var BaseObject = Base.extend(/** @scope BaseObject.prototype */{
   id: -1,

   name: "",

   element: null,

   /**
    * Returns <tt>true</tt> if the object is an object within the
    * Render Engine.  All objects should extend this class.
    * @memberOf BaseObject
    */
   isRenderEngineObject: function() {
      return true;
   },

   /**
    * Create an instance of this object, assigning a name to it.  An
    * object reference will be maintained by the {@link Engine} class,
    * which gives the object final responsibility for making sure the
    * object can be destroyed.
    *
    * @param name {String} The name of the object from which the Id will be generated.
    * @memberOf BaseObject
    * @constructor
    */
   constructor: function(name) {
      this.name = name;
      this.id = Engine.create(this);
   },

   /**
    * Destroy this object instance (remove it from the Engine).  The object
    * may still exist as a reference from another object, but will not
    * be managed by the Engine any longer.  Untracked objects pose the
    * potential for memory leaks.
    * @memberOf BaseObject
    */
   destroy: function() {
      // Remove any defined element from it's parent, unless it's the document body
      if (this.element && this.element.parentNode && this.element != document.body) {
         Console.log("DOM element ", this.element, " removed from ", this.element.parentNode);
         this.element.parentNode.removeChild(this.element);
      }

      // Clean up the reference to this object
      Engine.destroy(this);
      this.element = null;
   },

   /**
    * Get the managed Id of this object within the Engine.
    *
    * @return This object's engine Id
    * @type String
    * @memberOf BaseObject
    * @memberOf BaseObject
    */
   getId: function() {
      return this.id;
   },

   /**
    * Get the original name this object was created with.
    *
    * @return The name used when creating this object
    * @type String
    * @memberOf BaseObject
    */
   getName: function() {
      return this.name;
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

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf BaseObject
    */
   getClassName: function() {
      if (!this.hasOwnProperty("getClassName")) {
         Console.warn("Object ", this.toString(), " is missing getClassName()");
      }
      return "BaseObject";
   },

   /**
    * Output the object in JSON format so it can be reconstructed from
    * a text stream.
    *
    * @type String
    */
   serialize: function() {
      return EngineSupport.toJSONString(this);
   }
});
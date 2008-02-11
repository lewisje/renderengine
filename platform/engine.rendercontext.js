/**
 * The Render Engine
 * RenderContext
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
 * @class A base rendering context.  Game objects are rendered to a context
 * during engine runtime.
 * @extends Container
 */
var RenderContext = Container.extend(/** @scope RenderContext.prototype */{

   surface: null,

   transformStackDepth: 0,

   /**
    * Create an instance of this rendering context and optionally
    * assign the surface to which all rendering will occur.  This
    * is a base class and does not have any particular surface associated
    * with it.  Rendering contexts should extend this class.
    *
    * @param contextName {String} The name of this context.  Default: RenderContext
    * @param [surface] {HTMLElement} The surface node that all objects will be rendered to.
    * @see CanvasContext
    * @see DocumentContext
    * @constructor
    */
   constructor: function(contextName, surface) {
      this.base(contextName || "RenderContext");
      this.surface = surface;
      this.setElement(surface);
   },

   /**
    * Destroy the rendering context, and detach the surface from its
    * parent container.
    */
   destroy: function() {
      if (this.surface != document.body)
      {
         this.surface.parentNode.removeChild(this.surface);
      }
      this.surface = null;
      this.base();
   },

   /**
    * Set the surface element that objects will be rendered to.
    *
    * @param element {HTMLElement} The surface node that all objects will be rendered to.
    */
   setSurface: function(element) {
      this.surface = element;
   },

   /**
    * Get the surface node that all objects will be rendered to.
    *
    * @type HTMLElement
    */
   getSurface: function() {
      return this.surface;
   },

   /**
    * Add an object to the render list.  Only objects
    * within the render list will be rendered.
    *
    * @param obj {BaseObject} The object to add to the render list
    */
   add: function(obj) {
      this.base(obj);
      if (obj instanceof HostObject)
      {
         obj.setRenderContext(this);
         this.sort(RenderContext.sortFn);

         // Create a structure to hold information that is related to
         // the render context that keeps it separate from the rest of the object.
         obj.RenderContext = {};
      }
   },

   /**
    * Returns the structure that contains information held about
    * the rendering context.  This object allows a context to store
    * extra information on an object that an object wouldn't know about.
    *
    * @type Object
    */
   getContextData: function(obj) {
      return obj.RenderContext;
   },

   /**
    * Update the render context before rendering the objects to the surface.
    *
    * @param parentContext {RenderContext} A parent context, or <tt>null</tt>
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   update: function(parentContext, time)
   {
      this.render(time);
   },

   /**
    * Called after the update to render all of the objects to the rendering context.
    *
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   render: function(time) {
      this.reset();

      // Push the world transform
      this.pushTransform();

      // Render the objects into the world
      var objs = this.getObjects();
      for (var o in objs)
      {
         this.updateObject(objs[o], time);
      }

      // Restore the world transform
      this.popTransform();

   },

   /**
    * Update an object in the render context
    *
    * @param obj {BaseObject} An object to update
    * @param time {Number} The current time in milliseconds
    */
   updateObject: function(obj, time) {
      obj.update(this, time);
   },

   /**
    * Increment the transform stack counter.
    * @memberOf RenderContext
    */
   pushTransform: function() {
      this.transformStackDepth++;
   },

   /**
    * Decrement the transform stack counter and ensure that the stack
    * is not unbalanced.  An unbalanced stack can be indicative of
    * objects that do not reset the state after rendering themselves.
    */
   popTransform: function() {
      this.transformStackDepth--;
      Assert((this.transformStackDepth >= 0), "Unbalanced transform stack!");
   },

   /**
    * This is a potentially expensive call, and can lead to rendering
    * errors.  It is recommended against calling this method!
    */
   resetTransformStack: function() {
      while (this.transformStackDepth > 0)
      {
         this.popTransform();
      }
   },

   /**
    * Get a collection of object Id's that are near the object specified.
    * The collection is a Javascript object that contains the Id's of the
    * objects nearby.
    *
    * @param obj {Object2D} The object to test against
    * @returns A collection that contains the names of objects nearby
    * @type Object
    */
   getNearObjects: function(obj) {
      return {};
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "RenderContext";
   }

}, { // Static

   /**
    * Sort the objects to draw from objects with the lowest
    * z-index to the highest z-index.
    * @memberOf RenderContext
    * @static
    */
   sortFn: function(obj1, obj2) {
      if (obj1 instanceof HostObject ||
          obj2 instanceof HostObject)
      {
         return 0;
      }

      return obj1.getZIndex() - obj2.getZIndex();
   }

});

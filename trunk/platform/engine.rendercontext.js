/**
 * The Render Engine
 * RenderContext
 * 
 * A base rendering context.  Game objects are rendered to a context
 * during engine runtime.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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
 
var RenderContext = Container.extend({
    
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
      if (this.surface.parentNode && this.surface != document.body)
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
    * Add a host object to the render list.  Only objects
    * within the render list will be rendered.
    */
   add: function(obj) {
      this.base(obj);
      this.sort(RenderContext.sortFn);
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
         objs[o].update(this, time);
      }

      // Restore the world transform
      this.popTransform();
      
   },
   
   /**
    * Increment the transform stack counter.
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
    */
   sortFn: function(obj1, obj2) {
      return obj1.getZIndex() - obj2.getZIndex();
   }

});

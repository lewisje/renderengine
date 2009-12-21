/**
 * The Render Engine
 * LayeredContext
 *
 * @fileoverview A context which hosts other contexts in a layered manner.  As
 *               contexts are added, they all assume the same size and viewport.
 *               Setting the world transform in the <tt>LayeredContext</tt> effectively
 *               sets it in each of the layers.
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.rendercontext.js");
Engine.include("/engine/engine.container.js");

Engine.initObject("LayeredContext", "RenderContext", function() {

   /**
    * @class A context which hosts multiple contexts in a layered fashion.  Each
    * context which is added works together in unison so that world transformations
    * are applied across all contexts.
    *
    * @extends RenderContext
    * @constructor
    * @description Create a new instance of a layered context.
    * @param name {String} The name of the context
    * @param width {Number} The width (in pixels) of the context.
    * @param height {Number} The height (in pixels) of the context.
    */
   var LayeredContext = RenderContext.extend(/** @scope LayeredContext.prototype */{
   
      lWidth: 0,
      lHeight: 0,
      layers: null,
   
      /**
       * @private
       */
      constructor: function(name, width, height) {
         
         var surface = $("<div class='layeredContext'>").css({
            width: width,
            height: height,
            position: "relative"
         });
         
         this.lWidth = width;
         this.lHeight = height;
         this.layers = HashContainer.create("layers");
         this.base(name, surface);
      },
      
      /**
       * Release the context into the object pool.
       * @private
       */
      release: function() {
         this.lWidth = 0;
         this.lHeight = 0;
         this.layers.destroy();
         this.layers = null;
      },
      
      /**
       * Add a new context to this context.  Each context is named for easy
       * retrieval.  Layers are stacked in the order in which they are added.
       * @param name {String} The name of the layer
       * @param context {RenderContext} The render context for the layer
       */
      addLayer: function(name, context) {
         this.layers.add(name, context);
         var cSurf = $(context.getSurface());
         cSurf.css({
            position: "absolute",
            top: 0,
            left: 0,
            width: this.lWidth,
            height: this.lHeight
         });
         context.setViewport(this.getViewport());
         $(this.getSurface()).append(cSurf);
      },
      
      /**
       * Remove the named layer.
       * @param name {String} The name of the layer
       * @return {RenderContext} The context layer that was removed
       */
      removeLayer: function(name) {
         return this.layers.removeHash(name);
      },
      
      /**
       * Get the named layer.
       * @param name {String} The name of the layer
       * @return {RenderContext} The context layer
       */
      getLayer: function(name) {
         return this.layers.get(name);  
      },
      
      /**
       * Set the scale of all of the layers.
       *
       * @param scaleX {Number} The scale along the X dimension
       * @param scaleY {Number} The scale along the Y dimension
       */
      setScale: function(scaleX, scaleY) {
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.setScale(scaleX, scaleY);
         }
      },

      /**
       * Set the world scale of the rendering context.  All layers will
       * be updated to reflect the world scale.
       *
       * @param scale {Number} The uniform scale of the world
       */
      setWorldScale: function(scale) {
         this.base(scale);
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.setWorldScale(scale);
         }
      },

      /**
       * Set the world rotation of the rendering context.  All layers will
       * be updated to reflect the world rotation.
       * @param rotation {Number} The rotation angle
       */
      setWorldRotation: function(rotation) {
         this.base(rotation);
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.setWorldRotation(rotation);
         }
      },

      /**
       * Set the world position of the rendering context.  All layers will
       * be updated to reflect the world position.
       * @param point {Point2D} The world position
       */
      setWorldPosition: function(point) {
         this.base(point);
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.setWorldPosition(point);
         }
      },

      /**
       * Set the viewport of the render context.  The viewport is a window
       * upon the world so that not all of the world is rendered at one time.
       * All layers will be updated to reflect the viewport.
       * @param rect {Rectangle2D} A rectangle defining the viewport
       */
      setViewport: function(rect) {
         this.base(rect);
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.setViewport(rect);
         }
      },
      
      /**
       * Clear the context and prepare it for rendering.  All layers will
       * be cleared when this is called.
       *
       * @param rect {Rectangle2D} The area to clear in the context, or
       *             <tt>null</tt> to clear the entire context.
       */
      reset: function(rect) {
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.reset(rect);
         }
      },

      /**
       * Called to render all of the layers in this context.
       *
       * @param time {Number} The current render time in milliseconds from the engine.
       */
      render: function(time) {
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();
            layer.update(this, time);
         }
      }
   
   }, /** @scope LayeredContext.prototype */{
   
      /**
       * Get the class name of this object
       * @return {String} "LayeredContext"
       */
      getClassName: function() {
         return "LayeredContext";
      }
   
   
   });
   
   return LayeredContext;
   
});
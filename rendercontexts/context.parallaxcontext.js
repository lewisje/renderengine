/**
 * The Render Engine
 * ParallaxContext
 *
 * @fileoverview A multiple layered context whose layers mimic a parallax effect whereby
 *               the farthest layer (plane) moves slowest and the closest moves fastest.
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

Engine.initObject("ParallaxContext", "LayeredContext", function() {

   /**
    * @class A multi-layered context whose planes move in parallax, giving the
    *        illusion of depth.
    *
    * @extends LayeredContext
    * @constructor
    * @description Create a new instance of a parallax context.
    * @param name {String} The name of the context
    * @param width {Number} The width (in pixels) of the context.
    * @param height {Number} The height (in pixels) of the context.
    * @param depth {Number} The depth (in pixels) of the context.  All layers
    *                       will be evenly spaced within this depth.
    */
   var ParallaxContext = LayeredContext.extend(/** @scope ParallaxContext.prototype */{
   
      depth: 0,
      eyeToScreen: 1,
      sep: 0,
   
      /**
       * @private
       */
      constructor: function(name, width, height, depth) {
         this.base(name, width, height);
         this.depth = depth;
      },
      
      /**
       * Release the context into the object pool.
       * @private
       */
      release: function() {
         this.base();
         this.depth = 0;
         this.eyeToScreen = 1;
      },

      /**
       * Add a new context to this context.  Each context is named for easy
       * retrieval.  Layers are stacked in the order in which they are added,
       * from back to front.
       * @param name {String} The name of the layer
       * @param context {RenderContext} The render context for the layer
       */
      addLayer: function(name, context) {
         this.base(name, context);
         this.sep = this.depth / this.getLayers().size();
      },
      
      /**
       * Remove the named layer.
       * @param name {String} The name of the layer
       * @return {RenderContext} The context layer that was removed
       */
      removeLayer: function(name) {
         this.base(name);
         this.sep = this.depth / this.getLayers().size();
      },


      /**
       * Transform a point from 2D to 3D using the depth at which the
       * layer exists.
       * @param point {Point2D} The point to transform
       * @param depth {Number} The depth of the point
       * @return {Point2D} A transformed point
       * @private
       */
      perspectiveTransform: function(point, depth) {
         return point.mul(this.eyeToScreen / depth);
      },

      /**
       * Set the viewport of the render context.  The viewport is a window
       * upon the world so that not all of the world is rendered at one time.
       * The viewport of each layer will be adjusted to maintain a parallax to
       * simulate depth.
       * @param rect {Rectangle2D} A rectangle defining the viewport
       */
      setViewport: function(rect) {
         this.base(rect);

         var sDepth = this.depth;
         for (var itr = this.layers.iterator(); itr.hasNext(); ) {
            var layer = itr.next();

            // Transform the viewport for each layer
            var topLeft = Point2D.create(rect.getTopLeft());
            var bottomRight = Point2D.create(rect.getBottomRight());

            this.perspectiveTransform(topLeft, sDepth);
            this.perspectiveTransform(bottomRight, sDepth);
            var tL = topLeft.get();
            var bR = bottomRight.get();
            var tRect = Rectangle2D.create(tL.x, tL.y, bR.x - tL.x, bR.y - tL.y);
            layer.setViewport(tRect);
            
            // Depth for next layer
            sDepth -= this.sep;
         }
      }
   
   }, /** @scope ParallaxContext.prototype */{
   
      /**
       * Get the class name of this object
       * @return {String} "ParallaxContext"
       */
      getClassName: function() {
         return "ParallaxContext";
      }
   
   
   });
   
   return LayeredContext;
   
});
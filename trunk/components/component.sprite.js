/**
 * The Render Engine
 * SpriteComponent
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
 * @class A render component that renders its contents from a set of points.
 * @extends BaseComponent
 */
var SpriteComponent = RenderComponent.extend(/** @scope SpriteComponent.prototype */{

   currentSprite: null,

   /**
    * @constructor
    * @memberOf Vector2DComponent
    */
   constructor: function(name, priority, sprite) {
      this.base(name, priority || 0.1);
      this.currentSprite = sprite;
   },

   release: function() {
      this.base();
      this.currentSprite = null;
   },

   /**
    * Calculate the bounding box from the set of
    * points which comprise the shape to be rendered.
    * @private
    */
   calculateBoundingBox: function() {
      return;
      var x1 = 0;
      var x2 = 0;
      var y1 = 0;
      var y2 = 0;
      for (var p = 0; p < this.points.length; p++)
      {
         var pt = this.points[p];

         if (pt.x < x1)
         {
            x1 = pt.x;
         }
         if (pt.x > x2)
         {
            x2 = pt.x;
         }
         if (pt.y < y1)
         {
            y1 = pt.y;
         }
         if (pt.y > y2)
         {
            y2 = pt.y;
         }
      }

      var bbox = new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2);
      this.getHostObject().setBoundingBox(bbox);

      // Figure out longest axis
      if (bbox.len_x() > bbox.len_y)
      {
         this.fullBox = new Rectangle2D(x1,x1,Math.abs(x1) + x2,Math.abs(x1) + x2);
      }
      else
      {
         this.fullBox = new Rectangle2D(y1,y1,Math.abs(y1) + y2,Math.abs(y1) + y2);
      }
   },

   setSprite: function(sprite) {
      this.currentSprite = sprite;
   },

   getSprite: function() {
      return this.currentSprite;
   },

   /**
    * Draw the shape, defined by the points, to the rendering context
    * using the specified line style and fill style.
    *
    * @param renderContext {RenderContext} The context to render to
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {

      if (this.getDrawMode() != RenderComponent.DRAW)
      {
         return;
      }

		if (this.currentSprite) {
      	renderContext.drawSprite(this.currentSprite, time);
		}
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Vector2DComponent
    */
   getClassName: function() {
      return "SpriteComponent";
   }
});
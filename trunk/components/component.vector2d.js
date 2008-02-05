/**
 * The Render Engine
 * VectorDrawComponent
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
var Vector2DComponent = BaseComponent.extend(/** @scope Vector2DComponent.prototype */{

   strokeStyle: "#ffffff",     // Default to white lines

   lineWidth: 1,

   fillStyle: null,          // Default to none

   points: null,

   renderState: null,

   /**
    * @constructor
    * @memberOf Vector2DComponent
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 0.1);
   },

   /**
    * @memberOf Vector2DComponent
    */
   calculateBoundingBox: function() {
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

      this.getHostObject().setBoundingBox(new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2));
   },

   /**
    * @memberOf Vector2DComponent
    */
   setPoints: function(pointArray) {
      this.points = pointArray;
      this.renderState = null;
      this.calculateBoundingBox();
   },

   /**
    * @memberOf Vector2DComponent
    */
   buildRenderList: function() {
      this.renderState = this.getHostObject().getRenderContext().buildRenderList(this.points);
   },

   /**
    * @memberOf Vector2DComponent
    */
   setLineStyle: function(strokeStyle) {
      this.strokeStyle = strokeStyle;
   },

   /**
    * @memberOf Vector2DComponent
    */
   getLineStyle: function() {
      return this.strokeStyle;
   },

   /**
    * @memberOf Vector2DComponent
    */
   setLineWidth: function(lineWidth) {
      this.lineWidth = lineWidth;
   },

   /**
    * @memberOf Vector2DComponent
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * @memberOf Vector2DComponent
    */
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },

   /**
    * @memberOf Vector2DComponent
    */
   getFillStyle: function() {
      return this.fillStyle;
   },

   /**
    * @memberOf Vector2DComponent
    */
   execute: function(renderContext, time) {
      Assert((this.points != null), "Points not defined in CanvasVectorComponent");

      // Set the stroke and fill styles
      if (this.getLineStyle() != null)
      {
         renderContext.setLineStyle(this.strokeStyle);
      }

      if (this.getFillStyle() != null)
      {
         renderContext.setFillStyle(this.fillStyle);
      }

      // Render out the points
      renderContext.drawPolygon(this.renderState || this.points);
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Vector2DComponent
    */
   getClassName: function() {
      return "Vector2DComponent";
   }


});
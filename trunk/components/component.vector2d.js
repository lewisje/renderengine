/**
 * The Render Engine
 * VectorDrawComponent
 * 
 * A render component that renders its contents from a set of points.
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
 
var Vector2DComponent = BaseComponent.extend({
   
   points: null,
   
   strokeStyle: "#ffffff",     // Default to white lines
   
   lineWidth: 1,
   
   fillStyle: "#000000",          // Default to none
   
   boundingBox: null,
   
   fastPoly: null,
   
   constructor: function(name) {
      this.base(name, BaseComponent.TYPE_RENDERING, 0.1);
   },
   
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

      this.boundingBox = new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2);
   },

   getBoundingBox: function() {
      return this.boundingBox;
   },
   
   setPoints: function(pointArray) {
      this.points = pointArray;
      this.fastPoly = null;
      this.calculateBoundingBox();
   },
   
   setLineStyle: function(strokeStyle) {
      this.strokeStyle = strokeStyle;
   },
   
   getLineStyle: function() {
      return this.strokeStyle;
   },
   
   setLineWidth: function(lineWidth) {
      this.lineWidth = lineWidth;
   },
   
   getLineWidth: function() {
      return this.lineWidth;
   },
   
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },
   
   getFillStyle: function() {
      return this.fillStyle;
   },
   
   execute: function(renderContext, time) {
      Assert((this.points != null), "Points not defined in CanvasVectorComponent");
     
      // Set the stroke and fill styles
      renderContext.setLineStyle(this.strokeStyle);
      renderContext.setFillStyle(this.fillStyle);
      
      if (this.fastPoly == null)
      {
         this.fastPoly = renderContext.fastPoly(this.points);
      }
      
      // Render out the points
      renderContext.drawPolygon(this.fastPoly);
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Vector2DComponent";
   }

   
});
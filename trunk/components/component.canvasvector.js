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
 
var CanvasVectorComponent = BaseCanvasComponent.extend({
   
   points: null,
   
   strokeStyle: "#ffffff",     // Default to white lines
   
   lineWidth: 1,
   
   fillStyle: "none",          // Default to none
   
   constructor: function(name) {
      this.base(name, BaseComponent.TYPE_RENDERING, 0.1);
   },
   
   setPoints: function(pointArray) {
      this.points = pointArray;
   },
   
   setStrokeStyle: function(strokeStyle) {
      this.strokeStyle = strokeStyle;
   },
   
   getStrokeStyle: function() {
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
      Assert((points != null), "Points not defined in CanvasVectorComponent");
      
      var ctx = renderContext.get2DContext();
   
      // Set the stroke and fill styles
      ctx.strokeStyle(this.strokeStyle);
      ctx.fillStyle(this.fillStyle);
      
      // Render out the points
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (var p = 1; p < this.points.length; p++)
      {
         ctx.lineTo(this.points[p].x, this.points[p].y);         
      }
      ctx.closePath();
      ctx.stroke();
      
      // Pop the transform
      renderContext.popTransform();
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "CanvasVectorComponent";
   }

   
});
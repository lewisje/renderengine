/**
 * The Render Engine
 * CanvasContext
 * 
 * A canvas element represented within the engine.
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
 
var CanvasContext = RenderContext2D.extend({

   /**
    * Create an instance of a 2D rendering context using the canvas element.
    *
    * @param contextName {String} The name of this context.  Default: CanvasContext
    * @param width {Number} The width (in pixels) of the canvas context.
    * @param height {Number} The height (in pixels) of the canvas context.
    */
   constructor: function(width, height) {
      Assert((width != null && height != null), "Width and height must be specified in CanvasContext");
      
      this.setWidth(width);
      this.setHeight(height);
      
      // Create the canvas element
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.id = this.getId();
      
      this.base("CanvasContext", canvas);
   },
   
   /**
    * Gets the surface context upon which all objects are drawn.
    */
   get2DContext: function() {
      return this.getSurface().getContext('2d');
   },
   
   /**
    * Push a transform state onto the stack.
    */
   pushTransform: function() {
      this.base();
      this.get2DContext().save();
   },
   
   /**
    * Pop a transform state off the stack.
    */
   popTransform: function() {
      this.base();
      this.get2DContext().restore();
   },
   
   //================================================================
   // Drawing functions
   
   setPosition: function(point) {
      this.get2DContext().translate(point.x, pointy);
   },
   
   setRotation: function(angle) {
      this.get2DContext().rotate(angle);
   },
   
   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.get2DContext().scale(scaleX, scaleY);
   },
   
   setTransform: function(matrix) {
   },
   
   setLineStyle: function(lineStyle) {
      this.get2DContext().strokeStyle(lineStyle);
   },
   
   setLineWidth: function(width) {
      this.get2DContext().lineWidth(width);
   },
   
   setFillStyle: function(fillStyle) {
      this.get2DContext().fillStyle(fillStyle);
   },
   
   drawRectangle: function(point, width, height) {
      this.get2DContext().strokeRect(point.x, point.y, width, height);
   },
   
   drawFilledRectangle: function(point, width, height) {
      this.get2DContext().fillRect(point.x, point.y, width, height);
   },
   
   _arc: function(point, radiusX, startAngle, endAngle) {
      this.startPath();
      this.get2DContext().arc(point.x, point.y, startAngle, endAngle, true);
      this.endPath();
   },
   
   drawArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.strokePath();
   },
   
   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.fillPath();
   },
   
   _poly: function(pointArray) {
      this.startPath();
      this.moveTo(pointArray[0]);
      for (var p = 1; p < pointArray.length; p++)
      {
         this.lineTo(pointArray[p]);
      }
      this.endPath();
   },
   
   drawPolygon: function(pointArray) {
      this._poly(pointArray);
      this.strokePath();
   },

   drawFilledPolygon: function(pointArray) {
      this._poly(pointArray);
      this.fillPath();
   },
   
   drawLine: function(point1, point2) {
      this.startPath();
      this.moveTo(point1.x, point1.y);
      this.lineTo(point2.x, point2.y);
      this.endPath();
      this.strokePath();      
   },
   
   drawPoint: function(point) {
      this.drawLine(point, point);
   },
   
   drawImage: function(point, resource) {
   },
   
   drawText: function(point, text) {
   },

   startPath: function() {
      this.getContext2D().beginPath();
   },
   
   endPath: function() {
      this.getContext2D().closePath();
   },
   
   strokePath: function() {
      this.getContext2D().stroke();
   },
   
   fillPath: function() {
      this.getContext2D().fill();
   },
  
   moveTo: function(point) {
      this.getContext2D().moveTo(point.x, point.y);
   },
   
   lineTo: function(point) {
      this.getContext2D().lineTo(point.x, point.y);
   },
   
   quadraticCurveTo: function(cPoint, point) {
      this.getContext2D().quadraticCurveTo(cPoint.x, cPoint.y, point.x, point.y);
   },
   
   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.getContext2D().bezierCurveTo(cPoint1.x, cPoint1.y, cPoint2.x, cPoint2.y, point.x, point.y);
   },
   
   arcTo: function(point1, point2, radius) {
      this.getContext2D().arcTo(point1.x, point1.y, point2.x, point2.y, radius);
   },
   
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "CanvasContext";
   }
});
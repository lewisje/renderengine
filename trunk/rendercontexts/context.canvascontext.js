/**
 * The Render Engine
 * CanvasContext
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
 * @class A canvas element represented within the engine.
 *
 * @extends RenderContext2D
 */
var CanvasContext = RenderContext2D.extend(/** @scope CanvasContext.prototype */{

   context2D: null,

   mouseHandler: false,

   /**
    * Create an instance of a 2D rendering context using the canvas element.
    *
    * @param contextName {String} The name of this context.  Default: CanvasContext
    * @param width {Number} The width (in pixels) of the canvas context.
    * @param height {Number} The height (in pixels) of the canvas context.
    * @constructor
    * @memeberOf CanvasContext
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
    * @memeberOf CanvasContext
    */
   get2DContext: function() {
      if (this.context2D == null)
      {
         this.context2D = this.getSurface().getContext('2d');
      }
      return this.context2D;
   },

   /**
    * Push a transform state onto the stack.
    * @memeberOf CanvasContext
    */
   pushTransform: function() {
      this.base();
      this.get2DContext().save();
   },

   /**
    * Pop a transform state off the stack.
    * @memeberOf CanvasContext
    */
   popTransform: function() {
      this.base();
      this.get2DContext().restore();
   },

   //================================================================
   // Drawing functions

   /**
    * @memeberOf CanvasContext
    */
   reset: function() {
      this.get2DContext().clearRect(0, 0, this.width, this.height);
   },

   /**
    * @memeberOf CanvasContext
    */
   setBackgroundColor: function(color) {
      jQuery(this.getSurface()).css("background-color", color);
      this.base(color);
   },


   /**
    * @memeberOf CanvasContext
    */
   setPosition: function(point) {
      this.get2DContext().translate(point.x, point.y);
      this.base(point);
   },

   /**
    * @memeberOf CanvasContext
    */
   setRotation: function(angle) {
      this.get2DContext().rotate(Math2D.degToRad(angle));
      this.base(angle);
   },

   /**
    * @memeberOf CanvasContext
    */
   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.get2DContext().scale(scaleX, scaleY);
      this.base(scaleX, scaleY);
   },

   /**
    * @memeberOf CanvasContext
    */
   setTransform: function(matrix) {
   },

   /**
    * @memeberOf CanvasContext
    */
   setLineStyle: function(lineStyle) {
      this.get2DContext().strokeStyle = lineStyle;
      this.base(lineStyle);
   },

   /**
    * @memeberOf CanvasContext
    */
   setLineWidth: function(width) {
      this.get2DContext().lineWidth = width * 1.0;
      this.base(width);
   },

   /**
    * @memeberOf CanvasContext
    */
   setFillStyle: function(fillStyle) {
      this.get2DContext().fillStyle = fillStyle;
      this.base(fillStyle);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawRectangle: function(point, width, height) {
      this.get2DContext().strokeRect(point.x, point.y, width, height);
      this.base(point, width, height);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawFilledRectangle: function(point, width, height) {
      this.get2DContext().fillRect(point.x, point.y, width, height);
      this.base(point, width, height);
   },

   /**
    * @memeberOf CanvasContext
    * @private
    */
   _arc: function(point, radiusX, startAngle, endAngle) {
      this.startPath();
      this.get2DContext().arc(point.x, point.y, startAngle, endAngle, true);
      this.endPath();
   },

   /**
    * @memeberOf CanvasContext
    */
   drawArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.strokePath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.fillPath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * @memeberOf CanvasContext
    * @private
    */
   _poly: function(pointArray) {
      this.startPath();
      this.moveTo(pointArray[0]);
      var p = 1;

      // Using Duff's device with loop inversion
      switch((pointArray.length - 1) & 0x3)
      {
         case 3:
            this.lineTo(pointArray[p++]);
         case 2:
            this.lineTo(pointArray[p++]);
         case 1:
            this.lineTo(pointArray[p++]);
      }

      if (p < pointArray.length)
      {
         do
         {
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
         } while (p < pointArray.length);
      }

      this.endPath();
   },

   /**
    * Creates a render list which will make inline calls to the
    * line drawing methods instead of looping over them.  Logically
    * this method returns a function which will draw the polygon.
    *
    * @param pointArray {Array} An array of Point2D objects
    * @type Function
    * @memberOf CanvasContext
    */
   buildRenderList: function(pointArray) {
      var f = "arguments.callee.ctx.startPath(); arguments.callee.ctx.moveTo(arguments.callee.ptArr[0]);";
      for (var p = 1; p < pointArray.length; p++)
      {
         f += "arguments.callee.ctx.lineTo(arguments.callee.ptArr[" + p + "]);";
      }
      f += "arguments.callee.ctx.endPath();arguments.callee.ctx.strokePath();";
      var _fastPoly = new Function(f);
      _fastPoly.ctx = this;
      _fastPoly.ptArr = pointArray;
      _fastPoly.isRenderList = true;
      return _fastPoly;
   },

   /**
    * @memeberOf CanvasContext
    */
   drawPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
         return;
      }
      this._poly(pointArray);
      this.strokePath();
      this.base(pointArray);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawFilledPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
      this.fillPath();
         return;
      }
      this._poly(pointArray);
      this.fillPath();
      this.base(pointArray);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawLine: function(point1, point2) {
      this.startPath();
      this.moveTo(point1.x, point1.y);
      this.lineTo(point2.x, point2.y);
      this.endPath();
      this.strokePath();
      this.base(point1, point2);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawPoint: function(point) {
      this.drawLine(point, point);
      this.base(point);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawImage: function(point, imageData) {
      this.get2DContext().putImageData(imageData, point.x, point.y);
      this.base(point, imageData);
   },

   /**
    * @memeberOf CanvasContext
    */
   getImage: function(rect) {
      this.base()
      return this.get2DContext().getImageData(rect.x, rect.y, rect.width, rect.height);
   },

   /**
    * @memeberOf CanvasContext
    */
   drawText: function(point, text) {

      this.base(point, text);
   },

   /**
    * @memeberOf CanvasContext
    */
   startPath: function() {
      this.get2DContext().beginPath();
      this.base();
   },

   /**
    * @memeberOf CanvasContext
    */
   endPath: function() {
      this.get2DContext().closePath();
      this.base();
   },

   /**
    * @memeberOf CanvasContext
    */
   strokePath: function() {
      this.get2DContext().stroke();
      this.base();
   },

   /**
    * @memeberOf CanvasContext
    */
   fillPath: function() {
      this.get2DContext().fill();
      this.base();
   },

   /**
    * @memeberOf CanvasContext
    */
   moveTo: function(point) {
      this.get2DContext().moveTo(point.x, point.y);
      this.base();
   },

   /**
    * @memeberOf CanvasContext
    */
   lineTo: function(point) {
      this.get2DContext().lineTo(point.x, point.y);
      this.base(point);
   },

   /**
    * @memeberOf CanvasContext
    */
   quadraticCurveTo: function(cPoint, point) {
      this.get2DContext().quadraticCurveTo(cPoint.x, cPoint.y, point.x, point.y);
      this.base(cPoint, point);
   },

   /**
    * @memeberOf CanvasContext
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.get2DContext().bezierCurveTo(cPoint1.x, cPoint1.y, cPoint2.x, cPoint2.y, point.x, point.y);
      this.base(cPoint1, cPoint2, point);
   },

   /**
    * @memeberOf CanvasContext
    */
   arcTo: function(point1, point2, radius) {
      this.get2DContext().arcTo(point1.x, point1.y, point2.x, point2.y, radius);
      this.base(point1, point2, radius);
   },


   /**
    * Get the class name of this object
    *
    * @type String
    * @memeberOf CanvasContext
    */
   getClassName: function() {
      return "CanvasContext";
   }
});


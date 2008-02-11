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
      if (this.context2D == null)
      {
         this.context2D = this.getSurface().getContext('2d');
      }
      return this.context2D;
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

   /**
    * Reset the context, clearing it and preparing it for drawing.
    */
   reset: function() {
      this.get2DContext().clearRect(0, 0, this.width, this.height);
   },

   /**
    * Set the background color of the context.
    *
    * @param color {String} An HTML color
    */
   setBackgroundColor: function(color) {
      jQuery(this.getSurface()).css("background-color", color);
      this.base(color);
   },

   /**
    * Set the current transform position (translation).
    *
    * @param point {Point2D} The translation
    */
   setPosition: function(point) {
      this.get2DContext().translate(point.x, point.y);
      this.base(point);
   },

   /**
    * Set the rotation angle of the current transform
    *
    * @param angle {Number} An angle in degrees
    */
   setRotation: function(angle) {
      this.get2DContext().rotate(Math2D.degToRad(angle));
      this.base(angle);
   },

   /**
    * Set the scale of the current transform.  Specifying
    * only the first parameter implies a uniform scale.
    *
    * @param scaleX {Number} The X scaling factor, with 1 being 100%
    * @param scaleY {Number} The Y scaling factor
    */
   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.get2DContext().scale(scaleX, scaleY);
      this.base(scaleX, scaleY);
   },

   /**
    * Set the transformation using a matrix.
    *
    * @param matrix {Matrix2D} The transformation matrix
    */
   setTransform: function(matrix) {
   },

   /**
    * Set the line style for the context.
    *
    * @param lineStyle {String} An HTML color or <tt>null</tt>
    */
   setLineStyle: function(lineStyle) {
      this.get2DContext().strokeStyle = lineStyle;
      this.base(lineStyle);
   },

   /**
    * Set the line width for drawing paths.
    *
    * @param width {Number} The width of lines in pixels
    * @default 1
    */
   setLineWidth: function(width) {
      this.get2DContext().lineWidth = width * 1.0;
      this.base(width);
   },

   /**
    * Set the fill style of the context.
    *
    * @param fillStyle {String} An HTML color, or <tt>null</tt>.
    */
   setFillStyle: function(fillStyle) {
      this.get2DContext().fillStyle = fillStyle;
      this.base(fillStyle);
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawRectangle: function(rect) {
      var rTL = rect.getTopLeft();
      var rDM = rect.getDims();
      this.get2DContext().strokeRect(rTL.x, rTL.y, rDM.x, rDM.y);
      this.base(rect);
   },

   /**
    * Draw a filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawFilledRectangle: function(rect) {
      var rTL = rect.getTopLeft();
      var rDM = rect.getDims();
      this.get2DContext().fillRect(rTL.x, rTL.y, rDM.x, rDM.y);
      this.base(rect);
   },

   /**
    * @private
    */
   _arc: function(point, radiusX, startAngle, endAngle) {
      this.startPath();
      this.get2DContext().arc(point.x, point.y, startAngle, endAngle, true);
      this.endPath();
   },

   /**
    * Draw an un-filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    */
   drawArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.strokePath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * Draw a filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    */
   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.fillPath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
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
    * Draw an un-filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
         return;
      }
      this._poly(pointArray);
      this.base(pointArray);
      this.strokePath();
   },

   /**
    * Draw an filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawFilledPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
         return;
      }
      this._poly(pointArray);
      this.base(pointArray);
      this.fillPath();
   },

   /**
    * Draw a line on the context.
    *
    * @param point1 {Point2D} The start of the line
    * @param point2 {Point2D} The end of the line
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
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    */
   drawPoint: function(point) {
      this.drawLine(point, point);
      this.base(point);
   },

   /**
    * Draw an image on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param imageData {Image} The image to draw
    */
   drawImage: function(point, imageData) {
      this.get2DContext().putImageData(imageData, point.x, point.y);
      this.base(point, imageData);
   },

   /**
    * Capture an image from the context.
    *
    * @param rect {Rectangle2D} The area to capture
    * @returns Image data capture
    * @type Image
    */
   getImage: function(rect) {
      this.base()
      return this.get2DContext().getImageData(rect.x, rect.y, rect.width, rect.height);
   },

   /**
    * Draw text on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param text {String} The text to draw
    */
   drawText: function(point, text) {

      this.base(point, text);
   },

   /**
    * Start a path.
    */
   startPath: function() {
      this.get2DContext().beginPath();
      this.base();
   },

   /**
    * End a path.
    */
   endPath: function() {
      this.get2DContext().closePath();
      this.base();
   },

   /**
    * Stroke a path using the current line style and width.
    */
   strokePath: function() {
      this.get2DContext().stroke();
      this.base();
   },

   /**
    * Fill a path using the current fill style.
    */
   fillPath: function() {
      this.get2DContext().fill();
      this.base();
   },

   /**
    * Move the current path to the point sepcified.
    *
    * @param point {Point2D} The point to move to
    */
   moveTo: function(point) {
      this.get2DContext().moveTo(point.x, point.y);
      this.base();
   },

   /**
    * Draw a line from the current point to the point specified.
    *
    * @param point {Point2D} The point to draw a line to
    */
   lineTo: function(point) {
      this.get2DContext().lineTo(point.x, point.y);
      this.base(point);
   },

   /**
    * Draw a quadratic curve from the current point to the specified point.
    *
    * @param cPoint {Point2D} The control point
    * @param point {Point2D} The point to draw to
    */
   quadraticCurveTo: function(cPoint, point) {
      this.get2DContext().quadraticCurveTo(cPoint.x, cPoint.y, point.x, point.y);
      this.base(cPoint, point);
   },

   /**
    * Draw a bezier curve from the current point to the specified point.
    *
    * @param cPoint1 {Point2D} Control point 1
    * @param cPoint2 {Point2D} Control point 2
    * @param point {Point2D} The point to draw to
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.get2DContext().bezierCurveTo(cPoint1.x, cPoint1.y, cPoint2.x, cPoint2.y, point.x, point.y);
      this.base(cPoint1, cPoint2, point);
   },

   /**
    * Draw an arc from the current point to the specified point.
    *
    * @param point1 {Point2D} Arc point 1
    * @param point2 {Point2D} Arc point 2
    * @param radius {Number} The radius of the arc
    */
   arcTo: function(point1, point2, radius) {
      this.get2DContext().arcTo(point1.x, point1.y, point2.x, point2.y, radius);
      this.base(point1, point2, radius);
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


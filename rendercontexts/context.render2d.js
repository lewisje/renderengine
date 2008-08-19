/**
 * The Render Engine
 * RenderContext2D
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

Engine.initObject("RenderContext2D", "RenderContext", function() {

/**
 * @class All 2D contexts should extend from this to inherit the
 * methods which abstract the drawing methods.
 * @extends RenderContext
 */
var RenderContext2D = RenderContext.extend(/** @scope RenderContext2D.prototype */{

   width: 0,

   height: 0,

   lineStyle: null,

   fillStyle: null,

   lineWidth: 1,

   position: null,

   rotation: 0,

   scaleX: 1,

   scaleY: 1,

   wPosition: null,

   wRotation: 0,

   wScale: null,

   bBox: null,

   backgroundColor: null,

   constructor: function(name, surface) {
      this.base(name || "RenderContext2D", surface);
      this.wPosition = Point2D.create(0,0);
      this.wRotation = 0;
      this.wScale = 1;
   },

   release: function() {
      this.base();
      this.width= 0;
      this.height= 0;
      this.lineStyle= null;
      this.fillStyle= null;
      this.lineWidth= 1;
      this.position= null;
      this.rotation= 0;
      this.scaleX= 1;
      this.scaleY= 1;
      this.bBox= null;
      this.backgroundColor= null;
      this.wPosition = null;
      this.wRotation = 0;
      this.wScale = null;
   },

   /**
    * Set the background color of the context.
    *
    * @param color {String} An HTML color
    */
   setBackgroundColor: function(color) {
      this.backgroundColor = color;
   },

   /**
    * Get the color assigned to the context background.
    * @type String
    */
   getBackgroundColor: function() {
      return this.backgroundColor;
   },

   /**
    * Set the width of the context drawing area.
    *
    * @param width {Number} The width in pixels
    */
   setWidth: function(width) {
      this.width = width;
   },

   /**
    * Get the width of the context drawing area.
    * @type Number
    */
   getWidth: function() {
      return this.width;
   },

   /**
    * Set the height of the context drawing area
    *
    * @param height {Number} The height in pixels
    */
   setHeight: function(height) {
      this.height = height;
   },

   /**
    * Get the height of the context drawing area.
    * @type Number
    */
   getHeight: function() {
      return this.height;
   },

   /**
    * Get the bounding box for the rendering context.
    * @type Rectangle2D
    */
   getBoundingBox: function() {
      if (!this.bBox) {
         this.bBox = new Rectangle2D(0, 0, this.getWidth(), this.getHeight());
      }
      return this.bBox;
   },

   /**
    * Set the current transform position (translation).
    *
    * @param point {Point2D} The translation
    */
   setPosition: function(point) {
      this.position = point;
   },

   /**
    * Get the current transform position (translation)
    * @type Point2D
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * Set the rotation angle of the current transform
    *
    * @param angle {Number} An angle in degrees
    */
   setRotation: function(angle) {
      this.rotation = angle;
   },

   /**
    * Get the current transform rotation.
    * @type Number
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * Set the scale of the current transform.  Specifying
    * only the first parameter implies a uniform scale.
    *
    * @param scaleX {Number} The X scaling factor, with 1 being 100%
    * @param scaleY {Number} The Y scaling factor
    */
   setScale: function(scaleX, scaleY) {
      this.scaleX = scaleX;
      this.scaleY = scaleY || scaleX;
   },

   /**
    * Get the X scaling factor of the current transform.
    * @type Number
    */
   getScaleX: function() {
      return this.scaleX;
   },

   /**
    * Get the Y scaling factor of the current transform.
    * @type Number
    */
   getScaleY: function() {
      return this.scaleY;
   },

   /**
    * Set the transformation using a matrix.
    *
    * @param matrix {Matrix2D} The transformation matrix
    */
   setTransform: function(matrix) {
   },

   /**
    * Set the transformation of the world.
    *
    * @param position {Point2D}
    * @param rotation {Number}
    * @param scale {Number}
    */
   setWorldTransform: function(position, rotation, scale) {
      this.wPosition = position;
      this.wRotation = rotation;
      this.wScale = scale;
   },

   setWorldPosition: function(position) {
      this.wPosition = position;
   },

   getWorldPosition: function() {
      return this.wPosition;
   },

   setWorldRotation: function(rotation) {
      this.wRotation = rotation;
   },

   getWorldRotation: function() {
      return this.wRotation;
   },

   setWorldScale: function(scale) {
      this.wScale = scale;
   },

   getWorldScale: function() {
      return this.wScale;
   },

   /**
    * Set the line style for the context.
    *
    * @param lineStyle {String} An HTML color or <tt>null</tt>
    */
   setLineStyle: function(lineStyle) {
      this.lineStyle = lineStyle;
   },

   /**
    * Get the current line style for the context.  <tt>null</tt> if
    * not set.
    * @type String
    */
   getLineStyle: function() {
      return this.lineStyle;
   },

   /**
    * Set the line width for drawing paths.
    *
    * @param width {Number} The width of lines in pixels
    * @default 1
    */
   setLineWidth: function(width) {
      this.lineWidth = width;
   },

   /**
    * Get the current line width for drawing paths.
    * @type Number
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * Set the fill style of the context.
    *
    * @param fillStyle {String} An HTML color, or <tt>null</tt>.
    */
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },

   /**
    * Get the current fill style of the context.
    * @type String
    */
   getFillStyle: function() {
      return this.fillStyle;
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawRectangle: function(rect) {
   },

   /**
    * Draw a filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawFilledRectangle: function(rect) {
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
   drawArc: function(point, radius, startAngle, endAngle) {
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
   drawFilledArc: function(point, radius, startAngle, endAngle) {
   },

   /**
    * Draw a polygon or polyline using a Duff's device for
    * efficiency and loop unrolling with inversion for speed.
    *
    * @param pointArray {Array} An array of <tt>Point2D</tt> objects
    * @param closedLoop {Boolean} <tt>true</tt> to close the polygon
    * @private
    */
   _poly: function(pointArray, closedLoop) {
      this.startPath();
      this.moveTo(pointArray[0]);
      var p = 1;

      // Using Duff's device with loop inversion
      switch((pointArray.length - 1) & 0x3)
      {
         case 3:
            this.lineSeg(pointArray[p++]);
         case 2:
            this.lineSeg(pointArray[p++]);
         case 1:
            this.lineSeg(pointArray[p++]);
      }

      if (p < pointArray.length)
      {
         do
         {
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
         } while (p < pointArray.length);
      }

      if (closedLoop)
      {
         this.endPath();
      }
   },

   /**
    * Draw an un-filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolygon: function(pointArray) {
      this._poly(pointArray, true);
      this.strokePath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw a non-closed poly line on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolyline: function(pointArray) {
      this._poly(pointArray, false);
      this.strokePath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw an filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawFilledPolygon: function(pointArray) {
      this._poly(pointArray, true);
      this.fillPath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw a line on the context.
    *
    * @param point1 {Point2D} The start of the line
    * @param point2 {Point2D} The end of the line
    */
   drawLine: function(point1, point2) {
   },

   /**
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    */
   drawPoint: function(point) {
   },

   /**
    * Draw a sprite on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param imageData {Image} The sprite to draw
    */
   drawSprite: function(sprite, time) {
   },

   /**
    * Draw an image on the context.
    *
    * @param rect {Rectangle2D} The rectangle that specifies the position and
    *             dimensions of the image rectangle.
    * @param image {Object} The image to draw onto the context
    */
   drawImage: function(rect, image) {
   },

   /**
    * Capture an image from the context.
    *
    * @param rect {Rectangle2D} The area to capture
    * @returns Image data capture
    * @type ImageData
    */
   getImage: function(rect) {
   },

   /**
    * Draw an image, captured with {@link #getImage}, to
    * the context.
    *
    * @param imageData {ImageData} Image data captured
    * @param point {Point2D} The poisition at which to draw the image
    */
   putImage: function(imageData, point) {
   },

   /**
    * Draw text on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param text {String} The text to draw
    */
   drawText: function(point, text) {
   },

   /**
    * Start a path.
    */
   startPath: function() {
   },

   /**
    * End a path.
    */
   endPath: function() {
   },

   /**
    * Stroke a path using the current line style and width.
    */
   strokePath: function() {
   },

   /**
    * Fill a path using the current fill style.
    */
   fillPath: function() {
   },

   /**
    * Move the current path to the point sepcified.
    *
    * @param point {Point2D} The point to move to
    */
   moveTo: function(point) {
   },

   /**
    * Draw a line from the current point to the point specified.
    *
    * @param point {Point2D} The point to draw a line to
    */
   lineTo: function(point) {
   },

   /**
    * Used to draw line segments for polylines.  If <tt>point</tt>
    * is <tt>null</tt>, the context will move to the next point.  Otherwise,
    * it will draw a line to the point.
    *
    * @param point {Point2D} The point to draw a line to, or null.
    */
   lineSeg: function(point) {
      if (point == null) {
         this.lineSeg.moveTo = true;
         return;
      }

      if (this.lineSeg.moveTo)
      {
         // Cannot have two subsequent nulls
         Assert((point != null), "LineSeg repeated null!", this);
         this.moveTo(point);
         this.lineSeg.moveTo = false;
      }
      else
      {
         this.lineTo(point);
      }
   },

   /**
    * Draw a quadratic curve from the current point to the specified point.
    *
    * @param cPoint {Point2D} The control point
    * @param point {Point2D} The point to draw to
    */
   quadraticCurveTo: function(cPoint, point) {
   },

   /**
    * Draw a bezier curve from the current point to the specified point.
    *
    * @param cPoint1 {Point2D} Control point 1
    * @param cPoint2 {Point2D} Control point 2
    * @param point {Point2D} The point to draw to
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
   },

   /**
    * Draw an arc from the current point to the specified point.
    *
    * @param point1 {Point2D} Arc point 1
    * @param point2 {Point2D} Arc point 2
    * @param radius {Number} The radius of the arc
    */
   arcTo: function(point1, point2, radius) {
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf RenderContext2D
    */
   getClassName: function() {
      return "RenderContext2D";
   }
});

return RenderContext2D;

});
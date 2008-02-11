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

   backgroundColor: null,

   /**
    * Reset the context, clearing it and preparing it for drawing.
    */
   reset: function() {
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
    * Creates a render list which will make inline calls to the
    * line drawing methods instead of looping over them.  Logically
    * this method returns a function which will draw the polygon.
    *
    * @param pointArray {Array} An array of Point2D objects
    * @type Function
    * @memberOf RenderContext2D
    */
   buildRenderList: function(pointArray) {
      return null;
   },

   /**
    * Draw an un-filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolygon: function(pointArray) {
   },

   /**
    * Draw an filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawFilledPolygon: function(pointArray) {
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
    * Draw an image on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param imageData {Image} The image to draw
    */
   drawImage: function(point, imageData) {
   },

   /**
    * Capture an image from the context.
    *
    * @param rect {Rectangle2D} The area to capture
    * @returns Image data capture
    * @type Image
    */
   getImage: function(rect) {
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
   },

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
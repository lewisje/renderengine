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
    * @memberOf RenderContext2D
    */
   reset: function() {
   },

   /**
    * @memberOf RenderContext2D
    */
   setBackgroundColor: function(color) {
      this.backgroundColor = color;
   },

   /**
    * @memberOf RenderContext2D
    */
   getBackgroundColor: function() {
      return this.backgroundColor;
   },

   /**
    * @memberOf RenderContext2D
    */
   setWidth: function(width) {
      this.width = width;
   },

   /**
    * @memberOf RenderContext2D
    */
   getWidth: function() {
      return this.width;
   },

   /**
    * @memberOf RenderContext2D
    */
   setHeight: function(height) {
      this.height = height;
   },

   /**
    * @memberOf RenderContext2D
    */
   getHeight: function() {
      return this.height;
   },

   /**
    * @memberOf RenderContext2D
    */
   setPosition: function(point) {
      this.position = point;
   },

   /**
    * @memberOf RenderContext2D
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * @memberOf RenderContext2D
    */
   setRotation: function(angle) {
      this.rotation = angle;
   },

   /**
    * @memberOf RenderContext2D
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * @memberOf RenderContext2D
    */
   setScale: function(scaleX, scaleY) {
      this.scaleX = scaleX;
      this.scaleY = scaleY;
   },

   /**
    * @memberOf RenderContext2D
    */
   getScaleX: function() {
      return this.scaleX;
   },

   /**
    * @memberOf RenderContext2D
    */
   getScaleY: function() {
      return this.scaleY;
   },

   /**
    * @memberOf RenderContext2D
    */
   setTransform: function(matrix) {
   },

   /**
    * @memberOf RenderContext2D
    */
   setLineStyle: function(lineStyle) {
      this.lineStyle = lineStyle;
   },

   /**
    * @memberOf RenderContext2D
    */
   getLineStyle: function() {
      return this.lineStyle;
   },

   /**
    * @memberOf RenderContext2D
    */
   setLineWidth: function(width) {
      this.lineWidth = width;
   },

   /**
    * @memberOf RenderContext2D
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * @memberOf RenderContext2D
    */
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },

   /**
    * @memberOf RenderContext2D
    */
   getFillStyle: function() {
      return this.fillStyle;
   },

   /**
    * @memberOf RenderContext2D
    */
   drawRectangle: function(point, width, height) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawFilledRectangle: function(point, width, height) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawArc: function(point, radiusX, startAngle, endAngle) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
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
    * @memberOf RenderContext2D
    */
   drawPolygon: function(pointArray) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawFilledPolygon: function(pointArray) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawLine: function(point1, point2) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawPoint: function(point) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawImage: function(point, imageData) {
   },

   /**
    * @memberOf RenderContext2D
    */
   getImage: function(rect) {
   },

   /**
    * @memberOf RenderContext2D
    */
   drawText: function(point, text) {
   },

   /**
    * @memberOf RenderContext2D
    */
   startPath: function() {
   },

   /**
    * @memberOf RenderContext2D
    */
   endPath: function() {
   },

   /**
    * @memberOf RenderContext2D
    */
   strokePath: function() {
   },

   /**
    * @memberOf RenderContext2D
    */
   fillPath: function() {
   },

   /**
    * @memberOf RenderContext2D
    */
   moveTo: function(point) {
   },

   /**
    * @memberOf RenderContext2D
    */
   lineTo: function(point) {
   },

   /**
    * @memberOf RenderContext2D
    */
   quadraticCurveTo: function(cPoint, point) {
   },

   /**
    * @memberOf RenderContext2D
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
   },

   /**
    * @memberOf RenderContext2D
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
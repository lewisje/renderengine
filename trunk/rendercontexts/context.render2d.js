/**
 * The Render Engine
 * RenderContext2D
 *
 * All 2D contexts should extend from this to inherit the
 * methods which abstract the drawing methods.
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

var RenderContext2D = RenderContext.extend({

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

   reset: function() {
   },

   setBackgroundColor: function(color) {
      this.backgroundColor = color;
   },

   getBackgroundColor: function() {
      return this.backgroundColor;
   },

   setWidth: function(width) {
      this.width = width;
   },

   getWidth: function() {
      return this.width;
   },

   setHeight: function(height) {
      this.height = height;
   },

   getHeight: function() {
      return this.height;
   },

   setPosition: function(point) {
      this.position = point;
   },

   getPosition: function() {
      return this.position;
   },

   setRotation: function(angle) {
      this.rotation = angle;
   },

   getRotation: function() {
      return this.rotation;
   },

   setScale: function(scaleX, scaleY) {
      this.scaleX = scaleX;
      this.scaleY = scaleY;
   },

   getScaleX: function() {
      return this.scaleX;
   },

   getScaleY: function() {
      return this.scaleY;
   },

   setTransform: function(matrix) {
   },

   setLineStyle: function(lineStyle) {
      this.lineStyle = lineStyle;
   },

   getLineStyle: function() {
      return this.lineStyle;
   },

   setLineWidth: function(width) {
      this.lineWidth = width;
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

   drawRectangle: function(point, width, height) {
   },

   drawFilledRectangle: function(point, width, height) {
   },

   drawArc: function(point, radiusX, startAngle, endAngle) {
   },

   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
   },

   /**
    * Creates a render list which will make inline calls to the
    * line drawing methods instead of looping over them.  Logically
    * this method returns a function which will draw the polygon.
    *
    * @param pointArray {Array} An array of Point2D objects
    * @type Function
    */
   buildRenderList: function(pointArray) {
      return null;
   },

   drawPolygon: function(pointArray) {
   },

   drawFilledPolygon: function(pointArray) {
   },

   drawLine: function(point1, point2) {
   },

   drawPoint: function(point) {
   },

   drawImage: function(point, imageData) {
   },

   getImage: function(rect) {
   },

   drawText: function(point, text) {
   },

   startPath: function() {
   },

   endPath: function() {
   },

   strokePath: function() {
   },

   fillPath: function() {
   },

   moveTo: function(point) {
   },

   lineTo: function(point) {
   },

   quadraticCurveTo: function(cPoint, point) {
   },

   bezierCurveTo: function(cPoint1, cPoint2, point) {
   },

   arcTo: function(point1, point2, radius) {
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "RenderContext2D";
   }

});
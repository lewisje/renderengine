/**
 * The Render Engine
 * RenderContext2D
 * 
 * All 2D contexts should extend from this to inherit the
 * methods which abstract the drawing methods.
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
 
var RenderContext2D = RenderContext.extend({
   
   width: 0,
   
   height: 0,
   
   lineStyle: null,
   
   fillStyle: null,
   
   setWidth: function(width) {
   },
   
   setHeight: function(height) {
   },
   
   setPosition: function(point) {
   },
   
   setRotation: function(angle) {
   },
   
   setScale: function(scaleX, scaleY) {
   },
   
   setTransform: function(matrix) {
   },
   
   setLineStyle: function(lineStyle) {
   },
   
   setLineWidth: function(width) {
   },
   
   setFillStyle: function(fillStyle) {
   },
   
   drawRectangle: function(point, width, height) {
   },
   
   drawFilledRectangle: function(point, width, height) {
   },
   
   drawArc: function(point, radiusX, startAngle, endAngle) {
   },

   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
   },
   
   drawPolygon: function(pointArray) {
   },

   drawFilledPolygon: function(pointArray) {
   },
   
   drawLine: function(point1, point2) {
   },
   
   drawPoint: function(point) {
   },
   
   drawImage: function(point, resource) {
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
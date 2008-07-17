/**
 * The Render Engine
 * WZGraphicsContext
 * Uses the library from http://www.walterzorn.com/jsgraphics/jsgraphics_e.htm
 *
 * Note: This context is not intended for games with a high framerate.
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
 * @class A WZGraphicsContext element represented within the engine.
 *
 * @extends RenderContext2D
 */
var WZGraphicsContext = RenderContext2D.extend(/** @scope CanvasContext.prototype */{

   mouseHandler: false,

   currentTransform: null,

   transformStack: null,

   fillColor: null,

   jq: null,

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
      var canvas = document.createElement("div");
      var worldScale = this.getWorldScale();
      $(canvas)
      	.css({width: this.width * worldScale[0], height: this.height * worldScale[1]})
      	.attr("id", this.getId());

      this.jg = new jsGraphics(canvas);
      this.currentTransform = { translate: [0, 0],
                           	  rotate: 0,
                           	  scale: [1.0, 1.0] };

      this.transformStack = [];

      this.base("WZGraphicsContext", canvas);
   },

   setWorldScale: function(scaleX, scaleY) {
      this.base(scaleX, scaleY);

      scaleY = scaleY ? scaleY : scaleX;
      // Adjust the element accordingly
      $(this.getElement())
         .attr("width", this.getWidth() * scaleX)
         .attr("height", this.getHeight() * scaleY);
   },

   /**
    * Gets the surface context upon which all objects are drawn.
    */
   get2DContext: function() {
      return this.jg;
   },

   /**
    * Push a transform state onto the stack.

    */
   pushTransform: function() {
      this.base();
      this.transformStack.push(this.currentTransform);
   },

   /**
    * Pop a transform state off the stack.

    */
   popTransform: function() {
      this.base();
      this.currentTransform = this.transformStack.pop();
   },

	/**
	 * Override the render method to call the WZGraphics
	 * paint() method.
	 * @private
	 */
   render: function(time) {
		this.base(time);
		this.get2DContext().paint();
	},


   //================================================================
   // Drawing functions

   /**
    * Reset the context, clearing it and preparing it for drawing.
    */
   reset: function() {
      this.get2DContext().clear();
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
		this.currentTransform.translate = [point.x, point.y];
      this.base(point);
   },

   /**
    * Set the rotation angle of the current transform
    *
    * @param angle {Number} An angle in degrees
    */
   setRotation: function(angle) {
		this.currentTransform.rotate = Math2D.degToRad(angle);
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
      this.currentTransform.scale = [scaleX, scaleY];
      this.base(scaleX, scaleY);
   },

   /**
    * Set the line style for the context.
    *
    * @param lineStyle {String} An HTML color or <tt>null</tt>
    */
   setLineStyle: function(lineStyle) {
      this.get2DContext().setColor(lineStyle);
      this.base(lineStyle);
   },

   /**
    * Set the line width for drawing paths.
    *
    * @param width {Number} The width of lines in pixels
    * @default 1
    */
   setLineWidth: function(width) {
      this.get2DContext().setStroke(width || 1);
      this.base(width);
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawRectangle: function(rect) {
      var rTL = rect.getTopLeft();
      var rDM = rect.getDims();
      this.get2DContext().drawRect(rTL.x, rTL.y, rDM.x, rDM.y);
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
      this.get2DContext().setColor(this.getFillStyle());
      this.get2DContext().fillRect(rTL.x, rTL.y, rDM.x, rDM.y);
      this.get2DContext().setColor(this.getLineStyle());
      this.base(rect);
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
		var topLeft = new Point2D(point.x - (radiusX * 0.5), point.y - (radiusX * 0.5));
      this.get2DContext().setColor(this.getFillStyle());
		this.get2DContext().fillArc(topLeft.x, topLeft.y, radiusX * 2, radiusX * 2, startAngle, endAngle);
      this.get2DContext().setColor(this.getLineStyle());
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * Draw a line on the context.
    *
    * @param point1 {Point2D} The start of the line
    * @param point2 {Point2D} The end of the line
    */
   drawLine: function(point1, point2) {
		this.get2DContext().drawLine(point1.x, point1.y, point2.x, point2.y);
      this.base(point1, point2);
   },

   /**
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    */
   drawPoint: function(point) {
      this.get2DContext().fillRect(point.x, point.y, 1.5, 1.5);
      this.base(point);
   },

   /**
    * Draw a sprite on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param sprite {Image} The sprite to draw
    */
   drawSprite: function(point, sprite) {
      this.base(point, sprite);
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

	splitArray: function(pointArray) {
		// Split points into two arrays
		var xA = [];
		var yA = [];
		if (pointArray && pointArray.length) {
			for (var x=0; x<pointArray.length; x++) {
				if (pointArray[x]) {
					xA.push(pointArray[x].x);
					yA.push(pointArray[x].y);
				}
			}
		}
		return [xA, yA];
	},

   /**
    * Draw an un-filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolygon: function(pointArray) {
		var a = this.splitArray(pointArray);
		this.get2DContext().drawPolygon(a[0], a[1]);
   },

   /**
    * Draw a non-closed poly line on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawPolyline: function(pointArray) {
		var a = this.splitArray(pointArray);
		this.get2DContext().drawPolyline(a[0], a[1]);
   },

   /**
    * Draw an filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    */
   drawFilledPolygon: function(pointArray) {
		var a = this.splitArray(pointArray);
      this.get2DContext().setColor(this.getFillStyle());
		this.get2DContext().fillPolygon(a[0], a[1]);
      this.get2DContext().setColor(this.getLineStyle());
   },


   /**
    * Get the class name of this object
    *
    * @type String

    */
   getClassName: function() {
      return "WZGraphicsContext";
   }
});


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

   quadTree: null,

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

      this.initQuadtree();
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
   // Spatial Quadtree

   /**
    * Build the quadtree that will be used to locate objects quickly within the
    * 2D world.
    * @private
    */
   initQuadtree: function() {

      var nodeIdx = 1;
      var smWidth = Math.floor(this.getWidth() / CanvasContext.MAX_QUAD_DIVISIONS);

      function subdivNode(node, rect) {
         var hW = Math.floor(rect.width / 2);
         var hH = Math.floor(rect.height / 2);

         if (hW < smWidth)
         {
            return;
         }

         // This node
         node.idx = nodeIdx++;
         node.rect = rect;
         node.objects = {};
         node.quads = [null, null, null, null];

         // Top-left
         var n;
         var r = new Rectangle2D(rect.x, rect.y, hW, hH);
         node.quads[0] = subdivNode({}, r);

         // Top-right
         r = new Rectangle2D(rect.x + hW, rect.y, hW, hH);
         node.quads[1] = subdivNode({}, r);

         // Bottom-left
         r = new Rectangle2D(rect.x, rect.y + hH, hW, hH);
         node.quads[2] = subdivNode({}, r);

         // Bottom-right
         r = new Rectangle2D(rect.x + hW, rect.y + hH, hW, hH);
         node.quads[3] = subdivNode({}, r);

         return node;
      }

      // Build the spatial quadtree
      this.quadTree = {};
      subdivNode(this.quadTree, new Rectangle2D(0, 0, this.getWidth(), this.getHeight()));
   },

   /**
    * Each time an object is updated, make sure to update the quadtree with the
    * positions of each.
    * @private
    */
   updateObject: function(obj, time) {
      // First, update the object
      this.base(obj, time);

      if (obj.RenderContext2D_lastNode && obj.RenderContext2D_lastNode.rect.containsPoint(obj.getPosition()))
      {
         // The object is within the same node
         return;
      }

      // Find the node with the object
      var aNode = this.findNode(obj.getPosition(), this.quadTree);
      if (aNode != null)
      {
         var objName = obj.getId();

         // If the object moved out of the last node it was in, update that
         if (obj.RenderContext2D_lastNode && (obj.RenderContext2D_lastNode.idx != aNode.idx))
         {
            delete obj.RenderContext2D_lastNode.objects[objName];
         }

         aNode.objects[objName] = "true";
         obj.RenderContext2D_lastNode = aNode;
      }
   },

   /**
    * Find the quadtree node which contains the point specified.
    * @param point {Point2D} The point to locate
    * @param node {Object} The node to look within
    * @type QuadtreeNode
    */
   findNode: function(point, node) {

      var sNode = null;
      if (node && node.rect.containsPoint(point))
      {
         if (node.quads[0] == null)
         {
            return node;
         }

         // Check the quads
         var p = 0;
         while (sNode == null && p < 4)
         {
            sNode = this.findNode(point, node.quads[p++]);
         }
      }
      else
      {
         return null;
      }

      return sNode;
   },

   //================================================================
   // Drawing functions

   /**

    */
   reset: function() {
      this.get2DContext().clearRect(0, 0, this.width, this.height);
   },

   /**

    */
   setBackgroundColor: function(color) {
      jQuery(this.getSurface()).css("background-color", color);
      this.base(color);
   },


   /**

    */
   setPosition: function(point) {
      this.get2DContext().translate(point.x, point.y);
      this.base(point);
   },

   /**

    */
   setRotation: function(angle) {
      this.get2DContext().rotate(Math2D.degToRad(angle));
      this.base(angle);
   },

   /**

    */
   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.get2DContext().scale(scaleX, scaleY);
      this.base(scaleX, scaleY);
   },

   /**

    */
   setTransform: function(matrix) {
   },

   /**

    */
   setLineStyle: function(lineStyle) {
      this.get2DContext().strokeStyle = lineStyle;
      this.base(lineStyle);
   },

   /**

    */
   setLineWidth: function(width) {
      this.get2DContext().lineWidth = width * 1.0;
      this.base(width);
   },

   /**

    */
   setFillStyle: function(fillStyle) {
      this.get2DContext().fillStyle = fillStyle;
      this.base(fillStyle);
   },

   /**

    */
   drawRectangle: function(point, width, height) {
      this.get2DContext().strokeRect(point.x, point.y, width, height);
      this.base(point, width, height);
   },

   /**

    */
   drawFilledRectangle: function(point, width, height) {
      this.get2DContext().fillRect(point.x, point.y, width, height);
      this.base(point, width, height);
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

    */
   drawArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endEngle);
      this.strokePath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**

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

    */
   drawPoint: function(point) {
      this.drawLine(point, point);
      this.base(point);
   },

   /**

    */
   drawImage: function(point, imageData) {
      this.get2DContext().putImageData(imageData, point.x, point.y);
      this.base(point, imageData);
   },

   /**

    */
   getImage: function(rect) {
      this.base()
      return this.get2DContext().getImageData(rect.x, rect.y, rect.width, rect.height);
   },

   /**

    */
   drawText: function(point, text) {

      this.base(point, text);
   },

   /**

    */
   startPath: function() {
      this.get2DContext().beginPath();
      this.base();
   },

   /**

    */
   endPath: function() {
      this.get2DContext().closePath();
      this.base();
   },

   /**

    */
   strokePath: function() {
      this.get2DContext().stroke();
      this.base();
   },

   /**

    */
   fillPath: function() {
      this.get2DContext().fill();
      this.base();
   },

   /**

    */
   moveTo: function(point) {
      this.get2DContext().moveTo(point.x, point.y);
      this.base();
   },

   /**

    */
   lineTo: function(point) {
      this.get2DContext().lineTo(point.x, point.y);
      this.base(point);
   },

   /**

    */
   quadraticCurveTo: function(cPoint, point) {
      this.get2DContext().quadraticCurveTo(cPoint.x, cPoint.y, point.x, point.y);
      this.base(cPoint, point);
   },

   /**

    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.get2DContext().bezierCurveTo(cPoint1.x, cPoint1.y, cPoint2.x, cPoint2.y, point.x, point.y);
      this.base(cPoint1, cPoint2, point);
   },

   /**

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
}, {

   /**
    * Maximum number of divisions in the spatial tree
    */
   MAX_QUAD_DIVISIONS: 8
});


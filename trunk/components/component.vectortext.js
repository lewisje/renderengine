/**
 * The Render Engine
 * VectorTextComponent
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
 * @class A render component that draws text.
 * @extends BaseComponent
 */
var VectorTextComponent = BaseComponent.extend(/** @scope VectorTextComponent.prototype */{

   strokeStyle: "#ffffff",     // Default to white lines

   lineWidth: 1,

   text: null,

   scale: 2,

   rText: null,

   alignment: 0,  // Left aligned

   spacing: 0,

   position: null,

   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 0.1);
   },

   /**
    * Calculate the bounding box for the text and set it on the host object.
    * @private
    */
   calculateBoundingBox: function() {
      var x1 = 0;
      var x2 = 0;
      var y1 = 0;
      var y2 = 0;
      for (var p = 0; p < this.rText.length; p++)
      {
         var pt = this.rText[p];

         if (pt.x < x1)
         {
            x1 = pt.x;
         }
         if (pt.x > x2)
         {
            x2 = pt.x;
         }
         if (pt.y < y1)
         {
            y1 = pt.y;
         }
         if (pt.y > y2)
         {
            y2 = pt.y;
         }
      }

      this.getHostObject().setBoundingBox(new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2));
   },

   /**
    * Set the render position of the text.
    *
    * @param point {Point2D} The position at which to start drawing the text
    */
   setPosition: function(point) {
      this.position = point;
   },

   /**
    * Get the render position of the text.
    * @type Point2D
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * Set the text to render.
    *
    * @param text {String} The text to vectorize
    * @param scale {Number} The size of the text. Default: 2
    */
   setText: function(text, scale) {
      // We only have uppercase letters
      this.text = String(text).toUpperCase();
      this.scale = scale || 2;
      this.rText = [];

      // Replace special chars
      this.text = this.text.replace(/&COPY;/g,"a").replace(/&REG;/g,"b");

      // Vectorize the text
      for (var c = 0; c < this.text.length; c++)
      {
         var glyph = this.text.charCodeAt(c) - 32;
         var ltr = [];
         for (var p = 0; p < VectorTextComponent.charSet[glyph].length; p++)
         {
            if (VectorTextComponent.charSet[glyph][p] != null)
            {
               // Point
               var pt = new Point2D(VectorTextComponent.charSet[glyph][p][0], VectorTextComponent.charSet[glyph][p][1]);
               pt.mul(this.scale);
               ltr.push(pt);
            }
            else
            {
               // Line break
               ltr.push(null);
            }
         }

         this.rText.push(ltr);
      }

      // Calculate spacing of letters based on scale
      this.spacing = ((this.scale * 10) + Math.ceil(this.scale * 1.5));

      this.calculateBoundingBox();
   },

   getText: function() {
      return this.text;
   },

   getTextSize: function() {
      return this.scale;
   },

   /**
    * Set the alignment of the text.
    *
    * @param alignment {Number} One of {@link #ALIGN_LEFT} or {@link #ALIGN_RIGHT}
    */
   setAlignment: function(alignment) {
      this.alignment = alignment;
   },

   /**
    * Set the color or style of the line.
    *
    * @param strokeStyle {String} Color
    */
   setLineStyle: function(strokeStyle) {
      this.strokeStyle = strokeStyle;
   },

   /**
    * Get the line style
    * @type String
    */
   getLineStyle: function() {
      return this.strokeStyle;
   },

   /**
    * Set the width of the line
    * @param lineWidth {Number} The width of the line in pixels
    */
   setLineWidth: function(lineWidth) {
      this.lineWidth = lineWidth;
   },

   /**
    * Get the width of the line
    * @type Number
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * @private
    */
   execute: function(renderContext, time) {
      var pC = new Point2D(this.position);

      // Set the stroke and fill styles
      if (this.getLineStyle() != null)
      {
         renderContext.setLineStyle(this.strokeStyle);
      }

      renderContext.setLineWidth(this.lineWidth);

      var lCount = this.rText.length;
      var letter = (this.alignment == Text2D.ALIGN_RIGHT ? this.rText.length - 1 : 0);
      var kern = new Point2D((this.alignment == Text2D.ALIGN_RIGHT ? -this.spacing : this.spacing), 0);
      var space = new Point2D((this.alignment == Text2D.ALIGN_RIGHT ? -this.spacing : this.spacing) * 0.07, 0);

      while (lCount-- > 0)
      {
         renderContext.pushTransform()
         renderContext.setPosition(pC);
         if (this.rText[letter].length == 0)
         {
            pC.add(space);
         }
         else
         {
            renderContext.drawPolyline(this.rText[letter]);
         }
         renderContext.popTransform();

         pC.add(kern);
         letter += (this.alignment == Text2D.ALIGN_RIGHT ? -1 : 1);
      }
   },

   /**
    * Get the class name of this object
    * @type String
    */
   getClassName: function() {
      return "VectorTextComponent";
   }


}, { // Statics

   /**
    * The character set
    * @private
    */
   charSet:
   [
      [ ], // Space
      [[ 0,-5],[ 0, 3.5],null   ,[ 0, 4.5],[-0.5, 4.75],[ 0, 5],[0.5, 4.75],[0, 4.5]], // !
      [[-1,-4],[-2,-4],[-2,-5],[-1,-5],[-1,-4],[-2,-2],null   ,[ 2,-4],[ 1,-4],[ 1,-5],[ 2,-5],[ 2,-4],[ 1,-2]], // "
      [ ], // #
      [[ 5,-4],[-3,-4],[-5,-3],[-3, 0],[ 3, 0],[ 5, 3],[ 3, 4],[-5, 4],null   ,[ 0,-5],[ 0, 5]], // $
      [ ], // %
      [ ], // &
      [[-1,-4],[-2,-4],[-2,-5],[-1,-5],[-1,-4],[-2,-2]], // '
      [[ 1,-5],[-1,-3],[-1, 3],[ 1, 5]], // (
      [[-1,-5],[ 1,-3],[ 1, 3],[-1, 5]], // )
      [[-3,-3],[ 3, 3],null   ,[ 3,-3],[-3, 3],null   ,[-3, 0],[ 3, 0],null   ,[ 0,-3],[ 0, 3]], // *
      [[-4, 0],[ 4, 0],null   ,[ 0,-4],[ 0, 4]], // +
      [[ 1, 4],[ 0, 4],[ 0, 3],[ 1, 3],[ 1, 4],[ 0, 5]], // ,
      [[-4, 0],[ 4, 0]], // -
      [[ 0, 4],[ 1, 4],[ 1, 3],[ 0, 3],[ 0, 4]], // .
      [[ 5,-5],[-5, 5]], // /
//15
      [[ 5,-5],[-1,-5],[-1, 5],[ 5, 5],[ 5,-5],null   ,[ 5,-5],[-1, 5]], // 0
      [[ 1,-4],[ 3,-5],[ 3, 5]], // 1
      [[-5,-3],[ 0,-5],[ 5,-3],[-5, 5],[ 5, 5]], // 2
      [[-5,-5],[ 5,-5],[ 0,-1],[ 5, 2],[ 0, 5],[-5, 3]], // 3
      [[-2,-3],[-5, 0],[ 5, 0],[ 5,-5],[ 5, 5]], // 4
      [[ 5,-5],[-5,-5],[-5, 0],[ 3, 0],[ 5, 2],[ 3, 5],[-5, 5]], // 5
      [[-5,-5],[-5, 5],[ 5, 5],[ 5, 0],[-5, 0]], // 6
      [[-5,-5],[ 5,-5],[-2, 5]], // 7
      [[ 0, 0],[-4,-2],[ 0,-5],[ 4,-2],[-4, 2],[ 0, 5],[ 4, 2],[ 0, 0]], // 8
      [[ 4, 0],[-4, 0],[-4,-5],[ 4,-5],[ 4, 0],[-4, 5]], // 9
//25
      [[ 0, 1],[ 1, 1],[ 1, 0],[ 0, 0],[ 0, 1],null   ,[ 0, 4],[ 1, 4],[ 1, 3],[ 0, 3],[ 0, 4]], // :
      [[ 0, 1],[ 1, 1],[ 1, 0],[ 0, 0],[ 0, 1],null   ,[ 1, 4],[ 0, 4],[ 0, 3],[ 1, 3],[ 1, 4],[ 0, 5]], // ;
      [[ 4,-5],[-2, 0],[ 4, 5]], // <
      [[-4,-2],[ 4,-2],null   ,[-4, 2],[ 4, 2]], // =
      [[-4,-5],[ 2, 0],[-4, 5]], // >
      [[-3,-3],[ 0,-5],[ 3,-3],[ 0,-1],[ 0, 2],null   ,[ 0, 4],[ 1, 4],[ 1, 3],[ 0, 3],[ 0, 4]], // ?
      [[ 3, 5],[-3, 5],[-5, 3],[-5,-3],[-3,-5],[ 3,-5],[ 5,-3],[ 5, 2],[ 3, 3],[ 0, 3],[ 0, 0],[ 3, 0]], // @
//32
      [[-5, 5],[ 0,-5],[ 5, 5],[ 2, 2],[-2, 2]], // A
      [[-4, 5],[-4,-5],[ 3,-5],[ 5,-3],[ 3, 0],[-4, 0],null   ,[ 3, 0],[ 5, 3],[ 3, 5],[-4, 5]], // B
      [[ 5,-3],[ 0,-5],[-5,-3],[-5, 3],[ 0, 5],[ 5, 3]], // C
      [[-4, 5],[-4,-5],[ 2,-5],[ 4,-3],[ 4, 3],[ 2, 5],[-4, 5]], // D
      [[ 5,-5],[ 0,-5],[-3,-3],[ 0, 0],[-3, 3],[ 0, 5],[ 5, 5]], // E
      [[-4, 5],[-4, 0],[ 0, 0],[-4, 0],[-4,-5],[ 4,-5]], // F
      [[ 5,-5],[-4,-5],[-4, 5],[ 5, 5],[ 5, 1],[ 2, 1]], // G
      [[-4, 5],[-4,-5],null   ,[-4, 0],[ 4, 0],null   ,[ 4,-5],[ 4, 5]], // H
      [[-3, 5],[ 3, 5],null   ,[ 0, 5],[ 0,-5],null   ,[-3,-5],[ 3,-5]], // I
      [[ 3,-5],[ 3, 3],[ 0, 5],[-3, 3]], // J
      [[-4, 5],[-4,-5],null   ,[-4, 0],[ 5,-5],null   ,[-4, 0],[ 5, 5]], // K
      [[-4,-5],[-4, 5],[ 5, 5]], // L
      [[-4, 5],[-4,-5],[ 0, 0],[ 5,-5],[ 5, 5]], // M
      [[-4, 5],[-4,-5],[ 5, 5],[ 5,-5]], // N
      [[ 5,-5],[-2,-5],[-2, 5],[ 5, 5],[ 5,-5]], // O
      [[-4, 5],[-4,-5],[ 3,-5],[ 5,-3],[ 3, 0],[-4, 0]], // P
      [[-5, 0],[ 0,-5],[ 5, 0],[ 0, 5],[-5, 0],null   ,[ 3, 3],[ 5, 5]], // Q
      [[-4, 5],[-4,-5],[ 3,-5],[ 5,-3],[ 3, 0],[-4, 0],null   ,[ 3, 0],[ 5, 5]], // R
      [[ 5,-5],[-3,-5],[-5,-3],[-3, 0],[ 3, 0],[ 5, 3],[ 3, 5],[-5, 5]], // S
      [[-4,-5],[ 4,-5],null   ,[ 0,-5],[ 0, 5]], // T
      [[-4,-5],[-4, 3],[-3, 5],[ 3, 5],[ 5, 3],[ 5,-5]], // U
      [[-5,-5],[ 0, 5],[ 5,-5]], // V
      [[-5,-5],[-3, 5],[ 0,-3],[ 3, 5],[ 5,-5]], // W
      [[-4,-5],[ 5, 5],null   ,[ 5,-5],[-4, 5]], // X
      [[-5,-5],[ 0,-2],[ 5,-5],null   ,[ 0,-2],[ 0, 5]], // Y
      [[-4,-5],[ 5,-5],[-4, 5],[ 5, 5]], // Z
//58
      [[ 2,-5],[-1,-5],[-1, 5],[ 2, 5]], // [
      [[-5,-5],[ 5, 5]], // \
      [[-2,-5],[ 1,-5],[ 1, 5],[-2, 5]], // ]
      [[-3,-3],[ 0,-5],[ 3,-3]], // ^
      [[-5, 5],[ 5, 5]], // _
      [[ 1,-4],[ 2,-4],[ 2,-5],[ 1,-5],[ 1,-4],[ 2,-2]],  // `
//64

      // &copy;
      [[ 5,-3],[ 0,-5],[-5,-3],[-5, 3],[ 0, 5],[ 5, 3],[ 5,-3],null   ,[ 3,-1],[ 0,-3],[-3,-1],[-3, 1],[ 0, 3],[ 3, 1]],
      // &reg;
      [[ 5,-3],[ 0,-5],[-5,-3],[-5, 3],[ 0, 5],[ 5, 3],[ 5,-3],null   ,[-3, 2],[-3,-2],[ 2,-2],[ 3,-1],[ 2, 0],[-3, 0],null   ,[ 2, 0],[ 3, 2]]
   ]
});

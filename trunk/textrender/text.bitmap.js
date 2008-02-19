/**
 * The Render Engine
 * BitmapText
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
 * @class A text renderer which draws text from a bitmap font file.
 * @extends AbstractTextRenderer
 */
var BitmapText = AbstractTextRenderer.extend(/** @scope BitmapText.prototype */{

   font: null,

   spacing: 0,

   constructor: function(font) {
      this.base();
      this.font = font;
   },

   /**
    * Calculate the bounding box for the text and set it on the host object.
    * @private
    */
   calculateBoundingBox: function() {
      return;

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
    * Set the text to render.
    *
    * @param text {String} The text to render
    */
   setText: function(text) {
      // If the font only supports uppercase letters
      text = (this.font.upperCaseOnly ? String(text).toUpperCase() : text);

      // Replace special chars
      text = text.replace(/&copy;/gi,"(C)").replace(/&reg;/gi,"(R)");

      this.base(text);

      this.calculateBoundingBox();
   },

   /**
    * @private
    */
   execute: function(renderContext, time) {

      if (this.getText().length == 0)
      {
         return;
      }

      var text = this.getText();
      var lCount = text.length;
      var align = this.getAlignment();
      var letter = (align == AbstractTextRenderer.ALIGN_RIGHT ? text.length - 1 : 0);
      var kern = new Point2D((align == AbstractTextRenderer.ALIGN_RIGHT ? -this.font.info.kerning : this.font.info.kerning), 0);
      var space = new Point2D((align == AbstractTextRenderer.ALIGN_RIGHT ? -this.font.info.space : this.font.info.space), 0);
      var cW, cH = this.font.info.height;
      var cS = 0;

      // Render the text
      var pc = new Point2D(0,0);

      // 1st pass: The text
      pc = new Point2D(0,0);
      letter = (align == AbstractTextRenderer.ALIGN_RIGHT ? text.length - 1 : 0);
      lCount = text.length;

      renderContext.get2DContext().globalCompositeOperation = "source-over";
      while (lCount-- > 0)
      {
         var glyph = text.charCodeAt(letter) - 32;
         if (glyph == 0)
         {
            // A space
            pc.add(space);
         }
         else
         {
            // Draw the text
            cS = this.font.info.letters[glyph - 1];
            cW = this.font.info.letters[glyph + 1] - cS;
            debugger;
            renderContext.get2DContext().drawImage(this.font.image, cS, 0, cW, cH, pc.x, pc.y, cW, cH);
         }

         letter += (align == AbstractTextRenderer.ALIGN_RIGHT ? -1 : 1);
      }

      // 2nd pass: The color
      renderContext.get2DContext().globalCompositeOperation = "source-in";
      while (lCount-- > 0)
      {
         var glyph = text.charCodeAt(letter) - 32;
         if (glyph == 0)
         {
            // A space
            pc.add(space);
         }
         else
         {
            // Draw a box the color we want and the size of the character
            cS = this.font.info.letters[glyph - 1];
            cW = this.font.info.letters[glyph + 1] - cS;
            var r = new Rectangle2D(pc.x, pc.y, cW, cH);
            renderContext.setFillStyle(this.getColor());
            renderContext.drawFilledRectangle(r);
         }

         letter += (align == AbstractTextRenderer.ALIGN_RIGHT ? -1 : 1);
      }


      // Reset the composition operation
      renderContext.get2DContext().globalCompositeOperation = "source-over";
   },

   /**
    * Get the class name of this object
    * @type String
    */
   getClassName: function() {
      return "BitmapText";
   }

});


/**
 * The Render Engine
 *
 * A sprite layer
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

Engine.include("/engine/engine.object2d.js");
Engine.include("/engine/engine.container.js");

Engine.initObject("SpriteLayer", "Object2D", function() {

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
var SpriteLayer = Object2D.extend({

   pixels: null,
   
   buffSize: 0,
   
   constructor: function() {
      this.base("Layer");

      this.pixels = [];
      this.buffSize = (SpriteEditor.editorSize / SpriteEditor.pixSize);
      this.buffSize *= this.buffSize;
      EngineSupport.fillArray(this.pixels, this.buffSize, null);

      //this.pixels = HashContainer.create();
      this.mirror = [false, false];
   },

   release: function() {
      this.base();
      this.pixels = null;
   },

   /**
    * Update the layer within the rendering context.  This draws
    * the shape to the context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);

      var rect = Rectangle2D.create(0, 0, 8, 8);
      var pt = Point2D.create(0, 0);
      var t = SpriteEditor.editorSize / SpriteEditor.pixSize;
      renderContext.setScale(SpriteEditor.pixSize / 8);
      for (var p = 0; p < this.buffSize; p++) {
         if (this.pixels[p]) {
            renderContext.pushTransform();
            pt.set((p % t) * 8, Math.floor(p / t) * 8);
            renderContext.setPosition(pt);
            renderContext.setFillStyle(this.pixels[p]);
            renderContext.drawFilledRectangle(rect);
            renderContext.popTransform();
         }
      }

      renderContext.popTransform();
   },

   getGridPixel: function(x, y) {
      var pSize = SpriteEditor.pixSize;
      x /= pSize;
      y /= pSize;
      x = Math.floor(x);
      y = Math.floor(y);
      return [x,y];     
   },

   addPixel: function(x, y) {
      var gP = this.getGridPixel(x, y);
      var t = SpriteEditor.editorSize / SpriteEditor.pixSize;
      this.pixels[gP[1] * t + gP[0]] = SpriteEditor.currentColor;
   },

   clearPixel: function(x, y) {
      var gP = this.getGridPixel(x, y);
      var t = SpriteEditor.editorSize / SpriteEditor.pixSize;
      this.pixels[gP[1] * t + gP[0]] = null;
   },

   getPixel: function(x, y) {
      var gP = this.getGridPixel(x, y);
      var t = SpriteEditor.editorSize / SpriteEditor.pixSize;
      return this.pixels[gP[1] * t + gP[0]];
   },
   
   flipVertical: function() {
      var rowSize = SpriteEditor.editorSize / SpriteEditor.pixSize;
      var flip = [];
      for (var y = rowSize + 1; y >= 0; y--) {
         var row = this.pixels.splice(y * rowSize, rowSize);
         flip = flip.concat(row);
      }
      this.pixels = flip;
   },
   
   flipHorizontal: function() {
      var flip = [];
      EngineSupport.fillArray(flip, this.buffSize, null);
      var rowSize = SpriteEditor.editorSize / SpriteEditor.pixSize;
      for (var x = 0; x < rowSize; x++) {
         for (var y = 0; y < rowSize; y++) {
            flip[(y * rowSize) + (rowSize - x)] = this.pixels[(y * rowSize) + x];
         }
      }
      this.pixels = flip;     
   },
   
   shiftLeft: function() {
      // Remove the first pixel of each row and insert it into the
      // last pixel
      var i = SpriteEditor.editorSize / SpriteEditor.pixSize;
      for (var r = 0; r < this.buffSize; r += i) {
         var pix = this.pixels.splice(r,1);
         this.pixels.splice(r + (i - 1), 0, pix[0]);
      }     
   },
   
   shiftRight: function() {
      // Remove the last pixel of each row and insert it into the
      // first pixel
      var i = SpriteEditor.editorSize / SpriteEditor.pixSize;
      for (var r = (i-1); r < this.buffSize; r += i) {
         var pix = this.pixels.splice(r,1);
         this.pixels.splice(r - (i - 1), 0, pix[0]);
      }     
   },
   
   shiftUp: function() {
      console.debug("up");
      // Remove the top row of pixels and add to the bottom
      var start = 0;
      var end = SpriteEditor.editorSize / SpriteEditor.pixSize; 
      //var topRow = this.pixels.slice(start, end);
      var topRow = this.pixels.splice(start, end);
      this.pixels = this.pixels.concat(topRow); 
   },
   
   shiftDown: function() {
      // Remove the bottom row of pixels and add to the top
      var start = this.buffSize - (SpriteEditor.editorSize / SpriteEditor.pixSize);
      var end = SpriteEditor.editorSize / SpriteEditor.pixSize;
      var botRow = this.pixels.splice(start, end);
      this.pixels = botRow.concat(this.pixels);
   }

}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "SpriteLayer";
   }
});

return SpriteLayer;

});
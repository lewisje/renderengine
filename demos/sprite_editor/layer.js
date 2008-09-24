
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

   constructor: function() {
      this.base("Layer");

      this.pixels = HashContainer.create();
   },

	release: function() {
		this.base();
		this.pixels = null;
	},

   /**
    * Update the player within the rendering context.  This draws
    * the shape to the context, after updating the transform of the
    * object.  If the player is thrusting, draw the thrust flame
    * under the ship.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);

		var itr = Iterator.create(this.pixels);
		while (itr.hasNext())
		{
			var pix = itr.next();
			renderContext.setFillStyle(pix.color);
			renderContext.drawFilledRectangle(pix.rect);
		}
		itr.destroy();
      renderContext.popTransform();
   },

   addPixel: function(x, y) {
		var pSize = SpriteEditor.pixSize;
      x = x - x % pSize;
      y = y - y % pSize;
		var pix = {
			color: SpriteEditor.currentColor,
			rect: Rectangle2D.create(x, y, pSize, pSize)
		};
		var p = "[" + x + "," + y + "]";
		this.pixels.add(p, pix);
   },

	clearPixel: function(x, y) {
		var pSize = SpriteEditor.pixSize;
      x = x - x % pSize;
      y = y - y % pSize;
		var p = "[" + x + "," + y + "]";
		this.pixels.removeHash(p);
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
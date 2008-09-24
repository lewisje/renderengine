
/**
 * The Render Engine
 *
 * The drawing grid
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

Engine.initObject("SpriteGrid", "Object2D", function() {

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
var SpriteGrid = Object2D.extend({

	pixels: null,

   constructor: function() {
      this.base("Grid");
      this.setZIndex(1000);
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

		renderContext.setLineStyle("silver");
		renderContext.setLineWidth(0.25);
		var sT = Point2D.create(0,0);
		var eD = Point2D.create(0,0);
		for (var x=0; x < SpriteEditor.editorSize; x += SpriteEditor.pixSize)
		{
			sT.set(x, 0);
			eD.set(x, SpriteEditor.editorSize);
			renderContext.drawLine(sT, eD);
		}

		for (var y=0; y < SpriteEditor.editorSize; y += SpriteEditor.pixSize)
		{
			sT.set(0, y);
			eD.set(SpriteEditor.editorSize, y);
			renderContext.drawLine(sT, eD);
		}

      renderContext.popTransform();
   }

}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "SpriteGrid";
   }
});

return SpriteGrid;

});
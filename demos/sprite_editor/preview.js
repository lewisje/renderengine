
/**
 * The Render Engine
 *
 * The preview canvas
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

Engine.include("/rendercontexts/context.canvascontext.js");

Engine.initObject("SpritePreview", "CanvasContext", function() {

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
var SpritePreview = CanvasContext.extend({

	imgData: null,
	
   constructor: function() {
      this.base("Preview", 64, 64);
		this.imgData = this.get2DContext().getImageData(0,0,64,64);
   },
	
	addPixel: function(x, y, colr) {
		colr = colr.replace("#", "");
		var rgb = [];
		var c = /(\w{2})(\w{2})(\w{2})/.exec();
		if (c) {
			rgb[0] = parseInt(c[1], 16);
			rgb[1] = parseInt(c[2], 16);
			rgb[2] = parseInt(c[3], 16);
		}
		this.imgData.data[(y*64 + x)*4] = rgb[0];	
		this.imgData.data[((y*64 + x)*4) + 1] = rgb[1];	
		this.imgData.data[((y*64 + x)*4) + 2] = rgb[2];	
		this.imgData.data[((y*64 + x)*4) + 3] = 255;
	},
	
	removePixel: function(x, y) {
		this.imgData.data[(y*64 + x)*4] = 0;	
		this.imgData.data[((y*64 + x)*4) + 1] = 0;	
		this.imgData.data[((y*64 + x)*4) + 2] = 0;	
		this.imgData.data[((y*64 + x)*4) + 3] = 0;	
	},

   /**
    * Update the context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);

		this.get2DContext().putImageData(this.imgData, 0, 0);

		// Now copy across the image to the preview in the editor
		SpriteEditor.previewImage.attr("src", this.getDataURL());

      renderContext.popTransform();
   }
	
}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "SpritePreview";
   }
});

return SpritePreview;

});
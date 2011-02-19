/**
 * The Render Engine
 * RenderUtil
 *
 * @fileoverview A static class with helper methods for rendering
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2011 Brett Fattori (brettf@renderengine.com)
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.util.RenderUtil",
	"requires": [
		"R.rendercontexts.CanvasContext",
		"R.math.Point2D",
		"R.math.Rectangle2D"
	]
});

/**
 * @class A static class rendering utilities.
 *
 * @static
 */
R.util.RenderUtil = /** @scope R.util.RenderUtil.prototype */ {
	
	tempContext: null,
	
	renderComponentToImage: function(renderComponent, width, height, offset) {
      // Create the temporary context to render to
      if (R.util.RenderUtil.tempContext == null) {
         R.util.RenderUtil.tempContext = R.rendercontexts.CanvasContext.create("renderUtilTemp", 800, 800);
         if (typeof FlashCanvas != "undefined") {
            FlashCanvas.initElement(R.util.RenderUtil.tempContext.getSurface());
         }
			
			// When the engine shuts down, clean up the context
			R.Engine.onShutdown(function() {
				R.util.RenderUtil.tempContext.destroy();
				R.util.RenderUtil.tempContext = null;
			})
      }

		// The position and origin to render to in the context
		offset = offset || Point2D.ZERO;
		
		// Clear the temporary context and render to it
		R.util.RenderUtil.tempContext.getElement().width = width + 1;
		R.util.RenderUtil.tempContext.getElement().height = height + 1;
		R.util.RenderUtil.tempContext.reset();
		var p = R.math.Point2D.create(0,0);
		p.add(offset);
		R.util.RenderUtil.tempContext.setPosition(p);
		p.destroy();
		renderComponent.execute(R.util.RenderUtil.tempContext, R.Engine.worldTime);
		
		// Extract the rendered image
		return R.util.RenderUtil.tempContext.getDataURL();
	}
	
};
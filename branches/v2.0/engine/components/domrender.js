/**
 * The Render Engine
 * DOMRenderComponent
 *
 * @fileoverview DOM element render component.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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
	"class": "R.components.DOMRender",
	"requires": [
		"R.components.Render"
	]
});

/**
 * @class Render component for DOM elements.  This component will ensure that
 * 		 the DOM CSS transformations are applied to the host object per frame.
 *
 * @param name {String} The name of the component
 * @param priority {Number} The priority of the component between 0.0 and 1.0
 * @constructor
 * @extends R.components.Render
 * @description Creates a DOM element render component.
 */
R.components.DOMRender = function() {
	return R.components.Render.extend(/** @scope DOMRenderComponent.prototype */{

   /**
    * Handles whether or not the component should draw to the
    * render context.
    *
    * @param renderContext {R.rendercontexts.HTMLElementContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
		if (this.base(renderContext, time)) {
			renderContext.drawElement(this.getHostObject());
		}
   }

}, /** @scope R.components.DOMRender.prototype */{ 

   /**
    * Get the class name of this object
    *
    * @return {String} "R.components.DOMRender"
    */
   getClassName: function() {
      return "R.components.DOMRender";
   }
});
}
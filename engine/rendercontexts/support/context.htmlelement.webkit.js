/**
 * The Render Engine
 * 
 * Additional support for transforms in the Safari/Webkit browsers 
 * for the HTMLElementContext.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

/**
 * @class Extending HTMLElementContext for Safari to include CSS transformations.
 *
 * @extends HTMLElementContext
 * @constructor
 * @description Create an instance of an HTML element rendering context.  This context
 * represents any HTML element.
 * @param name {String} The name of the context
 * @param element {Number} The element which is the surface of the context.
 * @see DocumentContext
 */
var HTMLElementContext = HTMLElementContext.extend(/** @scope HTMLElementContext.prototype */{

	/**
	 * Set the rotation angle of the current transform
	 *
	 * @param angle {Number} An angle in degrees
	 */
	setRotation: function(angle) {
		this.jQ().css("-webkit-transform", "rotate(" + angle + "deg)");
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
		this.jQ().css("-webkit-transform", "scale(" + scaleX + "," + scaleY + ")");
		this.base(scaleX, scaleY);
	}

});

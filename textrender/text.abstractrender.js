/**
 * The Render Engine
 * AbstractTextRenderer
 *
 * @fileoverview Abstract class that provides basic interface for all
 *     text render objects used by the text renderer.
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

// Includes
Engine.include("/components/component.base.js");

Engine.initObject("AbstractTextRenderer", "BaseComponent", function() {

/**
 * @class Abstract class that provides the basic interface for all
 *        text render objects used by the {@link TextRenderer}.
 *
 * @constructor
 * @param componentName {String} The name of the renderer
 * @param priority {Number} The priority of the rendering order. Default: <tt>0.1</tt>
 */
var AbstractTextRenderer = BaseComponent.extend(/** @scope AbstractTextRenderer.prototype */{

   text: null,

   color: "#000000",

   alignment: 0,

   weight: 1,

	/**
	 * @private
	 */
   constructor: function(componentName, priority) {
      this.base(componentName || "TextRenderObject", BaseComponent.TYPE_RENDERING, priority || 0.1);

      this.text = "";
      this.weight = 1;
   },

	/**
	 * @private
	 */
   release: function() {
      this.base();
      this.text = null;
      this.color= "#000000";
      this.alignment = 0;
      this.weight = 1;
   },

   /**
    * Get the text being rendered
    * @return {String} The text this renderer will draw
    */
   getText: function() {
      return this.text;
   },

   /**
    * Set the text to be rendered
    *
    * @param text {String} The text to render
    */
   setText: function(text) {
      this.text = text;
   },

   /**
    * Set the weight of the text to render.  Higher weights
    * are bolder text.
    *
    * @param weight {Number} The weight of the text.
    */
   setTextWeight: function(weight) {
      this.weight = weight;
   },

   /**
    * Get the weight of the text to render.
    * @return {Number} The weight of the text
    */
   getTextWeight: function() {
      return this.weight;
   },

   /**
    * Set the color of the text to render.
    *
    * @param color {String} The color of the text to render
    */
   setColor: function(color) {
      this.color = color;
   },

   /**
    * Get the color of the text to render.
    * @return {String} The text color
    */
   getColor: function() {
      return this.color;
   },

   /**
    * Set the alignment of the text to one of the constants {@link #ALIGN_LEFT}, {@link #ALIGN_RIGHT}, or
    *	{@link #ALIGN_CENTER}.
    *
    * @param alignment {Number} The alignment constant for the text
    */
   setAlignment: function(alignment) {
      this.alignment = alignment;
   },

   /**
    * Get the alignment of the text.
    * @return {Number} The alignment of the text
    */
   getAlignment: function() {
      return this.alignment;
   }

}, /** @scope AbstractTextRenderer.prototype */{

   /**
    * Get the class name of this object
    * @return {String} The string "AbstractTextRenderer"
    */
   getClassName: function() {
      return "AbstractTextRenderer";
   },

   /**
    * Align text with the left edge of the string at the point specified.
    * @type Number
    */
   ALIGN_LEFT: 0,

   /**
    * Align text with the right edge of the string at the point specified
    * @type Number
    */
   ALIGN_RIGHT: 1,

   /**
    * Align text with the center of the string at the point specified
    * @type Number
    */
   ALIGN_CENTER: 2

});

return AbstractTextRenderer;

});

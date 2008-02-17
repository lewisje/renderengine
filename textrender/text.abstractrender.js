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

/**
 * @class Abstract class that provides basic interface for all
 *     text render objects used by the text renderer.
 *
 * @constructor
 * @param text {String} The text to render
 * @param weight {Number} The weight (boldness) of the text. Default: 1
 */
var AbstractTextRenderer = BaseComponent.extend(/** @scope AbstractTextRenderer */{

   text: null,

   color: "#000000",

   alignment: 0,

   weight: 1,

   constructor: function() {
      this.base("TextRenderObject", BaseComponent.TYPE_RENDERING, 0.1);

      this.text = "";
      this.weight = 1;
   },

   /**
    * Get the text being rendered
    * @type String
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
    * @type Number
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
    * @type String
    */
   getColor: function() {
      return this.color;
   },

   /**
    * Set the alignment of the text.
    *
    * @param alignment {Number} The alignment for the text
    */
   setAlignment: function(alignment) {
      this.alignment = alignment;
   },

   /**
    * Get the alignment of the text.
    * @type Number
    */
   getAlignment: function() {
      return this.alignment;
   },

   /**
    * Get the class name of this object
    * @type String
    */
   getClassName: function() {
      return "AbstractTextRenderer";
   }

}, /** @scope AbstractTextRenderer.prototype */{

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

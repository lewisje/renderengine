/**
 * The Render Engine
 *
 * @fileoverview A text renderer object that uses a specific render
 *               object to produce text when a render context cannot.
 *
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
 * @class A 2d text rendering object.
 *
 * @constructor
 * @param renderer {AbstractTextRenderer} The text renderer to use
 * @param text {String} The text to render
 * @param size {Number} The size of the text to render
 */
var TextRenderer = Object2D.extend(/** @scope TextRenderer.prototype */{

   drawMode: 0,

   constructor: function(renderer, text, size) {

      Assert((renderer instanceof AbstractTextRenderer), "Text renderer must extend AbstractTextRenderer");

      this.base("TextRenderer");

      // Add components to move and draw the asteroid
      this.renderer = renderer;
      this.add(this.renderer);
      this.add(new Transform2DComponent("transform"));
      this.getComponent("TextRenderObject").setText(text || "");
      this.getComponent("transform").setScale(size || 1);
   },

   update: function(renderContext, time) {

      if (this.drawMode == TextRenderer.DRAW_TEXT)
      {
         renderContext.pushTransform();
         this.base(renderContext, time);
         renderContext.popTransform();
      }

   },

   /**
    * Set the text for this object to render.
    *
    * @param text {String} The text to render.
    */
   setText: function(text) {
      this.getComponent("TextRenderObject").setText(text);
   },

   /**
    * Get the text for this object to render.
    *
    * @type String
    */
   getText: function() {
      return this.getComponent("TextRenderObject").getText();
   },

   /**
    * Set the size of the text to render.
    *
    * @param size {Number} Defaults to 1
    */
   setTextSize: function(size) {
      this.getComponent("transform").setScale(size || 1);
   },

   /**
    * Get the size of the text to render.
    * @type Number
    */
   getTextSize: function() {
      this.getComponent("transform").getScale();
   },

   /**
    * Set the weight (boldness) of the text.
    *
    * @param weight {Number} The boldness of the text
    */
   setTextWeight: function(weight) {
      this.getComponent("TextRenderObject").setTextWeight(weight);
   },

   /**
    * Get the weight of the text.
    * @type Number
    */
   getTextWeight: function() {
      this.getComponent("TextRenderObject").getTextWeight();
   },

   /**
    * Get the position where the text will render.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("transform").getPosition();
   },

   /**
    * Set the position where the text will render.
    *
    * @param point {Point2D} The position to render the text
    */
   setPosition: function(point) {
      this.getComponent("transform").setPosition(point);
   },

   /**
    * Set the horizontal alignment of the text.
    *
    * @param alignment {Boolean} One of {@link #ALIGN_LEFT} or {@link #ALIGN_RIGHT}
    */
   setTextAlignment: function(alignment) {
      this.getComponent("TextRenderObject").setAlignment(alignment);
   },

   /**
    * Get the horizontal alignment of the text.
    * @type Number
    */
   getTextAlignment: function() {
      this.getComponent("TextRenderObject").getAlignment();
   },

   /**
    * Set the color of the text to render.
    *
    * @param color {String} The color of the text
    */
   setColor: function(color) {
      this.getComponent("TextRenderObject").setColor(color);
   },

   /**
    * Get the color of the text to render
    * @type String
    */
   getColor: function() {
      this.getComponent("TextRenderObject").getColor();
   },

   /**
    * Set the color of the text.
    *
    * @param textColor {String} Color of the text.
    */
   setTextColor: function(textColor) {
      this.getComponent("TextRenderObject").setColor(textColor);
   },

   /**
    * Get the line style
    * @type String
    */
   getTextColor: function() {
      return this.getComponent("TextRenderObject").getColor();
   },

   setDrawMode: function(drawMode) {
      this.drawMode = drawMode;
   },

   getDrawMode: function() {
      return this.drawMode;
   },

   /**
    * Get the class name of this object
    *
    * @type String

    */
   getClassName: function() {
      return "TextRenderer";
   }


}, /** @scope TextRenderer.prototype */{

   /**
    * Draw the text to the context.
    */
   DRAW_TEXT: 0,

   /**
    * Don't draw the text to the context.
    */
   NO_DRAW: 1
});


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

// Includes
Engine.include("/platform/engine.object2d.js");
Engine.include("/components/component.transform2d.js");

Engine.initObject("TextRenderer", "Object2D", function() {

/**
 * @class A 2d text rendering object.  The object hosts the given text
 *        renderer, and a way to position and size the text.  It is up
 *        to the rendered provided to present the text within the render
 *        context.
 *
 * @constructor
 * @param renderer {AbstractTextRenderer} The text renderer to use
 * @param text {String} The text to render
 * @param size {Number} The size of the text to render
 * @see VectorText
 * @see BitmapText
 */
var TextRenderer = Object2D.extend(/** @scope TextRenderer.prototype */{

   drawMode: 0,

   /**
    * @private
    */
   constructor: function(renderer, text, size) {

      Assert((renderer instanceof AbstractTextRenderer), "Text renderer must extend AbstractTextRenderer");

      this.base("TextRenderer");

      // Add components to move and draw the asteroid
      this.renderer = renderer;
      this.add(this.renderer);
      this.add(Transform2DComponent.create("transform"));
      this.getComponent("TextRenderObject").setText(text || "");
      this.getComponent("transform").setScale(size || 1);
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.drawMode = 0;
   },

   /**
    * Called to render the text to the context.
    *
    * @param renderContext {RenderContext} The context to render the text upon
    * @param time {Number} The engine time in milliseconds
    */
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
    * @return {String} The text to draw
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
    * @return {Number} The size/scale of the text
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
    * @return {Number} The text weight
    */
   getTextWeight: function() {
      this.getComponent("TextRenderObject").getTextWeight();
   },

   /**
    * Get the position where the text will render.
    * @return {Point2D} The position of the text
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
    * @param alignment {Number} One of {@link AbstractTextRenderer#ALIGN_LEFT}, {@link AbstractTextRenderer#ALIGN_RIGHT}
    *                  or {@link AbstractTextRenderer#ALIGN_CENTER}
    */
   setTextAlignment: function(alignment) {
      this.getComponent("TextRenderObject").setAlignment(alignment);
   },

   /**
    * Get the horizontal alignment of the text.
    * @return {Number} The alignment constant for the text
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
    * @return {String} The text color
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
    * Get the text color
    * @return {String} The color or style of the line
    */
   getTextColor: function() {
      return this.getComponent("TextRenderObject").getColor();
   },

   /**
    * Set the text drawing mode to either {@link #DRAW_TEXT} or {@link #NO_DRAW}.
    *
    * @param drawMode {Number} The drawing mode for the text.
    */
   setDrawMode: function(drawMode) {
      this.drawMode = drawMode;
   },

   /**
    * Get the current drawing mode for the text.
    * @return {Number} The text drawing mode
    */
   getDrawMode: function() {
      return this.drawMode;
   }
}, /** @scope TextRenderer.prototype */{

   /**
    * Get the class name of this object
    * @return {String} The string "TextRenderer"
    */
   getClassName: function() {
      return "TextRenderer";
   },

   /**
    * Draw the text to the context.
    * @type Number
    */
   DRAW_TEXT: 0,

   /**
    * Don't draw the text to the context.
    * @type Number
    */
   NO_DRAW: 1
});

return TextRenderer;

});


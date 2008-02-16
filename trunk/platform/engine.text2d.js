/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The asteroid object
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

Engine.load("/components/component.vectortext.js");

var Text2D = Object2D.extend({

   constructor: function(text, size) {
      this.base("Text2D");

      // Add components to move and draw the asteroid
      this.add(new VectorTextComponent("text"));
      this.getComponent("text").setText(text, size);
   },

   update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

   },

   setText: function(text) {
      var t = this.getComponent("text");
      var sz = t.getTextSize();
      this.getComponent("text").setText(text, sz);
   },

   setTextSize: function(size) {
      var t = this.getComponent("text");
      var txt = t.getText();
      this.getComponent("text").setText(txt, size);
   },

   getPosition: function() {
      return this.getComponent("text").getPosition();
   },

   setPosition: function(point) {
      this.getComponent("text").setPosition(point);
   },

   /**
    * Set the alignment of the text.
    *
    * @param alignment {Boolean} One of {@link #ALIGN_LEFT} or {@link #ALIGN_RIGHT}
    */
   setAlignment: function(alignment) {
      this.getComponent("text").setAlignment(alignment);
   },

   /**
    * Set the color or style of the line.
    *
    * @param strokeStyle {String} Color
    */
   setLineStyle: function(strokeStyle) {
      this.getComponent("text").setLineStyle(strokeStyle);
   },

   /**
    * Get the line style
    * @type String
    */
   getLineStyle: function() {
      return this.getComponent("text").getLineStyle();
   },

   /**
    * Set the width of the line
    * @param lineWidth {Number} The width of the line in pixels
    */
   setLineWidth: function(lineWidth) {
      this.getComponent("text").setLineWidth(lineWidth);
   },

   /**
    * Get the width of the line
    * @type Number
    */
   getLineWidth: function() {
      return this.getComponent("text").getLineWidth();
   },

   /**
    * Get the class name of this object
    *
    * @type String

    */
   getClassName: function() {
      return "Text2D";
   }


}, { // Static

   ALIGN_LEFT: false,

   ALIGN_RIGHT: true,

});


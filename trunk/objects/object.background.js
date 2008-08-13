/**
 * The Render Engine
 *
 * @fileoverview An object which loads an image and a collision map
 *               for usage as a single layered scrolling background.
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
 * @class A scrolling background render context with an associated
 *        collision map.  The render context loads a level which defines
 *        the image that will be displayed within a rendering context.
 *
 * @constructor
 * @param name {String} The name of the object
 * @param level {Level} A level object to use for this scrolling background
 * @param windowWidth {Number} The width of the viewable window, in pixels
 * @param windowHeight (Number} The height of the viewable window, in pixels
 * @extends HTMLElementContext
 */
var ScrollingBackground = HTMLElementContext.extend(/** @scope ScrollingBackground.prototype */{

   canvasContext: null,

   jQ: null,

   constructor: function(name, level, windowWidth, windowHeight) {

      // Create an element for us to use as our window
      var e = $("<div style='overflow: hidden; width:" + windowWidth + "px; height:" + windowHeight + "px'></div>");
      this.base(name || "ScrollingBackground", e[0]);

      this.jQ = $(this.getSurface());

      // Draw the image
      this.jQ.append($(level.getSourceImage()).clone());
      //this.canvasContext.drawImage(level.getFrame(), level.getSourceImage());
   },

   release: function() {
      this.base();
      this.canvasContext = null;
      this.jQ = null;
   },

   setScrollPosition: function(point) {
      this.jQ[0].scrollLeft = point.x;
      this.jQ[0].scrollTop = point.y;
   },

   setHorizontalScroll: function(x) {
      this.jQ[0].scrollLeft = x;
   },

   setVerticalScroll: function(y) {
      this.jQ[0].scrollTop = y;
   }

}, /** @scope ScrollingBackground */{

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ScrollingBackground";
   }
});


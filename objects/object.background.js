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

Engine.initObject("ScrollingBackground", "HTMLElementContext", function() {

/**
 * @class A scrolling background render context with an associated
 *        collision map.  The render context loads a level which defines
 *        the image that will be displayed within a rendering context.
 *
 * @constructor
 * @param name {String} The name of the object
 * @param level {Level} A level object to use for this scrolling background
 * @param windowWidth {Number} The width of the viewable window, in pixels
 * @param windowHeight {Number} The height of the viewable window, in pixels
 * @example ScrollingBackground.create("background", levelObj, 640, 448);
 * @extends HTMLElementContext
 */
var ScrollingBackground = HTMLElementContext.extend(/** @scope ScrollingBackground.prototype */{

   context: null,

   jQ: null,

   scrollEvt: false,

   /**
    * @private
    */
   constructor: function(name, context, level, windowWidth, windowHeight) {

      // Create an element for us to use as our window
      var e = $("<div style='overflow: hidden; width:" + windowWidth + "px; height:" + windowHeight + "px'></div>");
      this.base(name || "ScrollingBackground", e[0]);

      this.jQ = $(this.getSurface());
      this.context = context;

      // Set up an event handler so that if something external sets our
      // scroll, we can mimic it in the context
      var self = this;
      this.jQ.bind("scroll", function(evt) {
         self.onScroll(evt);
      });
      this.scrollEvt = false;

      // Draw the image
      this.jQ.append($(level.getSourceImage()).clone());
   },

   destroy: function() {
      this.jQ.unbind("scroll");
      this.base();
   },

   onScroll: function(evt) {
      var pt = Point2D.create(-this.jQ[0].scrollLeft, this.jQ[0].scrollTop);
      this.context.setWorldPosition(pt);
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.canvasContext = null;
      this.jQ = null;
   },

   /**
    * Set the scroll position for the background using a {@link Point2D} to
    * define the X and Y scroll amount.
    *
    * @param point {Point2D} The scroll position along X and Y
    */
   setScrollPosition: function(point) {
      if (!this.scrollEvt) {
         this.jQ[0].scrollLeft = point.x;
         this.jQ[0].scrollTop = point.y;
      }

      this.context.setWorldPosition(point);
   },

   /**
    * Set the horizontal scroll amount in pixels.
    *
    * @param x {Number} The horizontal scroll in pixels
    */
   setHorizontalScroll: function(x) {
      this.jQ[0].scrollLeft = x;
      var wP = this.context.getWorldPosition();
      wP.set(x, wP.y);
      this.context.setWorldPosition(wP);
   },

   /**
    * Set the vertical scroll amount in pixels.
    *
    * @param y {Number} The vertical scroll in pixels
    */
   setVerticalScroll: function(y) {
      this.jQ[0].scrollTop = y;
      var wP = this.context.getWorldPosition();
      wP.set(wP.x, y);
      this.context.setWorldPosition(wP);
   },

   /**
    * Get the horizontal scroll amount in pixels.
    * @return {Number} The horizontal scroll
    */
   getHorizontalScroll: function() {
      return this.jQ[0].scrollLeft;
   },

   /**
    * Get the vertical scroll amount in pixels.
    * @return {Number} The vertical scroll
    */
   getVerticalScroll: function() {
      return this.jQ[0].scrollTop;
   }

}, /** @scope ScrollingBackground.prototype */{

   /**
    * Get the class name of this object
    * @return {String} The string "ScrollingBackground"
    */
   getClassName: function() {
      return "ScrollingBackground";
   }
});

return ScrollingBackground;

});


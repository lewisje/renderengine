/**
 * The Render Engine
 * Object2D
 *
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 59 $
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
 * @class An object for use in a 2D environment.  Methods for getting position, rotation
 * and scale should be implemented within the extended class.
 * @extends HostObject
 */
var Object2D = HostObject.extend(/** @scope Object2D.prototype */{

   /** @private */
   zIndex: 1,

   /** @private */
   bBox: null,

   /**
    * Set the bounding box of this object
    *
    * @param rect {Rectangle2D} The rectangle that completely encompasses
    *                           this object.
    * @memberOf HostObject
    */
   setBoundingBox: function(rect) {
      this.bBox = rect;
   },

   /**
    * Get the bounding box of this object
    *
    * @type Rectangle2D
    * @memberOf HostObject
    */
   getBoundingBox: function() {
      return this.bBox;
   },

   getWorldBox: function() {
      return new Rectangle2D(this.getBoundingBox()).offset(this.getPosition());
   },

   setPosition: function(point) {
   },

   getPosition: function() {
      return Point2D.ZERO;
   },

   setRotation: function(angle) {
   },

   getRotation: function() {
      return 0;
   },

   setScale: function(scaleX, scaleY) {
   },

   getScaleX: function() {
      return 1;
   },

   getScaleY: function() {
      return 1;
   },

   /**
    * Set the depth at which this object will render to
    * the context.  The lower the z-index, the further
    * away from the front the object will draw.
    *
    * @param zIndex {Number} The z-index of this object
    * @memberOf HostObject
    */
   setZIndex: function(zIndex) {
      this.zIndex = zIndex;
   },

   /**
    * Get the depth at which this object will render to
    * the context.
    *
    * @type Number
    * @memberOf HostObject
    */
   getZIndex: function() {
      return this.zIndex;
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf HostObject
    */
   getClassName: function() {
      return "Object2D";
   }

});

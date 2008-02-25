/**
 * The Render Engine
 * Transform2DComponent
 *
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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
 * @class A simple component that has position, rotation, and scale.
 * @extends BaseComponent
 */
var Transform2DComponent = BaseComponent.extend(/** @scope Transform2DComponent.prototype */{

   position: null,

   rotation: 0,

   scale: 1.0,

   lastPosition: null,

   /**
    * @constructor
    * @memberOf Transform2DComponent
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 1.0);
      this.position = new Point2D(0,0);
      this.lastPosition = new Point2D(0,0);
   },

   /**
    * @memberOf Transform2DComponent
    */
   setPosition: function(point) {
      this.setLastPosition(this.getPosition());
      this.position.set(point);
   },

   /**
    * @memberOf Transform2DComponent
    */
   getPosition: function() {
      return this.position;
   },

   setLastPosition: function(point) {
      this.lastPosition.set(point);
   },

   getLastPosition: function() {
      return this.lastPosition;
   },

   /**
    * @memberOf Transform2DComponent
    */
   setRotation: function(rotation) {
      this.rotation = rotation;
   },

   /**
    * @memberOf Transform2DComponent
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * @memberOf Transform2DComponent
    */
   setScale: function(scale) {
      this.scale = scale;
   },

   /**
    * @memberOf Transform2DComponent
    */
   getScale: function() {
      return this.scale;
   },

   /**
    * @memberOf Transform2DComponent
    */
   execute: function(renderContext, time) {

      renderContext.setPosition(this.position);
      renderContext.setRotation(this.rotation);
      renderContext.setScale(this.scale, this.scale);

   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Transform2DComponent
    */
   getClassName: function() {
      return "Transform2DComponent";
   }



});
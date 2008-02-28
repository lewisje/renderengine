/**
 * The Render Engine
 * 2DMoverComponent
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
 * @class A simple mover component that adjusts the translation of a component
 * over time.  This component handles velocity, acceleration, and
 * deceleration.
 *
 * @param name {String} The name of the component
 * @param priority {Number} The priority of this component between 0.0 and 1.0
 * @extends Transform2DComponent
 */
var Mover2DComponent = Transform2DComponent.extend(/** @scope Mover2DComponent.prototype */{

   lastTime: -1,

   velocity: null,

   angularVelocity: 0,

   lPos: null,

   constructor: function(name, priority) {
      this.velocity = new Vector2D(0,0);
      this.acceleration = new Vector2D(0,0);
      this.base(name, priority || 1.0);
      this.lPos = new Point2D(0,0);
   },

   /**
    * Updates the transformation of the component, setting the
    * position and rotation based on the time that has elapsed since
    * the last update.  This component handles frame rate independent
    * updates so that lag between frames doesn't affect the relative
    * position or rotation.
    *
    * @param renderContext {RenderContext} The render context for the component
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
      this.lPos.set(this.getPosition());
      var rot = this.getRotation();

      // If we've just come into the world, we can short circuit with a
      // quick addition of the velocity.
      if (this.lastTime == -1)
      {
         this.setPosition(this.lPos.add(this.velocity));
      }
      else
      {
         var diff = (time - this.lastTime) * 0.1;
         var vz = new Vector2D(this.velocity).mul(diff);
         this.setPosition(this.lPos.add(vz));

         this.setRotation(rot + this.angularVelocity * (diff));
      }

      this.base(renderContext, time);
      this.lastTime = time;
   },

   /**
    * Set the velocity vector of the component.
    *
    * @param vector {Vector2D} The velocity vector
    */
   setVelocity: function(vector) {
      this.velocity.set(vector);
   },

   /**
    * Returns the velocity vector of the component
    * @type Vector2D
    */
   getVelocity: function() {
      return this.velocity;
   },

   /**
    * Set the angular velocity as a number of degrees per second.
    *
    * @param angularVelocity {Number} The angle change per second
    */
   setAngularVelocity: function(angularVelocity) {
      this.angularVelocity = angularVelocity;
   },

   /**
    * Returns the angle change per second of the component.
    * @type Number
    */
   getAngularVelocity: function() {
      return this.angularVelocity;
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Mover2DComponent
    */
   getClassName: function() {
      return "Mover2DComponent";
   }

});
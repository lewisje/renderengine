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

// Includes
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.transform2d.js");

Engine.initObject("Mover2DComponent", "Transform2DComponent", function() {

/**
 * @class A simple mover component that adjusts the transformation of a component
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

   vDecay: 0,

   angularVelocity: 0,

   lPos: null,
	
	maxVelocity: 0,

	acceleration: null,

   constructor: function(name, priority) {
      this.base(name, priority || 1.0);
      this.velocity = new Vector2D(0,0);
      this.acceleration = new Vector2D(0,0);
      this.lPos = new Point2D(0,0);
      this.vDecay = 0;
		this.maxVelocity = -1;
   },

   release: function() {
      this.base();
      this.lastTime = -1;
      this.velocity = null;
      this.vDecay = 0;
      this.angularVelocity = 0;
      this.lPos = null;
		this.maxVelocity = -1;
		this.acceleration = null;
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
    * @param rendering {Boolean} <tt>true</tt> during the render phase
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
         if (this.vDecay != 0 && this.velocity.len() > 0) {
            // We need to decay the velocity by the amount
            // specified until velocity is zero, or less than zero
            var invVelocity = Vector2D.create(this.velocity).neg();
            invVelocity.mul(this.vDecay);

            this.velocity.add(invVelocity);
         }

         var diff = (time - this.lastTime) * 0.1;
			var oldVel = Vector2D.create(this.velocity);
			this.velocity.add(this.getAcceleration());
			if (this.maxVelocity != -1 && this.velocity.len() > this.maxVelocity) {
				this.velocity.set(oldVel);
			}
         var vz = Vector2D.create(this.velocity).mul(diff);
         this.setPosition(this.lPos.add(vz));
         this.setRotation(rot + this.angularVelocity * (diff));
      }

      this.lastTime = time;
      this.base(renderContext, time);
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
	 * Set the acceleration vector.  Acceleration will
	 * be constantly applied to the last position.
	 * @param {Vector2D} The acceleration vector
	 */
	setAcceleration: function(vector) {
		this.acceleration.set(vector);
	},
	
	/**
	 * Get the acceleration vector.
	 * @return {Vector2D} The acceleration vector
	 */
	getAcceleration: function() {
		return this.acceleration;
	},
	
	/**
	 * Set the maximum velocity magnitude.  Setting this
	 * value to <tt>-1</tt> indicates that there is no
	 * maximum velocity.
	 * @param {Number} The maximum velocity
	 */
	setMaxVelocity: function(maxVel) {
		this.maxVelocity = maxVel;
	},
	
	/**
	 * Get the maximum velocity.
	 * @return {Number} The maximum velocity
	 */
	getMaxVelocity: function() {
		return this.maxVelocity;
	},

   /**
    * Set the decay rate at which the velocity will
    * approach zero.  You can use this value to cause
    * a moving object to eventually stop moving. i.e. similar
    * to friction.
    *
    * @param decay {Number} The rate at which velocity decays
    */
   setVelocityDecay: function(decay) {
      this.vDecay = decay;
   },

   /**
    * Get the rate at which velocity will decay to zero.
    * @return The velocity decay rate
    * @type Number
    */
   getVelocityDecay: function() {
      return this.vDecay;
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
   }
}, {
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

return Mover2DComponent;

});
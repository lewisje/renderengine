/**
 * The Render Engine
 * 2DMoverComponent
 * 
 * A simple mover component that adjusts the translation of a component
 * over time.  This component handles velocity, acceleration, and
 * deceleration.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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
 
var Mover2DComponent = Transform2DComponent.extend({
   
   lastTime: -1,
   
   velocity: new Vector2D(0,0),
   
   acceleration: new Vector2D(0,0),
   
   angularVelocity: 0,
   
   execute: function(renderContext, time) {
      var pos = this.getPosition();
      var rot = this.getRotation();
      
      // If we've just come into the world, we can short circuit with a
      // quick addition of the velocity.
      if (this.lastTime == -1)
      {
         this.setPosition(pos.add(velocity));
      }
      else
      {
         var vz = velocity.mul(this.lastTime);
         var az = acceleration.mul(0.5).mul(time * time);
         pos.add(vz).add(az);
         this.setPosition(pos);
         
         //this.setRotation(rot + angularVelocity * (time - this.lastTime));
      }
      
      this.lastTime = time;
   },
   
   setVelocity: function(vector) {
      this.velocity.set(vector);
   },

   getVelocity: function() {
      return this.velocity;
   },
   
   setAcceleration: function(vector) {
      this.acceleration.set(vector);
   },
   
   getAcceleration: function() {
      return this.acceleration;
   },
   
   setAngularVelocity: function(angularVelocity) {
      this.angularVelocity = angularVelocity;
   },

   getAngularVelocity: function() {
      return this.angularVelocity;
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Mover2DComponent";
   }
   
});
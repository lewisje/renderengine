/**
 * The Render Engine
 * ParticleEngine
 *
 * A simple particle engine
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

var Particle = Base.extend(/** @scope Particle.prototype */{



   constructor: function(lifetime) {

   },

   draw: function(renderContext, time) {

   },

});


/**
 * The particle engine is simply a system for updating, and expiring
 * particles within a game environment.  This is registered with the
 * render context so it will be updated at regular intervals.
 *
 */
var ParticleEngine = BaseObject.extend(/** @scope ParticleEngine.prototype */{

   particles: null,

   constructor: function() {
      this.base("ParticleEngine");
      this.particles = [];
   },

   /**
    * Add a particle to the system.
    *
    * @param particle {Particle} A particle to animate
    */
   addParticle: function(particle) {
      this.particles.push(particle);
   },

   /**
    * Update the particles within the render context, and for the specified time.
    *
    * @param renderContext {RenderContext} The context the particles will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      var p = 1;

      // Using Duff's device with loop inversion
      switch((this.particles.length - 1) & 0x5)
      {
         case 5:
            this.particles[p++].draw(renderContext, time);
         case 4:
            this.particles[p++].draw(renderContext, time);
         case 3:
            this.particles[p++].draw(renderContext, time);
         case 2:
            this.particles[p++].draw(renderContext, time);
         case 1:
            this.particles[p++].draw(renderContext, time);
      }

      if (p < this.particles.length)
      {
         do
         {
            this.particles[p++].draw(renderContext, time);
            this.particles[p++].draw(renderContext, time);
            this.particles[p++].draw(renderContext, time);
            this.particles[p++].draw(renderContext, time);
            this.particles[p++].draw(renderContext, time);
            this.particles[p++].draw(renderContext, time);
         } while (p < this.particles.length);
      }
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ParticleEngine";
   }

});
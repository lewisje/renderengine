/**
 * The Render Engine
 * ParticleEngine
 *
 * @fileoverview The particle engine and base particle class.
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
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("Particle", "PooledObject", function() {

/**
 * @class Base particle class.  A particle only needs to implement the
 *        <tt>draw()</tt> method. The remainder of the functionality is
 *        handled by this abstract class.
 *
 * @param lifetime {Number} The life of the particle, in milliseconds
 * @extends PooledObject
 * @constructor
 * @description Create a particle
 */
var Particle = PooledObject.extend(/** @scope Particle.prototype */{

   life: 0,
   engine: null,
   birth: 0,
   dead: false,

   /**
    * @private
    */
   constructor: function(lifetime) {
      this.base("Particle");
      this.life = lifetime;
      this.birth = 0;
      this.dead = false;
   },

   /**
    * Release the object back into the pool.
    */
   release: function() {
      this.base();
      this.life = 0;
      this.engine = null;
      this.birth = 0;
      this.dead = true;
   },

   /**
    * Initializes the object within the <tt>ParticleEngine</tt>
    * @param pEngine {ParticleEngine} The particle engine which owns the particle
    * @param time {Number} The world time when the particle was created
    * @private
    */
   init: function(pEngine, time) {
      this.engine = pEngine;
      this.life += time;
      this.birth = time;
      this.dead = false;
   },

   /**
    * Update the particle in the render context, calling its draw method.
    * @param renderContext {RenderContext} The context where the particle is drawn
    * @param time {Number} The world time, in milliseconds
    */
   update: function(renderContext, time) {
      if (time < this.life) {
         // Draw it ( I think this is an optimization point )
         this.draw(renderContext, time);
         return true;
      } else {
         return false;
      }
   },

   /**
    * Get the time-to-live for the particle (when it will expire)
    * @return {Number} milliseconds
    */
   getTTL: function() {
      return this.life;
   },

   /**
    * Get the time at which the particle was created
    * @return {Number} milliseconds
    */
   getBirth: function() {
      return this.birth;
   },

   /**
    * [ABSTRACT] Draw the particle
    * @param renderContext {RenderContext} The context to render the particle to
    * @param time {Number} The world time, in milliseconds
    */
   draw: function(renderContext, time) {
      // ABSTRACT
   }
   
}, /** @scope Particle.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "Particle"
    */
   getClassName: function() {
      return "Particle";
   }
});

return Particle;

});

Engine.initObject("ParticleEngine", "BaseObject", function() {

/**
 * @class The particle engine is a simple system for updating, and expiring
 *        particles within a game environment.  This is registered with the
 *        render context so it will be updated at regular intervals.  The maximum
 *        number of supported particles can be configured, but defaults to 120. 
 *
 * @extends BaseObject
 * @constructor
 * @description Create a particle engine
 */
var ParticleEngine = BaseObject.extend(/** @scope ParticleEngine.prototype */{

   particles: null,
   lastTime: 0,
   maximum: 0,
   force: 0,

   /**
    * @private
    */
   constructor: function() {
      this.base("ParticleEngine");
      this.particles = [];
      this.maximum = ParticleEngine.MAX_PARTICLES;
   },

   /**
    * @private
    */
   destroy: function() {
      while (this.particles.length > 0) {
         var p = this.particles.shift();
         if (p) p.destroy();
      }
      this.base();
   }, 

   /**
    * Releases the object back into the pool.
    */
   release: function() {
      this.base();
      this.particles = null,
      this.lastTime = 0;
      this.maximum = 0;
   },

   /**
    * Add a particle to the system.
    *
    * @param particle {Particle} A particle to animate
    */
   addParticle: function(particle) {
      var i = 0;
      this.sortParticles();
      for (var p in this.particles) {
         // Find first available slot and insert the particle
         if (this.particles[p] == null) {
            this.particles[p] = particle;
            this.force = 0;
            break;
         }
         i++;
      }
      if (i == this.particles.length && this.particles.length < this.maximum) {
         // If there are slots available, add the particle
         // and reset the override pointer
         this.particles.push(particle);
         this.force = 0;
      } else if (i == this.maximum) {
         // If there are no free slots, insert new particles 
         // at the beginning of the list
         var oldParticle = this.particles[this.force];
         this.particles[this.force] = particle;
         this.force = this.force++ > (this.maximum - 2) ? 0 : this.force;
         
         // Destroy the old particle
         oldParticle.destroy();
         return;
      }
      particle.init(this, this.lastTime);
   },
   
   /**
    * Set the absolute maximum number of particles the engine will allow.
    * @param maximum {Number} The maximum particles the particle engine allows
    */
   setMaximum: function(maximum) {
      this.maximum = maximum;
   },
   
   /**
    * Get the maximum number of particles allowed in the particle engine.
    * @return {Number}
    */
   getMaximum: function() {
      return this.maximum;
   },
   
   /**
    * Sort live particles to the beginning of the list, ordered by remaining life
    * @private
    */
   sortParticles: function() {
      this.particles.sort(function(a,b) {
         return a && b ? (a.getTTL() - Engine.worldTime) - (b.getTTL() - Engine.worldTime) : !a ? 1 : b ? -1 : 0;
      });
   },

   /**
    * Update a particle, removing it and nulling its reference
    * if it is dead.  Only live particles are updated
    * @private
    */
   runParticle: function(idx, renderContext, time) {
      if (this.particles[idx] !== null && !this.particles[idx].update(renderContext, time)) {
         this.particles[idx].destroy();
         this.particles[idx] = null;
      }
   },

   /**
    * Update the particles within the render context, and for the specified time.
    *
    * @param renderContext {RenderContext} The context the particles will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      var p = 1,live=0;
      this.lastTime = time;
      for (live=0;live<this.particles.length;live++) {
         if (this.particles[live] == null) {
            break;
         }
      }
      Engine.addMetric("particles", live, true, "#");
      if (live == 0) {
         return;
      }

      renderContext.pushTransform();

      // Using Duff's device with loop inversion for speed
      switch((this.particles.length - 1) & 0x3) {
         case 3:
            this.runParticle(p++,renderContext,time);
         case 2:
            this.runParticle(p++,renderContext,time);
         case 1:
            this.runParticle(p++,renderContext,time);
      }

      if (p < this.particles.length) {
         do
         {
            this.runParticle(p++,renderContext,time);
            this.runParticle(p++,renderContext,time);
            this.runParticle(p++,renderContext,time);
            this.runParticle(p++,renderContext,time);
         } while (p < this.particles.length);
      }
      
      renderContext.popTransform();
   },

   /**
    * Get the properties object for the particle engine
    * @return {Object}
    */
   getProperties: function() {
      var self = this;
      var prop = this.base(self);
      return $.extend(prop, {
         "Count" : [function() { return self.particles.length; },
                    null, false]
      });
   }


}, /** @scope ParticleEngine.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "ParticleEngine"
    */
   getClassName: function() {
      return "ParticleEngine";
   },
   
   /**
    * Default maximum number of particles in the system. To change
    * the value, see {@link ParticleEngine#setMaximum}
    * @type Number
    */
   MAX_PARTICLES: 120
});

return ParticleEngine;

});
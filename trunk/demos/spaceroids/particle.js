/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * A simple particle
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

Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.particles.js");

Engine.initObject("SimpleParticle", "Particle", function() {

/**
 * @class A simple particle
 *
 * @param pos {Point2D} The starting position of the particle.  A
 *            velocity vector will be derived from this position.
 */
var SimpleParticle = Particle.extend(/** @scope SimpleParticle.prototype */{

   pos: null,
   vec: null,

   constructor: function(pos, ttl) {
      this.base(ttl || 2000);
      this.pos = Point2D.create(pos);

      var a = Math.floor(Math2.random() * 360);
      this.vec = Math2D.getDirectionVector(Point2D.ZERO, SimpleParticle.ref, a);
      var vel = 1 + (Math2.random() * 2);
      this.vec.mul(vel);
   },

	destroy: function() {
		this.pos.destroy();
		this.vec.destroy();
		this.base();
	},
	
   release: function() {
      this.base();
      this.pos = null;
      this.vec = null;
   },

   /**
    * Called by the particle engine to draw the particle to the rendering
    * context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   draw: function(renderContext, time) {
      this.pos.add(this.vec);
      renderContext.setPosition(this.pos);

      var colr = "#fff";
      if (Spaceroids.evolved && !Spaceroids.isAttractMode) {
         var s = time - this.getBirth();
         var e = this.getTTL() - this.getBirth();
         colr = 255 - Math.floor(255 * (s / e));
         colr += (-10 + (Math.floor(Math2.random() * 20)));
         var fb = (Math2.random() * 100);
         if (fb > 90) {
            colr = 255;
         }

         colr = "#" + (colr.toString(16) + colr.toString(16) + colr.toString(16));
      }

      renderContext.setFillStyle(colr);
      renderContext.drawPoint(Point2D.ZERO);
   }

}, {
   getClassName: function() {
      return "SimpleParticle";
   },

   // A simple reference point for the "up" vector
   ref: new Point2D(0, -1)
});

return SimpleParticle;

});

Engine.initObject("TrailParticle", "Particle", function() {

/**
 * @class A simple particle
 *
 * @param pos {Point2D} The starting position of the particle.  A
 *            velocity vector will be derived from this position.
 */
var TrailParticle = Particle.extend(/** @scope TrailParticle.prototype */{

   pos: null,
   vec: null,
   clr: null,

   constructor: function(pos, rot, spread, color, ttl) {
      this.base(ttl || 2000);
      this.clr = color;
      this.pos = Point2D.create(pos);
      var a = rot + Math.floor((180 - (spread / 2)) + (Math2.random() * (spread * 2)));
      this.vec = Math2D.getDirectionVector(Point2D.ZERO, TrailParticle.ref, a);
      var vel = 1 + (Math2.random() * 2);
      this.vec.mul(vel);
   },

	destroy: function() {
		this.pos.destroy();
		this.vec.destroy();
		this.base();
	},

   release: function() {
      this.base();
      this.pos = null;
      this.vec = null;
   },

   /**
    * Called by the particle engine to draw the particle to the rendering
    * context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   draw: function(renderContext, time) {
      this.pos.add(this.vec);
      renderContext.setPosition(this.pos);
      renderContext.setFillStyle(this.clr);
      renderContext.drawPoint(Point2D.ZERO);
   }

}, {
   getClassName: function() {
      return "TrailParticle";
   },

   // A simple reference point for the "up" vector
   ref: Point2D.create(0, -1)
});

return TrailParticle;

});
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
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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

R.Engine.define({
	"class": "SimpleParticle",
	"requires": [
		"R.particles.AbstractParticle",
		"R.components.Vector2D",
		"R.math.Point2D",
		"R.math.Vector2D",
		"R.math.Math2D",
		"R.math.Rectangle2D"
	]
});

/**
 * @class A simple particle
 *
 * @param pos {Point2D} The starting position of the particle.  A
 *            velocity vector will be derived from this position.
 */
var SimpleParticle = function() {
	return R.particles.AbstractParticle.extend(/** @scope SimpleParticle.prototype */{

   vec: null,
   decel: 0,
	invVel: null,

   constructor: function(pos, ttl, decel) {
      this.base(ttl || 2000);
      this.setPosition(pos.x, pos.y);

      var a = Math.floor(R.lang.Math2.random() * 360);
      this.vec = R.math.Math2D.getDirectionVector(R.math.Point2D.ZERO, SimpleParticle.ref, a);
      var vel = 1 + (R.lang.Math2.random() * 5);
      this.vec.mul(vel);
      this.decel = decel;
		this.invVel = R.math.Vector2D.create(0,0);
   },

   destroy: function() {
      this.vec.destroy();
		this.invVel.destroy();
      this.base();
   },
   
   release: function() {
      this.base();
      this.vec = null;
		this.invVel = null;
      this.decel = 0;
   },

   /**
    * Called by the particle engine to draw the particle to the rendering
    * context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   draw: function(renderContext, time) {
      if (this.decel > 0 && this.vec.len() > 0) {
         this.invVel.set(this.vec).neg();
         this.invVel.mul(this.decel);
         this.vec.add(this.invVel);
      }
      
      this.getPosition().add(this.vec);
 
      var colr = "#fff";
      if (!Spaceroids.isAttractMode) {
         var s = time - this.getBirth();
         var e = this.getTTL() - this.getBirth();
         colr = 255 - Math.floor(255 * (s / e));
         colr += (-10 + (Math.floor(R.lang.Math2.random() * 20)));
         var fb = (R.lang.Math2.random() * 100);
         if (fb > 90) {
            colr = 255;
         }

         colr = "#" + (colr.toString(16) + colr.toString(16) + colr.toString(16));
      }

      renderContext.setFillStyle(colr);
      renderContext.drawPoint(this.getPosition());
   }

}, {
   getClassName: function() {
      return "SimpleParticle";
   },

   // A simple reference point for the "up" vector
   ref: R.math.Point2D.create(0, -1)
});
}

R.Engine.define({
	"class": "TrailParticle",
	"requires": [
		"R.particles.AbstractParticle",
		"R.components.Vector2D",
		"R.math.Point2D",
		"R.math.Vector2D",
		"R.math.Math2D"
	]
});

/**
 * @class A simple particle
 *
 * @param pos {Point2D} The starting position of the particle.  A
 *            velocity vector will be derived from this position.
 */
var TrailParticle = function(){
	return R.particles.AbstractParticle.extend(/** @scope TrailParticle.prototype */{
	
		vec: null,
		clr: null,
		
		constructor: function(pos, rot, spread, color, ttl){
			this.base(ttl || 2000);
			this.clr = color;
			this.setPosition(pos.x, pos.y);
			var a = rot + Math.floor((180 - (spread / 2)) + (R.lang.Math2.random() * (spread * 2)));
			this.vec = R.math.Math2D.getDirectionVector(R.math.Point2D.ZERO, TrailParticle.ref, a);
			var vel = 1 + (R.lang.Math2.random() * 2);
			this.vec.mul(vel);
		},
		
		destroy: function(){
			this.vec.destroy();
			this.base();
		},
		
		release: function(){
			this.base();
			this.vec = null;
		},
		
		setColor: function(color){
			this.clr = color;
		},
		
		/**
		 * Called by the particle engine to draw the particle to the rendering
		 * context.
		 *
		 * @param renderContext {RenderContext} The rendering context
		 * @param time {Number} The engine time in milliseconds
		 */
		draw: function(renderContext, time){
			this.getPosition().add(this.vec);
			renderContext.setFillStyle(this.clr);
			renderContext.drawPoint(this.getPosition());
		}
		
	}, {
		getClassName: function(){
			return "TrailParticle";
		},
		
		// A simple reference point for the "up" vector
		ref: R.math.Point2D.create(0, -1)
	});
}

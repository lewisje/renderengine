
/**
 * The Render Engine
 *
 * A bouncing ball
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 642 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

// Load engine objects
Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("WiiBall", "Object2D", function() {

   /**
    * @class The block object.  Represents a block which is dropped from
    *        the top of the playfield and is used to build a hand.  Each
    *        block is one of 6 designs.  Each block is comprised of tiles
    *        which are cards that make up a hand, including wild cards.
    */
   var WiiBall = Object2D.extend({

      sprites: null,

      atRest: false,

		circle: null,
		
		upVec: null,

      // Debugging collision box and bounding box
      cBox: null,
      wBox: null,

      constructor: function() {
         this.base("WiiBall");
         this.sprite = null;

         // The element which we render to
         this.setElement($("<div>").css({ position: "absolute", width: 60, height: 60 }));

         // Debugging
         this.cBox = $("<div>").css({ position: "absolute", display: "none", border: "1px dashed blue"});
         WiiTest.getRenderContext().getSurface().append(this.cBox);
         this.wBox = $("<div>").css({ position: "absolute", display: "none", border: "2px solid blue"});
         WiiTest.getRenderContext().getSurface().append(this.wBox);

         // Add components to move and draw the player
         this.add(Mover2DComponent.create("move"));
         this.add(SpriteComponent.create("draw"));
         this.add(ColliderComponent.create("collide", WiiTest.getCModel()));
         
         // The sprites
         this.sprites = [];
         this.sprites.push(WiiTest.spriteLoader.getSprite("redball", "red"));
         this.sprites.push(WiiTest.spriteLoader.getSprite("redball", "blue"));
         this.setSprite(0);

         this.setPosition(Point2D.create(5, 5));
         this.setGravity(Point2D.create(0, 1));
         this.setVelocity(Vector2D.create(2, 0));
         this.atRest = false;
			
			this.circle = Circle2D.create(Point2D.create(0, 0), 30);
			this.upVec = Vector2D.create(0, -1);
			
			//this.setVelocityDecay(0.3);
      },

      /**
       * Update the ball within the rendering context.  This draws
       * the shape to the context, after updating the transform of the
       * object.  Also handles debug boxes.
       *
       * @param renderContext {RenderContext} The rendering context
       * @param time {Number} The engine time in milliseconds
       */
      update: function(renderContext, time) {
         renderContext.pushTransform();
         this.checkBounce();
         this.base(renderContext, time);
         renderContext.popTransform();

         if (Engine.getDebugMode()) {
            // Find our collision node and put a box around it
            if (this.ModelData && this.ModelData.lastNode) {
               var n = this.ModelData.lastNode.getRect().get();
               this.cBox.css({
                  display: "block",
                  left: n.x,
                  top: n.y,
                  width: n.w,
                  height: n.h
               });
            }

            var b = this.getWorldBox().get();
            this.wBox.css({
               display: "block",
               left: b.x,
               top: b.y,
               width: b.w,
               height: b.h
            });
         }

      },

      /**
       * Set the sprite to render with on the draw component.
       * @param spriteIdx {Number} The sprite index
       */
      setSprite: function(spriteIdx) {
         var sprite = this.sprites[spriteIdx];
         this.jQ().css("background", "url('" + sprite.getSourceImage().src + "') no-repeat");
         this.setBoundingBox(sprite.getBoundingBox());
         this.getComponent("draw").setSprite(sprite);
      },

      /**
       * Get the position of the ball from the mover component.
       * @return {Point2D}
       */
      getPosition: function() {
         return this.getComponent("move").getPosition();
      },

      /**
       * Get the render position of the ball
       * @return {Point2D}
       */
      getRenderPosition: function() {
         return this.getPosition();
      },
		
		getCircle: function() {
			return Circle2D.create(this.getPosition(), 30);
		},

      /**
       * Set, or initialize, the position of the mover component
       *
       * @param point {Point2D} The position to draw the ball in the playfield
       */
      setPosition: function(point) {
         this.base(point);
         this.getComponent("move").setPosition(point);
      },

      /**
       * Set the movement vector
       * @param vec {Vector2D} The velocity vector
       */
      setVelocity: function(vec) {
         this.getComponent("move").setVelocity(vec);  
      },
		
		setVelocityDecay: function(decay) {
			this.getComponent("move").setVelocityDecay(decay);
		},

      /**
       * Get the velocity vector of the ball
       * @return {Vector2D} The velocity vector
       */
      getVelocity: function() {
         return this.getComponent("move").getVelocity();
      },

      /**
       * Set the gravity vector
       * @param vec {Vector2D} The gravity vector
       */
      setGravity: function(vec) {
         this.getComponent("move").setGravity(vec);
      },
		
		isAtRest: function() {
			return this.getComponent("move").isAtRest();
		},

      /**
       * Check to see if the ball should bounce off the floor or
       * the walls.  Also checks to see if the ball has hit a resting
       * state.
       */
      checkBounce: function() {
         if (this.isAtRest()) {
            return;
         }

         // Ground
         var fb = WiiTest.getFieldBox().get();
         var bb = this.getBoundingBox().get();
         var p = this.getPosition();
         var floor = fb.h - 2;
         if (p.y + bb.h > floor) {
            // Bounce
            var v = this.getVelocity();
            v.set(v.x, v.y * -1).mul(0.8);
            this.setVelocity(v);

            // Adjust
            var b = Point2D.create(p.x, fb.h - bb.h - 3);
            this.setPosition(b);
         }

         // Walls
         if ((p.x < 0) || (p.x + bb.w > fb.w )) {
            // Bounce
            var v = this.getVelocity();
            v.set(v.x * -1, v.y);
            this.setVelocity(v);

            // Adjust
            var b = Point2D.create((p.x < 0 ? 5 : fb.w - bb.w - 5), p.y);
            this.setPosition(b);
         }

      },

      /**
       * If the ball was clicked on, make it bounce a random way.
       */
      clicked: function() {
         var xD = (Math.random() * 100) < 50 ? -1 : 1;
         var v = Vector2D.create((Math.random() * 4) * xD, -20);
         this.setVelocity(v);
      },

      /**
       * Determine if the ball was touched by the player and, if so,
       * change the sprite which represents it.
       */
      onCollide: function(obj) {
			if (obj instanceof WiiBall &&
				 this.getWorldBox().isIntersecting(obj.getWorldBox())) {
				if (!this.isAtRest()) {
					// Bounce the balls
					if (this.ballsCollide(obj)) {
						this.doBallBounce(obj);
						return ColliderComponent.CONTINUE;
					}
				}
			}

         if (obj instanceof WiiHost &&
             (this.getWorldBox().isIntersecting(obj.getWorldBox()))) {
            this.setSprite(1);
				return ColliderComponent.STOP;
         }
			
         this.setSprite(0);
         return ColliderComponent.CONTINUE;
      },
		
		ballsCollide: function(ball) {
			// Early test
			var dist = ball.getCircle().getCenter().dist(this.getCircle().getCenter());
			var sumRad = ball.getCircle().getRadius() + this.getCircle().getRadius();
			dist -= sumRad;
			if (this.getVelocity().len() < dist) {
				// No collision possible
			  	return false;
			}
			
			var norm = Vector2D.create(this.getVelocity()).normalize();
			
			// Find C, the vector from the center of the moving
			// circle A to the center of B
			var c = Vector2D.create(ball.getCircle().getCenter().sub(this.getCircle().getCenter()));
			var dot = norm.dot(c);
			
			// Another early escape: Make sure that A is moving
			// towards B! If the dot product between the movevec and
			// B.center - A.center is less that or equal to 0,
			// A isn't isn't moving towards B
			if (dot <= 0) {
			  return false;
			}
			
			var lenC = c.len();
			var f = (lenC * lenC) - (dot * dot);

			// Escape test: if the closest that A will get to B
			// is more than the sum of their radii, there's no
			// way they are going collide
			var sumRad2 = sumRad * sumRad;
			if (f >= sumRad2) {
			  return false;
			}
			
			// We now have F and sumRadii, two sides of a right triangle.
			// Use these to find the third side, sqrt(T)
			var t = sumRad2 - f;
			
			// If there is no such right triangle with sides length of
			// sumRadii and sqrt(f), T will probably be less than 0.
			// Better to check now than perform a square root of a
			// negative number.
			if (t < 0) {
			  return false;
			}
			
			// Therefore the distance the circle has to travel along
			// movevec is D - sqrt(T)
			var distance = dot - Math.sqrt(t);
			
			// Get the magnitude of the movement vector
			var mag = this.getVelocity().len();
			
			// Finally, make sure that the distance A has to move
			// to touch B is not greater than the magnitude of the
			// movement vector.
			if (mag < distance) {
			  return false;
			}
			
			// Set the length of the movevec so that the circles will just
			// touch
			var moveVec = this.getVelocity().normalize();
			movevec = moveVec.mul(distance);
			
			return true; 			
		},
		
		doBallBounce: function(ball) {
			// First, find the normalized vector n from the center of
			// circle1 to the center of circle2
			var n = Vector2D.create(this.getCircle().getCenter()).sub(ball.getCircle().getCenter());
			n.normalize();
			
			// Find the length of the component of each of the movement
			// vectors along n.
			// a1 = v1 . n
			// a2 = v2 . n
			var v1 = this.getVelocity();
			var v2 = ball.getVelocity();
			
			var a1 = v1.dot(n);
			var a2 = v2.dot(n);
			
			// Using the optimized version,
			// optimizedP =  2(a1 - a2)
			//              -----------
			//                m1 + m2
			var optimizedP = (2.0 * (a1 - a2)) / (this.getMass() + ball.getMass());
			
			// Calculate v1', the new movement vector of circle1
			// v1' = v1 - optimizedP * m2 * n
			var omn1 = Vector2D.create(n);
			omn1.mul(optimizedP * ball.getMass()); 
			var v1P = v1.sub(omn1);;
			
			// Calculate v1', the new movement vector of circle1
			// v2' = v2 + optimizedP * m1 * n
			var omn2 = Vector2D.create(n);
			omn2.mul(optimizedP * this.getMass());
			var v2P = v2.add(omn2);
			
			this.setVelocity(v1P);
			ball.setVelocity(v2P);
		},
		
		getMass: function() {
			return 0.2;
		}


   }, { // Static

      /**
       * Get the class name of this object
       * @return {String} The string <tt>WiiBall</tt>
       */
      getClassName: function() {
         return "WiiBall";
      }
   });

return WiiBall;

});
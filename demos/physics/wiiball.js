
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

// Load engine objects
Engine.include("/components/component.circlebody.js");
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

         // Add components to move, draw, and collide with the player
         this.add(SpriteComponent.create("draw"));
         this.add(CircleBodyComponent.create("physics", 30));
         this.add(ColliderComponent.create("collide", WiiTest.cModel));
         
         // The sprites
         this.sprites = [];
         this.sprites.push(WiiTest.spriteLoader.getSprite("beachball", "ball"));
         this.sprites.push(WiiTest.spriteLoader.getSprite("beachball", "over"));
         this.setSprite(0);

			this.getComponent("physics").setFriction(0.08);

         this.setPosition(Point2D.create(25, 15));
			this.setOrigin(Point2D.create(30, 30));
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
         this.base(renderContext, time);
         renderContext.popTransform();
      },

		simulate: function() {
			this.getComponent("physics").startSimulation();
		},

      /**
       * Set the sprite to render with on the draw component.
       * @param spriteIdx {Number} The sprite index
       */
      setSprite: function(spriteIdx) {
         var sprite = this.sprites[spriteIdx];
         this.setBoundingBox(sprite.getBoundingBox());
         this.getComponent("draw").setSprite(sprite);
      },

      /**
       * Get the position of the ball from the mover component.
       * @return {Point2D}
       */
      getPosition: function() {
         return this.getComponent("physics").getPosition();
      },
		
		getRotation: function() {
			return this.getComponent("physics").getRotation();
		},

      /**
       * Get the render position of the ball
       * @return {Point2D}
       */
      getRenderPosition: function() {
         return this.getPosition();
      },
      
      /**
       * Get the box which surrounds the player in the world
       * @return {Rectangle2D} The world bounding box
       */
      getWorldBox: function() {
         var bBox = this.base();
         return bBox.offset(-10, -10);
      },

      /**
       * Set, or initialize, the position of the mover component
       *
       * @param point {Point2D} The position to draw the ball in the playfield
       */
      setPosition: function(point) {
         this.base(point);
         this.getComponent("physics").setPosition(point);
      },

      /**
       * If the ball was clicked on, make it bounce a random way.
       */
      clicked: function() {
         var xD = (Math2.random() * 100) < 50 ? -1 : 1;
         var v = 1000 + (Math2.random() * 5000) * xD;
         var p = this.getPosition().get();
         this.getComponent("physics").applyForce(Vector2D.create(xD * 2000000,-25000000), Vector2D.create(p.x, p.y));
      },

      /**
       * Determine if the ball was touched by the player and, if so,
       * change the sprite which represents it.
       */
      onCollide: function(obj) {
         if (WiiHost.isInstance(obj) &&
             (this.getWorldBox().isIntersecting(obj.getWorldBox()))) {
            this.setSprite(1);
            return ColliderComponent.STOP;
         }
         
         this.setSprite(0);
         return ColliderComponent.CONTINUE;
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
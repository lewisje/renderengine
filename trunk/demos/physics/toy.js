
/**
 * The Render Engine
 * A physically animated "toy"
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
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Toy", "Object2D", function() {

   /**
    * @class The block object.  Represents a block which is dropped from
    *        the top of the playfield and is used to build a hand.  Each
    *        block is one of 6 designs.  Each block is comprised of tiles
    *        which are cards that make up a hand, including wild cards.
    */
   var Toy = Object2D.extend({

      sprites: null,
		scale: 1,

      constructor: function(spriteResource, spriteName, spriteOverName) {
         this.base("PhysicsToy");
         this.sprite = null;
			this.scale = (Math2.random() * 1) + 0.8;
			
         // Add components to move, draw, and collide with the player
         this.add(SpriteComponent.create("draw"));
         this.add(ColliderComponent.create("collide", PhysicsDemo.cModel));
         
         // The sprites
         this.sprites = [];
         this.sprites.push(PhysicsDemo.spriteLoader.getSprite(spriteResource, spriteName));
         this.sprites.push(PhysicsDemo.spriteLoader.getSprite(spriteResource, spriteOverName));
         this.setSprite(0);

			// Create the physical body object
			this.createPhysicalBody("physics", this.scale);
			this.getComponent("physics").setScale(this.scale);

         this.setPosition(Point2D.create(25, 15));
			this.setOrigin(Point2D.create(30, 30));
      },

		/**
		 * [ABSTRACT] Create the physical body component and assign it to the
		 * toy.
		 *
		 * @param componentName {String} The name to assign to the component.
		 * @param scale {Number} A scalar scaling value for the toy
		 */
		createPhysicalBody: function(componentName, scale) {
		},
		
      /**
       * Update the toy within the rendering context.  This draws
       * the shape to the context, after updating the transform of the
       * object.
       *
       * @param renderContext {RenderContext} The rendering context
       * @param time {Number} The engine time in milliseconds
       */
      update: function(renderContext, time) {
         renderContext.pushTransform();
         this.base(renderContext, time);
         renderContext.popTransform();
      },

		/**
		 * Start simulation of the physical object.
		 */
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
       * Get the position of the toy from the mover component.
       * @return {Point2D}
       */
      getPosition: function() {
         return this.getComponent("physics").getPosition();
      },
		
		/**
		 * Get the rotation of the toy from the mover component.
		 * @return {Number}
		 */
		getRotation: function() {
			return this.getComponent("physics").getRotation();
		},
		
		/**
		 * Get the uniform scale of the toy from the mover component.
		 * @return {Number}
		 */
		getScale: function() {
			return this.getComponent("physics").getScale();
		},
		
      /**
       * Get the render position of the toy
       * @return {Point2D}
       */
      getRenderPosition: function() {
         return this.getPosition();
      },
      
      /**
       * Get the box which surrounds the toy in the world
       * @return {Rectangle2D} The world bounding box
       */
      getWorldBox: function() {
         var bBox = this.base();
         return bBox.offset(-10, -10);
      },

      /**
       * Set, or initialize, the position of the mover component
       *
       * @param point {Point2D} The position to draw the toy in the playfield
       */
      setPosition: function(point) {
         this.base(point);
         this.getComponent("physics").setPosition(point);
      },

		/**
		 * Apply a force to the physical body.
		 *
		 * @param amt {Vector2D} The force vector to apply to the toy.
		 * @param loc {Point2D} The location at which the force is applied to the toy.
		 */
		applyForce: function(amt, loc) {
			this.getComponent("physics").applyForce(amt, loc);
		},

      /**
       * If the toy was clicked on, determine a force vector and apply it
       * to the toy.
       */
      clicked: function(p) {
			var force = Vector2D.create(p).sub(this.getPosition()).mul(20000);
         this.applyForce(force, p);
			force.destroy();
      },
		
		/**
		 * Unused
		 */
		released: function() {
		},

      /**
       * Determine if the toy was touched by the player and, if so,
       * change the sprite which represents it.
       */
      onCollide: function(obj) {
         if (Player.isInstance(obj) &&
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
       * @return {String} The string <tt>Toy</tt>
       */
      getClassName: function() {
         return "Toy";
      }
   });

return Toy;

});
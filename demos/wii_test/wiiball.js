
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

      /**
       * Check to see if the ball should bounce off the floor or
       * the walls.  Also checks to see if the ball has hit a resting
       * state.
       */
      checkBounce: function() {
         if (this.atRest) {
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

         // Check rest state     
         if (this.getVelocity().len() < 2 && (this.getPosition().y + bb.h > floor - 2)) {
            this.setVelocity(Point2D.ZERO);
            this.setGravity(Point2D.ZERO);
            this.atRest = true;
         }
      },

      /**
       * If the ball was clicked on, make it bounce a random way.
       */
      clicked: function() {
         var xD = (Math.random() * 100) < 50 ? -1 : 1;
         var v = Vector2D.create((Math.random() * 4) * xD, -20);
         this.setVelocity(v);
         this.setGravity(Vector2D.create(0, 1));
         this.atRest = false;
      },

      /**
       * Determine if the ball was touched by the player and, if so,
       * change the sprite which represents it.
       */
      onCollide: function(obj) {
         if (obj instanceof WiiHost &&
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
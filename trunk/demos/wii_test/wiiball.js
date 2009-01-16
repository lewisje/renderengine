
/**
 * The Render Engine
 *
 * A block
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 642 $
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

   sprite: null,
   
   atRest: false,
   
   cBox: null,
   wBox: null,

   constructor: function() {
      this.base("WiiBall");
      this.sprite = null;

      this.setElement($("<div>").css({ position: "absolute", width: 60, height: 60 }));

      this.cBox = $("<div>").css({ position: "absolute", display: "none", border: "1px dashed blue"});
      WiiTest.getRenderContext().getSurface().append(this.cBox);

      this.wBox = $("<div>").css({ position: "absolute", display: "none", border: "2px solid blue"});
      WiiTest.getRenderContext().getSurface().append(this.wBox);

      // Add components to move and draw the player
      this.add(Mover2DComponent.create("move"));
      this.add(SpriteComponent.create("draw"));
      this.add(ColliderComponent.create("collide", WiiTest.getCModel()));
      this.setSprite(WiiTest.spriteLoader.getSprite("redball", "red"));

      this.setPosition(Point2D.create(5, 5));
      this.setGravity(Point2D.create(0, 1));
      this.setVelocity(Vector2D.create(2, 0));
      this.atRest = false;
   },

   /**
    * Update the player within the rendering context.  This draws
    * the shape to the context, after updating the transform of the
    * object.  If the player is thrusting, draw the thrust flame
    * under the ship.
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

   setSprite: function(sprite) {
      this.sprite = sprite;
      this.jQ().css("background", "url('" + sprite.getSourceImage().src + "') no-repeat");
      this.setBoundingBox(sprite.getBoundingBox());
      this.getComponent("draw").setSprite(sprite);
   },

   /**
    * Get the position of the ship from the mover component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getPosition();
   },

   /**
    * Set, or initialize, the position of the mover component
    *
    * @param point {Point2D} The position to draw the ship in the playfield
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   setVelocity: function(vec) {
      this.getComponent("move").setVelocity(vec);  
   },
   
   getVelocity: function() {
      return this.getComponent("move").getVelocity();
   },
   
   setGravity: function(vec) {
      this.getComponent("move").setGravity(vec);
   },
   
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
   
   clicked: function() {
      var xD = (Math.random() * 100) < 50 ? -1 : 1;
      var v = Vector2D.create((Math.random() * 4) * xD, -20);
      this.setVelocity(v);
      this.setGravity(Vector2D.create(0, 1));
      this.atRest = false;
   },
   
   onCollide: function(obj) {
      if (obj instanceof WiiHost &&
          (this.getWorldBox().isIntersecting(obj.getWorldBox()))) {
         this.setSprite(WiiTest.spriteLoader.getSprite("redball", "blue"));
         return ColliderComponent.STOP;
      }

      this.setSprite(WiiTest.spriteLoader.getSprite("redball", "red"));
      return ColliderComponent.CONTINUE;
   }
   

}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "WiiBall";
   }
});

return WiiBall;

});
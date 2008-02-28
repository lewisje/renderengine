
/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The bullet object
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

/**
 * @class The bullet object.
 *
 * @param player {Spaceroids.Player} The player object this bullet comes from,
 */
Spaceroids.Bullet = Object2D.extend({

   player: null,

   constructor: function(player) {
      this.base("Bullet");

      // Track the player that created us
      this.player = player;

      // Add components to move and draw the asteroid
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));
      this.add(new ColliderComponent("collide", Spaceroids.collisionModel));

      // Get the player's position and rotation,
      // then position this at the tip of the ship
      // moving away from it
      var p_mover = this.player.getComponent("move");
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");

      c_draw.setPoints(Spaceroids.Bullet.shape);
      c_draw.setLineStyle("white");
      c_draw.setFillStyle("white");

      var r = p_mover.getRotation();
      var dir = Math2D.getDirectionVector(Point2D.ZERO, Spaceroids.Bullet.tip, r);

      var p = new Point2D(p_mover.getPosition());

      c_mover.setPosition(p.add(new Point2D(dir).mul(10)));
      c_mover.setVelocity(dir.mul(3));
   },

   /**
    * Returns the bullet position
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   /**
    * Returns the last position of the bullet
    * @type Point2D
    */
   getLastPosition: function() {
      return this.getComponent("move").getLastPosition();
   },

   /**
    * Set the position of the bullet.
    *
    * @param point {Point2D} The position of the bullet.
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Update the host object to reflect the state of the bullet.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {

      var c_mover = this.getComponent("move");

      // Is this bullet in field any more?
      var p = c_mover.getPosition();
      var bBox = new Rectangle2D(p.x, p.y, 2, 2);
      if (!Spaceroids.inField(p, bBox))
      {
         this.destroy();
         this.player.removeBullet(this);
         return;
      }

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

   },

   /**
    * Called whenever an object is located in the PCL which might
    * be in a collision state with this bullet.  Checks for collisions
    * with rocks and UFO's.
    *
    * @param obj {HostObject} The object that the bullet might be in a
    *            collision state with.
    *
    * @returns <tt>ColliderComponent.STOP</tt> if the collision was handled,
    *          otherwise <tt>ColliderComponent.CONTINUE</tt> if the other
    *          objects in the PCL should be tested.
    */
   onCollide: function(obj) {
      if ((obj.getClassName() == "Rock") &&
          ( (Math2D.boxPointCollision(obj.getWorldBox(), this.getPosition())) ||
            (Math2D.lineBoxCollision(this.getPosition(), this.getLastPosition(), obj.getWorldBox())) )
         )
      {
         // Kill the rock
         obj.kill();

         // Remove the bullet
         this.destroy();
         this.player.removeBullet(this);

         // All set
         return ColliderComponent.STOP;
      }

      return ColliderComponent.CONTINUE;
   },

   /**
    * Get the class name of this object
    *
    * @type String

    */
   getClassName: function() {
      return "Bullet";
   }

}, {
   // Why we have this, I don't know...
   shape: [ new Point2D(-1, -1), new Point2D( 1, -1),
            new Point2D( 1,  1), new Point2D(-1,  1)],

   // The tip of the player at zero rotation (up)
   tip: new Point2D(0, -1)
});
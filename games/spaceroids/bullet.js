
/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The player object
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

   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   setPosition: function(point) {
      this.getComponent("move").setPosition(point);
   },

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

   onCollide: function(obj) {
      if ((obj.getClassName() == "Rock") &&
          (Math2D.boxPointCollision(obj.getWorldBox(), this.getPosition())))
      {
         Spaceroids.scorePoints(10);
         if (obj.size - 3 > 3)
         {
            for (var p = 0; p < 3; p++)
            {
               var rock = new Spaceroids.Rock(obj.size - 3, obj.getPosition());
               this.getRenderContext().add(rock);
               rock.setup(obj.pBox.getDims().x, obj.pBox.getDims().y);
            }
         }

         this.destroy();
         obj.destroy();

         this.player.removeBullet(this);
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
   shape: [ new Point2D(-1, -1), new Point2D( 1, -1),
            new Point2D( 1,  1), new Point2D(-1,  1)],

   tip: new Point2D(0, -1)
});

/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The player object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 42 $
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

Spaceroids.Bullet = HostObject.extend({

   player: null,

   constructor: function(player) {
      this.base("Bullet");

      // Track the player that created us
      this.player = player;

      // Add components to move and draw the asteroid
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));

      // Get the player's position and rotation,
      // then position this at the tip of the ship
      // moving away from it
      var p_mover = this.player.getComponent("move");
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");

      c_draw.setPoints(Spaceroids.Bullet.shape);
      c_draw.setLineStyle("white");

      var r = p_mover.getRotation();
      var tip = new Point2D(0, -1);
      var dir = Math2D.getDirectionVector(Point2D.ZERO, tip, r);

      var p = new Point2D(p_mover.getPosition());

      c_mover.setPosition(p.add(new Point2D(dir).mul(10)));
      c_mover.setVelocity(dir.mul(3));
   },

   preUpdate: function(renderContext, time) {
      renderContext.pushTransform();
   },

   postUpdate: function(renderContext, time) {
      renderContext.popTransform();
      var c_mover = this.getComponent("move");

      // Is this bullet in field any more?
      var p = c_mover.getPosition();
      var bBox = new Rectangle2D(p.x, p.y, 2, 2);
      if (!Spaceroids.inField(p, bBox))
      {
         this.player.removeBullet(this);
      }
   }

}, {
   shape: [ new Point2D(-1, -1), new Point2D( 1, -1),
            new Point2D( 1,  1), new Point2D(-1,  1)]
});
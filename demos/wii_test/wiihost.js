
/**
 * The Render Engine
 *
 * A block
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

Engine.include("/components/component.collider.js");
Engine.include("/components/component.wiimoteinput.js");
Engine.include("/components/component.transform2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("WiiHost", "Object2D", function() {

/**
 * @class The block object.  Represents a block which is dropped from
 *        the top of the playfield and is used to build a hand.  Each
 *        block is one of 6 designs.  Each block is comprised of tiles
 *        which are cards that make up a hand, including wild cards.
 */
var WiiHost = Object2D.extend({

	overBall: null,

   constructor: function() {
      this.base("WiiHost");

      // Add components to move and collide the player
      this.add(WiimoteInputComponent.create("input"));
		this.add(Transform2DComponent.create("move"));
		this.add(ColliderComponent.create("collide", WiiTest.getCModel()));
		this.setBoundingBox(Rectangle2D.create(0, 0, 100, 100));
		this.overBall = null;
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
      this.base(renderContext, time);
		Engine.addMetric("overBall", this.overBall != null ? "true" : "false");
      renderContext.popTransform();
   },

   /**
    * Get the position of the ship from the mover component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   /**
    * Set, or initialize, the position of the mover component
    *
    * @param point {Point2D} The position to draw the ship in the playfield
    */
   setPosition: function(point) {
      this.base(point);
		point.set(point.x - 50, point.y - 50);
      this.getComponent("move").setPosition(point);
   },

	onWiimotePosition: function(c, sx, sy, x, y) {
		if (c == 0)	{
			this.setPosition(Point2D.create(sx, sy));
		}
	},
	
	onWiimoteButtonA: function(c, state, evt) {
		if (c == 0 && this.overBall) {
			var xD = (Math.random() * 100) < 50 ? -1 : 1;
			var v = Vector2D.create((Math.random() * 4) * xD, -10);
			this.overBall.setVelocity(v);
			this.overBall.setGravity(Vector2D.create(0, 1));
			this.overBall.atRest = false;
			return;
		}
		
		if (c == 0 && state && !this.overBall) {
			var b = WiiBall.create();
			WiiTest.getRenderContext().add(b);
		}
	},
	
	onCollide: function(obj) {
		if (obj instanceof WiiBall &&
		    (this.getWorldBox().isIntersecting(obj.getWorldBox()))) {
			this.overBall = obj;
			return ColliderComponent.STOP;
		}

		this.overBall = null;
		return ColliderComponent.STOP;
	}

}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "WiiHost";
   }
});

return WiiHost;

});
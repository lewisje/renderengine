
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

Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.wiimoteinput.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("WiiHost", "Object2D", function() {

/**
 * @class The block object.  Represents a block which is dropped from
 *        the top of the playfield and is used to build a hand.  Each
 *        block is one of 6 designs.  Each block is comprised of tiles
 *        which are cards that make up a hand, including wild cards.
 */
var WiiHost = Object2D.extend({

   sprite: null,
	
	offScreen: false,
	
	jitter: false,

   constructor: function() {
      this.base("WiiHostObject");
		this.sprite = null;

      this.setElement($("<div>").css({ position: "absolute", width: 60, height: 60 }));

      // Add components to move and draw the player
      this.add(WiimoteInputComponent.create("input"));
      this.add(Mover2DComponent.create("move"));
      this.add(SpriteComponent.create("draw"));
      this.setSprite(WiiTest.spriteLoader.getSprite("redball", "ball"));

      this.setPosition(Point2D.create(30, 30));
		this.offScreen = false;
		this.jitter = false;
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
      renderContext.popTransform();
   },

   setSprite: function(sprite) {
      this.sprite = sprite;
      this.jQ().css("background", "url('" + sprite.getSourceImage().src + "') no-repeat");
      this.setBoundingBox(sprite.getBoundingBox());
      this.getComponent("draw").setSprite(sprite);
   },

   getSprite: function() {
      return this.sprite;
   },

   /**
    * Get the position of the ship from the mover component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Set, or initialize, the position of the mover component
    *
    * @param point {Point2D} The position to draw the ship in the playfield
    */
   setPosition: function(point) {
      this.base(point);
		var d = this.getBoundingBox();
		point.set(point.x - d.getHalfWidth(), point.y - d.getHalfHeight());
		if (this.jitter) {
			point.add(Point2D.create(Math.random() * 30, Math.random() * 30));
		}
      this.getComponent("move").setPosition(point);
   },

   getScale: function() {
      return this.getComponent("move").getScale();
   },

   setScale: function(s) {
      this.getComponent("move").setScale(s);
   },

   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   setRotation: function(r) {
      this.getComponent("move").setRotation(r);
   },
	
	setVelocity: function(vec) {
		this.getComponent("move").setVelocity(vec);	
	},
	
	onWiimotePosition: function(c, sx, sy, x, y) {
		if (c == 0)	{
			this.setPosition(Point2D.create(sx, sy));
		}
	},
	
	onWiimoteButtonA: function(c, state, evt) {
		if (c == 0) {
			this.jitter = state;
		}
	},
	
	onWiimoteLeft: function() {
		return false;
	},

	onWiimoteUp: function() {
		return false;
	},

	onWiimoteRight: function() {
		return false;
	},

	onWiimoteDown: function() {
		return false;
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
/**
 * The Render Engine
 * Sprite
 *
 * @fileoverview A class for working with sprites.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.resources.types.Sprite",
	"requires": [
		"R.engine.PooledObject",
		"R.math.Rectangle2D"
	]
});

/**
 * @class Represents a sprite
 *
 * @constructor
 * @param name {String} The name of the sprite within the resource
 * @param spriteObj {Object} Passed in by a {@link SpriteLoader}.  An array which defines the
 *                  sprite frame, and parameters.
 * @param spriteResource {Object} The sprite resource loaded by the {@link SpriteLoader}
 * @extends PooledObject
 */
R.resources.types.Sprite = function() {
	return R.engine.PooledObject.extend(/** @scope R.resources.types.Sprite.prototype */{

   // The type of sprite: Single or Animation
   type: -1,

   // Animation mode: loop or toggle
   mode: -1,

   // Animation frame count
   count: -1,

   // Animation speed
   speed: -1,

   // The rect which defines the sprite frame
   frame: null,

   // The image map that contains the sprite(s)
   image: null,

   // The bounding box for the sprite
   bbox: null,

   /**
    * @private
    */
   constructor: function(name, spriteObj, spriteResource, fileVersion) {
      this.base(name);
		
		if (fileVersion == 1) {
	  		this.type = (spriteObj["a"] ? R.resources.types.Sprite.TYPE_ANIMATION : R.resources.types.Sprite.TYPE_SINGLE);
		} else if (fileVersion == 2) {
			this.type = (spriteObj.length == 4 ? R.resources.types.Sprite.TYPE_SINGLE : R.resources.types.Sprite.TYPE_ANIMATION);
		}

      var s;
		if (fileVersion == 1) {
			s = (this.type == R.resources.types.Sprite.TYPE_ANIMATION ? spriteObj["a"] : spriteObj["f"]);
		} else if (fileVersion == 2) {
			s = spriteObj;
		}
		
      if (this.type == R.resources.types.Sprite.TYPE_ANIMATION) {
         this.mode = (s[Sprite.INDEX_TYPE] == "loop" ? R.resources.types.Sprite.MODE_LOOP : R.resources.types.Sprite.MODE_TOGGLE);
         this.count = s[Sprite.INDEX_COUNT];
         this.speed = s[Sprite.INDEX_SPEED];
      }

      this.image = spriteResource.image;
      this.frame = R.math.Rectangle2D.create(s[R.resources.types.Sprite.INDEX_LEFT], s[R.resources.types.Sprite.INDEX_TOP], s[R.resources.types.Sprite.INDEX_WIDTH], s[R.resources.types.Sprite.INDEX_HEIGHT]);
      this.bbox = R.math.Rectangle2D.create(0, 0, s[R.resources.types.Sprite.INDEX_WIDTH], s[R.resources.types.Sprite.INDEX_HEIGHT]);
   },

	/**
	 * @private
	 */
	destroy: function() {
		this.bbox.destroy();
		this.frame.destroy();
		this.base();
	},

   /**
    * @private
    */
   release: function() {
      this.base();
      this.mode = -1;
      this.type = -1;
      this.count = -1;
      this.speed = -1;
      this.frame = null;
      this.image = null;
      this.bbox = null;
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation.
    * @return {Boolean} <tt>true</tt> if the sprite is an animation
    */
   isAnimation: function() {
      return (this.type == R.resources.types.Sprite.TYPE_ANIMATION);
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation and loops.
    * @return {Boolean} <tt>true</tt> if the sprite is an animation and loops
    */
   isLoop: function() {
      return (this.isAnimation() && this.mode == R.resources.types.Sprite.MODE_LOOP);
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation and toggles.
    * @return {Boolean} <tt>true</tt> if the sprite is an animation and toggles
    */
   isToggle: function() {
      return (this.isAnimation() && this.mode == R.resources.types.Sprite.MODE_TOGGLE);
   },

   /**
    * Get the bounding box for the sprite.
    * @return {Rectangle2D} The bounding box which contains the entire sprite
    */
   getBoundingBox: function() {
      return this.bbox;
   },

   /**
    * Gets the frame of the sprite. The frame is the rectangle that defining what
    * portion of the image map the sprite frame occupies, given the specified time.
    *
    * @param time {Number} Current world time (can be obtained with {@link Engine#worldTime}
    * @return {Rectangle2D} A rectangle which defines the frame of the sprite in
    *         the source image map.
    */
   getFrame: function(time) {
      if (!this.isAnimation()) {
         return R.math.Rectangle2D.create(this.frame);
      } else {
         var f = R.math.Rectangle2D.create(this.frame);
         var fn;
         if (this.isLoop()) {
            fn = Math.floor(time / this.speed) % this.count;
         } else {
            fn = Math.floor(time / this.speed) % (this.count * 2);
            if (fn > this.count - 1) {
               fn = this.count - (fn - (this.count - 1));
            }
         }
         return f.offset(f.dims.x * fn, 0);
      }
   },

   /**
    * Set the speed, in milliseconds, that an animation runs at.  If the sprite is
    * not an animation, this has no effect.
    *
    * @param speed {Number} The number of milliseconds per frame of an animation
    */
   setSpeed: function(speed) {
      if (speed >= 0) {
         this.speed = speed;
      }
   },

   /**
    * Get the number of milliseconds each frame is displayed for an animation
    * @return {Number} The milliseconds per frame
    */
   getSpeed: function() {
      return this.speed;
   },

   /**
    * The source image loaded by the {@link SpriteLoader} when the sprite was
    * created.
    * @return {HTMLImage} The source image the sprite is contained within
    */
   getSourceImage: function() {
      return this.image;
   }

}, /** @scope R.resources.types.Sprite.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "R.resources.types.Sprite"
    */
   getClassName: function() {
      return "R.resources.types.Sprite";
   },

   /** The sprite animation loops
    * @type Number
    */
   MODE_LOOP: 0,

   /** The sprite animation toggles - Plays from the first to the last frame
    *  then plays backwards to the first frame and repeats.
    * @type Number
    */
   MODE_TOGGLE: 1,

   /** The sprite is a single frame
    * @type Number
    */
   TYPE_SINGLE: 0,

   /** The sprite is an animation
    * @type Number
    */
   TYPE_ANIMATION: 1,

   /** The field in the sprite definition file for the left pixel of the sprite frame
    * @private
    */
   INDEX_LEFT: 0,

   /** The field in the sprite definition file for the top pixel of the sprite frame
    * @private
    */
   INDEX_TOP: 1,

   /** The field in the sprite definition file for the width of the sprite frame
    * @private
    */
   INDEX_WIDTH: 2,

   /** The field in the sprite definition file for the height of the sprite frame
    * @private
    */
   INDEX_HEIGHT: 3,

   /** The field in the sprite definition file for the count of frames in the sprite
    * @private
    */
   INDEX_COUNT: 4,

   /** The field in the sprite definition file for the speed in milliseconds that the sprite animates
    * @private
    */
   INDEX_SPEED: 5,

   /** The field in the sprite definition file for the type of sprite animation
    * @private
    */
   INDEX_TYPE: 6
});

}

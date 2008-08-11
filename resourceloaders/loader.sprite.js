/**
 * The Render Engine
 * SpriteLoader
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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
 * @class Loads sprites and makes them available to the system.
 * @extends ImageResourceLoader
 */
var SpriteLoader = ImageResourceLoader.extend(/** @scope SpriteLoader.prototype */{

   sprites: null,

   constructor: function(name) {
      this.base(name || "SpriteLoader");
      this.sprites = {};
   },

   /**
    * Load a sprite resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url, info, path) {

      if (url)
      {
         Assert(url.indexOf("http") == -1, "Sprites must be located on this server");
         var thisObj = this;

         // Get the file from the server
         $.get(url, function(data) {
            var spriteInfo = EngineSupport.parseJSON(data);
            // get the path to the resource file
            var path = url.substring(0, url.lastIndexOf("/"));
            thisObj.load(name, null, spriteInfo, path + "/");
         });
      }
      else
      {
         info.bitmapImage = path + info.bitmapImage;
         Console.log("Loading sprite: " + name + " @ " + info.bitmapImage);

         // Load the sprite image file
         this.base(name, info.bitmapImage, info.bitmapWidth, info.bitmapHeight);

         // Store the sprite info
         this.sprites[name] = info;
      }
   },

   /**
    * Get the sprite resource with the specified name from the cache.  The
    * object returned contains the bitmap as <tt>image</tt> and
    * the sprite definition as <tt>info</tt>.
    *
    * @param name {String} The name of the object to retrieve
    * @type Object
    */
   get: function(name) {
      var bitmap = this.base(name);
      var sprite = {
         image: bitmap,
         info: this.sprites[name]
      };
      return sprite;
   },

   /**
    * Creates a {@link Sprite} object representing the named sprite.
    *
    * @param resource {String} A loaded sprite resource
    * @param sprite {String} The name of the sprite from the resource
    * @returns A {@link Sprite} object
    */
   getSprite: function(resource, sprite) {
      return Sprite.create(sprite, this.get(resource).info.sprites[sprite], this.get(resource));
   },

   /**
    * The name of the resource this loader will get.
    * @returns A String that represents the resource type.
    */
   getResourceType: function() {
      return "sprite";
   }

}, {
   /**
    * Get the class name of this object.
    * @return The string <tt>SpriteLoader</tt>
    * @type String
    */
   getClassName: function() {
      return "SpriteLoader";
   }
});

/**
 * @class Represents a sprite
 * @extends PooledObject
 */
var Sprite = PooledObject.extend(/** @scope Sprite.prototype */{

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

   /**
    * Creates an instance of a Sprite object.
    *
    * @param name {String} The name of the object
    * @param spriteObj {Object} Passed in by a SpriteLoader
    * @param spriteResource {Object} The sprite resource loaded by the SpriteLoader
    */
   constructor: function(name, spriteObj, spriteResource) {

      this.type = (spriteObj["a"] ? Sprite.TYPE_ANIMATION : Sprite.TYPE_SINGLE);

      var s = (this.type == Sprite.TYPE_ANIMATION ? spriteObj["a"] : spriteObj["f"]);
      if (this.type == Sprite.TYPE_ANIMATION) {
         this.mode = (s[Sprite.INDEX_TYPE] == "loop" ? Sprite.MODE_LOOP : Sprite.MODE_TOGGLE);
         this.count = s[Sprite.INDEX_COUNT];
         this.speed = s[Sprite.INDEX_SPEED];
      }

      this.image = spriteResource.image;

      this.frame = Rectangle2D.create(s[Sprite.INDEX_LEFT], s[Sprite.INDEX_TOP], s[Sprite.INDEX_WIDTH], s[Sprite.INDEX_HEIGHT]);
      return this.base(name);
   },

   release: function() {
      this.base();
      this.mode = -1;
      this.type = -1;
      this.count = -1;
      this.speed = -1;
      this.frame = null;
      this.image = null;
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation.
    * @return <tt>true</tt> if the sprite is an animation
    */
   isAnimation: function() {
      return (this.type == Sprite.TYPE_ANIMATION);
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation and loops.
    * @return <tt>true</tt> if the sprite is an animation and loops
    */
   isLoop: function() {
      return (this.isAnimation() && this.mode == Sprite.MODE_LOOP);
   },

   /**
    * Returns <tt>true</tt> if the sprite is an animation and toggles.
    * @return <tt>true</tt> if the sprite is an animation and toggles
    */
   isToggle: function() {
      return (this.isAnimation() && this.mode == Sprite.MODE_TOGGLE);
   },

   /**
    * Gets the frame (rectangle defining what portion of the image map
    * the sprite frame occupies) of the sprite.
    *
    * @param time {Number} Current world time
    * @return A {@link Rectangle2D} which defines the frame of the sprite in
    *         the source image map.
    */
   getFrame: function(time) {
      if (!this.isAnimation) {
         return this.frame;
      } else {
         var f = Rectangle2D.create(this.frame);
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
	 * Set the speed, in milliseconds, that an animation runs at.
	 * @param speed {Number} The number of milliseconds per frame of an animation
	 */
	setSpeed: function(speed) {
		if (speed >= 0) {
			this.speed = speed;
		}
	},

	/**
	 * Get the number of milliseconds each frame is displayed for an animation
	 * @type Number
	 */
	getSpeed: function() {
		return this.speed;
	},

   /**
    * The source image loaded by the {@link SpriteLoader} when the sprite was
    * created.
    * @return The source image the sprite is contained within
    */
   getSourceImage: function() {
      return this.image;
   }

}, /** @scope Sprite */{
   /**
    * Gets the class name of this object.
    * @return The string <tt>Sprite</tt>
    */
   getClassName: function() {
      return "Sprite";
   },

   /** The sprite animation loops */
   MODE_LOOP: 0,

   /** The sprite animation toggles - Plays from the first to the last frame
       then plays backwards to the first frame and repeats. */
   MODE_TOGGLE: 1,

   /** The sprite is a single frame */
   TYPE_SINGLE: 0,

   /** The sprite is an animation */
   TYPE_ANIMATION: 1,

   /** The field in the sprite definition file for the left pixel of the sprite frame */
   INDEX_LEFT: 0,

   /** The field in the sprite definition file for the top pixel of the sprite frame */
   INDEX_TOP: 1,

   /** The field in the sprite definition file for the width of the sprite frame */
   INDEX_WIDTH: 2,

   /** The field in the sprite definition file for the height of the sprite frame */
   INDEX_HEIGHT: 3,

   /** The field in the sprite definition file for the count of frames in the sprite */
   INDEX_COUNT: 4,

   /** The field in the sprite definition file for the speed in milliseconds that the sprite animates */
   INDEX_SPEED: 5,

   /** The field in the sprite definition file for the type of sprite animation */
   INDEX_TYPE: 6
});

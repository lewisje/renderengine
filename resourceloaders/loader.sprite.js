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

var Sprite = PooledObject.extend(/** @scope Sprite.prototype */{

   mode: -1,

   type: -1,

   count: -1,

   speed: -1,

   frame: null,

   image: null,

   constructor: function(name, spriteObj, spriteResource) {

      this.type = (spriteObj["a"] ? Sprite.TYPE_ANIMATION : Sprite.TYPE_SINGLE);

      var s = (this.type == Sprite.TYPE_ANIMATION ? spriteObj["a"] : spriteObj["f"]);
      if (this.type == Sprite.TYPE_ANIMATION) {
         this.mode = s[Sprite.INDEX_TYPE];
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

   isAnimation: function() {
      return (this.type == Sprite.TYPE_ANIMATION);
   },

   isLoop: function() {
      return (this.isAnimation() && this.mode == Sprite.MODE_LOOP);
   },

   isToggle: function() {
      return (this.isAnimation() && this.mode == Sprite.MODE_TOGGLE);
   },

   getFrame: function(time) {
      if (!this.isAnimation) {
         return this.frame;
      } else {
         var f = Rectangle2D.create(this.frame);
         var fn = Math.floor(time / this.speed) % this.count;
         return f.offset(f.width * fn, f.height);
      }
   },

   getSourceImage: function() {
      return this.image;
   }

}, {
   getClassName: function() {
      return "Sprite";
   },

   MODE_LOOP: 0,

   MODE_TOGGLE: 1,

   TYPE_SINGLE: 0,

   TYPE_ANIMATION: 1,

   INDEX_LEFT: 0,

   INDEX_TOP: 1,

   INDEX_WIDTH: 2,

   INDEX_HEIGHT: 3,

   INDEX_COUNT: 4,

   INDEX_SPEED: 5,

   INDEX_TYPE: 6
});

/**
 * @class Loads bitmap fonts and makes them available to the system.
 * @extends ImageResourceLoader
 */
var SpriteLoader = ImageResourceLoader.extend(/** @scope SpriteLoader.prototype */{

   sprites: null,

   constructor: function() {
      this.base("SpriteLoader");
      this.sprites = {};
   },

   /**
    * Load a sprite resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url, info) {

      Assert(url && url.indexOf("http") == -1, "Sprites must be located on this server");

      if (url)
      {
         var thisObj = this;

         // Get the file from the server
         $.get(url, function(data) {
            var spriteInfo = EngineSupport.parseJSON(data);
            thisObj.load(name, null, spriteInfo);
         });
      }
      else
      {
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
    * Get the named sprite from the specified resource.
    *
    * @param resource {String} A loaded sprite resource
    * @param sprite {String} The name of the sprite from the resource
    * @returns A {@link Sprite} object
    */
   getSprite: function(resource, sprite) {
      return Sprite.create(this.get(resource).info.sprites[sprite], this.get(resource));
   },

   /**
    * The name of the resource this loader will get.
    * @returns A String that represents the resource type.
    */
   getResourceType: function() {
      return "sprite";
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpriteLoader";
   }
});
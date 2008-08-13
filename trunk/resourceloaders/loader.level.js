/**
 * The Render Engine
 * LevelLoader
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
 * @class Loads levels and makes them available to the system.  Levels are defined
 *        by a specific type of resource file.  A level is comprised of its bitmap
 *        file, a collision map, and objects that make up the level with their
 *        constructor states.
 * <pre>
 * {
 *    // A level file
 *    bitmapImage: "level1.png",
 *    bitmapWidth: 6768,
 *    bitmapHeight: 448,
 *    collisionMap: [
 *       [0, 400, 6768, 48]
 *    ],
 *    objects: {}
 * }
 * </pre>
 *
 * @extends ImageResourceLoader
 */
var LevelLoader = ImageResourceLoader.extend(/** @scope LevelLoader.prototype */{

   levels: null,

   constructor: function(name) {
      this.base(name || "LevelLoader");
      this.levels = {};
   },

   /**
    * Load a level resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url, info, path) {

      if (url)
      {
         Assert(url.indexOf("http") == -1, "Levels must be located on this server");
         var thisObj = this;

         // Get the file from the server
         $.get(url, function(data) {
            var levelInfo = EngineSupport.parseJSON(data);

            // get the path to the resource file
            var path = url.substring(0, url.lastIndexOf("/"));
            thisObj.load(name, null, levelInfo, path + "/");
         });
      }
      else
      {
         info.bitmapImage = path + info.bitmapImage;
         Console.log("Loading level: " + name + " @ " + info.bitmapImage);

         // Load the level image file
         this.base(name, info.bitmapImage, info.bitmapWidth, info.bitmapHeight);

         // Store the level info
         this.levels[name] = info;
      }
   },

   /**
    * Get the level resource with the specified name from the cache.  The
    * object returned contains the bitmap as <tt>image</tt> and
    * the level definition as <tt>info</tt>.
    *
    * @param name {String} The name of the object to retrieve
    * @type Object
    */
   get: function(name) {
      var bitmap = this.base(name);
      var level = {
         image: bitmap,
         info: this.levels[name]
      };
      return level;
   },

   /**
    * Creates a {@link Level} object representing the named sprite.
    *
    * @param level {String} A loaded level name
    * @returns A {@link Sprite} object
    */
   getLevel: function(level) {
      return Level.create(level, this.get(level));
   },

   /**
    * The name of the resource this loader will get.
    * @returns A String that represents the resource type.
    */
   getResourceType: function() {
      return "level";
   }

}, /** @scope LevelLoader */{
   /**
    * Get the class name of this object.
    * @return The string <tt>SpriteLoader</tt>
    * @type String
    */
   getClassName: function() {
      return "LevelLoader";
   }
});

/**
 * @class Represents a playable level
 * @extends PooledObject
 */
var Level = PooledObject.extend(/** @scope Level.prototype */{

   // The level resource
   levelResource: null,

   // The level frame
   frame: null,

   // The map of all collision rects defined for the level
   collisionMap: null,

   /**
    * Creates an instance of a Level object.
    *
    * @param name {String} The name of the object
    * @param levelResource {Object} The level resource loaded by the LevelLoader
    */
   constructor: function(name, levelResource) {

      this.levelResource = levelResource;
      this.collisionMap = [];

      // Run through the collision map to recreate
      // the collision rectangles
      for (var r in levelResource.info.collisionMap) {
         var rA = levelResource.info.collisionMap[r];
         this.collisionMap.push(Rectangle2D.create(rA[0], rA[1], rA[2], rA[3]));
      }

      return this.base(name);
   },

   release: function() {
      this.base();
      this.levelResource = null;
      this.frame = null;
      this.collisionMap = null;
   },

   /**
    * Gets a potential collision list (PCL) for the point and radius specified.
    * This routine, and the entire collision mechanism for levels, could be optimized for speed
    * using a BSP tree, or other structure.
    *
    * @param point {Point2D} The position to check for a collision
    * @param radius {Number} The distance from the point to check for collisions
    * @return An array of {@link Rectangle2D} instances which might be possible collisions
    */
   getPCL: function(point, radius) {
      // Create a rectangle which represents the position and radius
      var cRect = Rectangle2D.create(point.x - radius, point.y - radius, radius * 2, radius * 2);

      // Check the collision map for possible collisions
      var pcl = [];
      for (var r in this.collisionMap) {
         if (this.collisionMap[r].isOverlapped(cRect)) {
            pcl.push(this.collisionMap[r]);
         }
      }

      return pcl;
   },

   /**
    * Get the width of the level image.
    * @returns The width of the level in pixels
    * @type Number
    */
   getWidth: function() {
      return this.levelResource.info.bitmapWidth;
   },

   /**
    * Get the height of the level image.
    * @returns The height of the level in pixels
    * @type Number
    */
   getHeight: function() {
      return this.levelResource.info.bitmapHeight;
   },

   /**
    * Get a {@link Rectangle2D} which encloses this level.
    * @type Rectangle2D
    */
   getFrame: function() {
      if (!this.frame) {
         this.frame = Rectangle2D.create(0, 0, this.getWidth(), this.getHeight());
      }

      return this.frame;
   },

   /**
    * The source image loaded by the {@link SpriteLoader} when the sprite was
    * created.
    * @return The source image the sprite is contained within
    */
   getSourceImage: function() {
      return this.levelResource.image;
   }

}, /** @scope Level */{
   /**
    * Gets the class name of this object.
    * @return The string <tt>Sprite</tt>
    */
   getClassName: function() {
      return "Level";
   }
});

/**
 * The Render Engine
 * ResourceLoader
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
 * @class  A resource loader is a generalized interface used by all resource
 *         loaders.  It is designed to provide a common set of routines for
 *         loading resources (fonts, images, game data, etc...) from some
 *         location.
 *
 * @param name {String} The name of the resource loader. Default: ResourceLoader
 */
var ResourceLoader = BaseObject.extend(/** @scope ResourceLoader.prototype */{

   cache: {},

   length: 0,

   constructor: function(name) {
      this.base(name || "ResourceLoader");
   },

   release: function() {
      this.base();
      this.cache = {};
      this.length = 0;
   },

   destroy: function() {
      this.clear();
      this.base();
   },

   /**
    * Load an object via this resource loader, and add it to the cache.
    *
    * @param name {String} The name to refer to the loaded object
    * @param data {Object} The data to store in the cache
    * @param isReady {Boolean} A flag that states whether or not a resource
    *                          is ready to use.
    */
   load: function(name, data, isReady) {
      var obj = { data: data, ready: isReady || false};
      this.cache[name] = obj;
      this.length++;
      Console.log("Loading " + this.getResourceType() + ": " + name);
   },

   setReady: function(name, isReady) {
      this.cache[name].isReady = isReady;
   },

   isReady: function(name) {
      return this.cache[name] ? this.cache[name].isReady : false;
   },

   /**
    * Unload an object from this resource loader.  Removes the object
    * from the cache.
    *
    * @param name {String} The name of the object to remove
    */
   unload: function(name) {
      this.cache[name] = null;
      delete this.cache[name];
      this.length--;
   },

   /**
    * Get the object with the specified name from the cache.
    *
    * @param name {String} The name of the object to retrieve
    * @type Object
    */
   get: function(name) {
      if (this.cache[name]) {
         return this.cache[name].data;
      } else {
         return null;
      }
   },

   /**
    * Clear the objects contained in the cache.
    */
   clear: function() {
      for (var o in this.cache) {
         this.cache[o] = null;
      }

      this.cache = {};
      this.length = 0;
   },

   /**
    * The name of the resource this loader will get.
    * @returns A String that represents the resource type.
    */
   getResourceType: function() {
      return "default";
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ResourceLoader";
   }

});
/**
 * The Render Engine
 * ResourceLoader
 *
 * A resource loader is a generalized interface used by all resource
 * loaders.  It is designed to provide a common set of routines for
 * loading resources (fonts, images, game data, etc...) from some
 * location.
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

var ResourceLoader = BaseObject.extend(/** @scope ResourceLoader.prototype */{

   cache: {},

   length: 0,

   constructor: function(name) {
      this.base("ResourceLoader");
   },

   load: function(name, data) {
      this.cache[name] = data;
      this.length++;
   },

   unload: function(name) {
      this.cache[name] = null;
      delete this.cache[name];
      this.length--;
   },

   get: function(name) {
      return this.cache[name];
   },

   clear: function() {
      for (var o in this.cache) {
         this.cache(o) = null;
      }

      this.cache = {};
      this.length = 0;
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ResourceLoader";
   }
});
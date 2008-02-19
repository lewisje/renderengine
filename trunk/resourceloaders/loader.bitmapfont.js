/**
 * The Render Engine
 * BitmapFontLoader
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
 * @class Loads bitmap fonts and makes them available to the system.
 * @extends ImageResourceLoader
 */
var BitmapFontLoader = ImageResourceLoader.extend(/** @scope BitmapFontLoader.prototype */{

   fonts: null,

   constructor: function() {
      this.base("BitmapFontLoader");
      this.fonts = {};
   },

   /**
    * Load a font resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param location {String} The URL where the resource is located
    */
   load: function(name, location) {

      var thisObj = this;

      Console.log("Loading font: " + name + " @ " + location);

      // Get the path, the bitmap is in the same path
      var path = EngineSupport.getPath(location);

      var cb = function(data) {
         debugger;
         var thisObj = arguments.callee.thisObj;
         data = BitmapFontLoader.font;

         // Load the bitmap file
         thisObj.base(name, path + data.bitmapImage, data.width, data.height);

         // Store the font info
         thisObj.fonts[name] = data;
      };
      cb.thisObj = this;

      // Get the file from the server
      $.getJSON(location, cb);
   },

   /**
    * Get the font with the specified name from the cache.  The
    * object returned contains the bitmap as <tt>image</tt> and
    * the font definition as <tt>info</tt>.
    *
    * @param name {String} The name of the object to retrieve
    * @type Object
    */
   get: function(name) {
      var bitmap = this.cache[name];
      var font = {
         image: bitmap,
         info: this.fonts[name]
      };
      return font;
   },

});
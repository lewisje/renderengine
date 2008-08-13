/**
 * The Render Engine
 * ImageResourceLoader
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
 * @class Loads images and stores the reference to those images.
 *
 * @constructor
 * @param name {String=ImageLoader} The name of the resource loader
 * @extends ResourceLoader
 */
var ImageResourceLoader = ResourceLoader.extend(/** @scope ImageResourceLoader.prototype */{

	/**
	 * @private
	 */
   constructor: function(name) {
      this.base(name || "ImageLoader");
   },

   /**
    * Load an image resource from a URL.  Images are cached within the page
    * in an invisible object for fast retrieval.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    * @param width {Number} The width of this resource, in pixels
    * @param height {Number} The height of this resource, in pixels
    */
   load: function(name, url, width, height) {

      // Create the area if it doesn't exist which will
      // be used to load the images from their URL
      if (this.getElement() == null)
      {
         var div = jQuery("<div/>");
         div.css({ background: "black" });
         div.css({ display: "none" });

         this.setElement(div[0]);

         // Add it to the defauls context so it can be cleaned up
         Engine.getDefaultContext().add(this);
      }

      // Create an image element
      var image = null;
      if (url != null) {
         image = this.loadImageResource(name, url, width, height);
      }

      this.base(name, image);
   },

	/**
	 * Lazy loads an image resource when the information for it becomes available.
	 *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    * @param width {Number} The width of this resource, in pixels
    * @param height {Number} The height of this resource, in pixels
    * @return {HTMLImage} The image loaded
    */
   loadImageResource: function(name, url, width, height) {
      var image = $("<img/>").attr("src", url).attr("width", width).attr("height", height);
      var thisObj = this;
      image.bind("load", function() {
         thisObj.setReady(name, true);
      });

      // Append it to the container so it can load the image
      $(this.getElement()).append(image);
      return image;
   },

	/**
	 * Get the image from the resource stored with the specified name, or <tt>null</tt>
	 * if no such image exists.
	 *
	 * @param name {String} The name of the image resource
	 * @return {HTMLImage} The image
	 */
   get: function(name) {
      var img = this.base(name);
      return img ? img[0] : null;
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "image"
    */
   getResourceType: function() {
      return "image";
   }
}, /** @scope ImageResourceLoader.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "ImageResourceLoader"
    */
   getClassName: function() {
      return "ImageResourceLoader";
   }
});
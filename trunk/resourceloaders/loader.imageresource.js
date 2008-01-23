/**
 * The Render Engine
 * ImageResourceLoader
 * 
 * Loads images and stores the reference to those images.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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
 
var ImageResourceLoader = ResourceLoader.extend({
   
   elementStorage: null,
   
   load: function(name, location, width, height) {
   
      // Create the area if it doesn't exist which will
      // be used to load the images from their URL
      var doc = Engine.getDefaultContext().getSurface();
      var div = jQuery("<div/>");
      div.css({ display: none; });
      
      // Wrap the div in an object so it can be automatically cleaned up
      if (this.elementStorage == null)
      {
         this.elementStorage = new BaseObject("ImgStorage");
         this.elementStorage.setElement(div[0]);
         doc.add(elementStorage);
      }
      
   
      // Create an image element
      var image = document.createElement("img");
      image.src = location;
      image.width = width;
      image.height = height;

      // Append it to the document so it can load the image
      elementStorage.getElement().appendChild(image);
      
      this.base(name, image);
   }
   
});
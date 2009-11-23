/**
 * The Render Engine
 * ImageComponent
 *
 * @fileoverview An extension of the render component which handles 
 *               image resource rendering.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

// Includes
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.render.js");

Engine.initObject("ImageComponent", "RenderComponent", function() {

/**
 * @class A render component that renders an image.
 * @extends RenderComponent
 */
var ImageComponent = RenderComponent.extend(/** @scope ImageComponent.prototype */{

   currentImage: null,
   bbox: null,

   /**
    * @constructor
    */
   constructor: function(name, priority, image, width, height) {
      this.base(name, priority || 0.1);
      this.currentImage = image;
      this.bbox = Rectangle2D.create(0,0,width,height);
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.currentImage = null;
      this.bbox = null;
   },

   /**
    * Returns a bounding box which encloses the image.
    * @private
    */
   calculateBoundingBox: function() {
      return this.bbox;
    },

   /**
    * Set the image the component will render.
    *
    * @param image {HTMLImage} The image to render
    * @param width {Number} The width of the image, in pixels
    * @param height {Number} The height of the image, in pixels
    */
   setImage: function(image, width, height) {
      this.currentImage = image;
      this.bbox.setWidth(width);
      this.bbox.setHeight(height);
   },

   /**
    * Get the image the component is rendering.
    *
    * @return {HTMLImage}
    */
   getImage: function() {
      return this.currentImage;
   },

   /**
    * Draw the image to the render context.
    *
    * @param renderContext {RenderContext} The context to render to
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {

      if (!this.base(renderContext, time))
      {
         return;
      }

      if (this.currentImage) {
         renderContext.drawImage(this.getHostObject(), this.bbox, this.currentImage);
      }
   }
}, { /** @scope ImageComponent.prototype */
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ImageComponent";
   }
});

return ImageComponent;

});
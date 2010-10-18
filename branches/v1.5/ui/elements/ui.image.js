/**
 * The Render Engine
 * UIImageElement
 *
 * @fileoverview A user interface image.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 1216 $
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

// Includes
Engine.include("/ui/elements/ui.base.js");

Engine.initObject("UIImageElement", "BaseUIElement", function() {

/**
 * @class An image element drawn into a user interface.
 *
 *
 * @extends BaseUIElement
 * @constructor
 * @description Create a new instance of an image UI element.
 * @param name {String} The name of the element
 * @param [horizontalAlign] {Number} One of the horizontal alignment constants
 * @param [verticalAlign] {Number} One of the vertical alignment constants
 */
var UIImageElement = BaseUIElement.extend(/** @scope UIImageElement.prototype */{

   image: null,
   isSprite: null,
   renderComponent: null,

   /**
    * @private 
    */
   constructor: function(name, horizontalAlign, verticalAlign) {
      this.base(name, horizontalAlign, verticalAlign);
      this.image = null;
      this.isSprite = false;
      this.renderComponent = null;
   },

   /**
    * Releases the object back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.image = null;
      this.isSprite = null;
      this.renderComponent = null;
   },
   
   setImage: function(image) {
      this.image = image;
      this.isSprite = false;
      if (this.renderComponent != null) {
         this.removeHash("Image");
      }
      this.renderComponent = ImageComponent.create("Image", image);
      this.add(this.renderComponent);
   },
   
   setSprite: function(sprite) {
      this.image = sprite; 
      this.isSprite = true;
      if (this.renderComponent != null) {
         this.removeHash("Image");
      }
      this.renderComponent = SpriteComponent.create("Image", sprite);
      this.add(this.renderComponent);
   },
   
   /**
    * Draw the UI element in the UI.
    * @param renderContext {RenderContext} The render context to draw the user interface element into
    * @param time {Number} The engine time
    */
   draw: function(renderContext, time) {
      if (!this.base(renderContext, time)) {
         return false;
      }
      this.base(renderContext, time);
   }

}, /** @scope UIImageElement.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "UIImageElement"
    */
   getClassName: function() {
      return "UIImageElement";
   }  
});

return UIImageElement;

});
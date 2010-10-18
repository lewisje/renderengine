/**
 * The Render Engine
 * UIButtonElement
 *
 * @fileoverview A user interface button.
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
Engine.include("/ui/elements/ui.image.js");

Engine.initObject("UIButtonElement", "UIImageElement", function() {

/**
 * @class A button element drawn into a user interface.
 *
 *
 * @extends UIImageElement
 * @constructor
 * @description Create a new instance of a button UI element.
 * @param name {String} The name of the element
 * @param [horizontalAlign] {Number} One of the horizontal alignment constants
 * @param [verticalAlign] {Number} One of the vertical alignment constants
 */
var UIButtonElement = UIImageElement.extend(/** @scope UIButtonElement.prototype */{

   text: null,

   /**
    * @private 
    */
   constructor: function(name, horizontalAlign, verticalAlign) {
      this.base(name, horizontalAlign, verticalAlign);
      this.text = null;
   },

   /**
    * Releases the object back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.text = null;
   },
   
   setText: function(text) {
      this.text = text;
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

}, /** @scope UIButtonElement.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "UIButtonElement"
    */
   getClassName: function() {
      return "UIButtonElement";
   }  
});

return UIButtonElement;

});
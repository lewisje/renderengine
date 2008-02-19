/**
 * The Render Engine
 * RenderComponent
 *
 * A component which can render itself to a render context.
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

var RenderComponent = BaseComponent.extend(/** @scope RenderComponent.prototype */{

   drawMode: 0,

   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 0.1);
   },

   setDrawMode: function(drawMode) {
      this.drawMode = drawMode;
   },

   getDrawMode: function() {
      return this.drawMode;
   },

   execute: function(renderContext, time) {

      if (this.drawMode == RenderContext.NO_DRAW)
      {
         return;
      }

      // Set up drawing state
      // Xor, source-in, dest-in, etc...

      // Tear down drawing state

   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "RenderComponent";
   }
}, { // Static

   DRAW: 0,

   NO_DRAW: 1

});
/**
 * The Render Engine
 * HTMLElementContext
 *
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

Engine.initObject("HTMLElementContext", "RenderContext2D", function() {

/**
 * @class A reference to the <tt>document.body</tt> element as a rendering context.
 * Aside from being The Render Engine's default rendering context, the context
 * is essentially a wrapper for the HTML document.  Wrapping, in this way, allows
 * us to update not only this context, but all other contexts during an engine frame.
 *
 * @extends RenderContext2D
 */
var HTMLElementContext = RenderContext2D.extend(/** @scope DocumentContext.prototype */{

   /**
    * Create an instance of an HTML element rendering context.  This context
    * represents any HTML element.
    * @memberOf HTMLElementContext
    * @constructor
    */
   constructor: function(name, element) {
      this.base(name || "HTMLElementContext", element);
   },

   /**
    * Eliminate the elements from container element.
    * @memberOf HTMLElementContext
    */
   destroy: function() {
      var objs = this.getObjects();
      for (var o in objs)
      {
         var e = objs[o].getElement();
         if (e && e != document.body) {
            Console.log("DOM element ", e, " removed from ", this.getSurface());
            this.getSurface().removeChild(e);
         }
      }

      this.base();
   },

   /**
    * @memberOf HTMLElementContext
    */
   add: function(obj) {
      if (obj.getElement())
      {
         this.getSurface().appendChild(obj.getElement());
      }
      this.base(obj);
   },

   /**
    * @memberOf HTMLElementContext
    */
   remove: function(obj) {
      if (obj.getElement())
      {
         this.getSurface().removeChild(obj.getElement());
      }
      this.base(obj);
   }
}, /** @scope HTMLElementContext */{

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "HTMLElementContext";
   }
});

return HTMLElementContext;

});

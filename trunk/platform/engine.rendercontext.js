/**
 * The Render Engine
 * RenderContext
 * 
 * A base rendering context.  Game objects are rendered to a context
 * during engine runtime.
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
 
var RenderContext = Container.extend({
    
   surface: null,
   
   transformStackDepth: 0,
    
   constructor: function(contextName, surface) {
      this.base(contextName || "RenderContext");
      this.surface = surface;
      this.setElement(surface);
   },

   destroy: function() {
      if (this.surface.parentNode && this.surface != document.body)
      {
         this.surface.parentNode.removeChild(this.surface);
      }
      this.surface = null;
      
      this.base();
   },
   
   setSurface: function(element) {
      this.surface = element;
   },
   
   getSurface: function() {
      return this.surface;
   },
   
   render: function(time) {
      // Push the world transform
      this.pushTransform();

      // Render the objects into the world
      var objs = this.getObjects();
      for (var o in objs)
      {
         objs.update(this, time);
      }

      // Restore the world transform
      this.popTransform();
   },
   
   pushTransform: function() {
      this.transformStackDepth++;   
   },
   
   popTransform: function() {
      this.transformStackDepth--;
      Assert((this.transformStackDepth >= 0), "Unbalanced transform stack!");
   },
   
   getClassName: function() {
      return "RenderContext";
   }

});

/**
 * The Render Engine
 * CanvasContext
 * 
 * A canvas element represented within the engine.
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
 
var CanvasContext = RenderContext.extend({

   width: 0,
   
   height: 0,
   
   /**
    * Create an instance of a 2D rendering context using the canvas element.
    *
    * @param contextName {String} The name of this context.  Default: CanvasContext
    * @param width {Number} The width (in pixels) of the canvas context.
    * @param height {Number} The height (in pixels) of the canvas context.
    */
   constructor: function(contextName, width, height) {
      width = contextName instanceof Number ? contextName : width;
      height = contextName instanceof Number ? width : height;
      contextName = contextName instanceof Number ? "CanvasContext" : contextName;
      
      Assert((width != null && height != null), "Width and height must be specified in CanvasContext");
      
      this.width = width;
      this.height = height;
      
      // Create the canvas element
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.id = this.getId();
      
      this.base(contextName, canvas);
   },
   
   /**
    * Gets the surface context upon which all objects are drawn.
    */
   get2DContext: function() {
      return this.getSurface().getContext('2d');
   },
   
   /**
    * Push a transform state onto the stack.
    */
   pushTransform: function() {
      this.base();
      this.get2DContext().save();
   },
   
   /**
    * Pop a transform state off the stack.
    */
   popTransform: function() {
      this.base();
      this.get2DContext().restore();
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "CanvasContext";
   }
});
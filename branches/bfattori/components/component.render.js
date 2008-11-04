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

// Includes
Engine.include("/components/component.base.js");

Engine.initObject("RenderComponent", "BaseComponent", function() {

/**
 * @class The base component class for components which render
 *        to a context.
 *
 * @param name {String} The name of the component
 * @param priority {Number} The priority of the component between 0.0 and 1.0
 */
var RenderComponent = BaseComponent.extend(/** @scope RenderComponent.prototype */{

   drawMode: 0,

   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 0.1);
   },

   release: function() {
      this.base();
      this.drawMode = 0;
   },

   /**
    * Set the draw mode of the component.  Currently this determines
    * if the component should render itself to the context or not.
    *
    * @param drawMode {Number} One of <tt>RenderComponent.DRAW</tt> or
    *                 <tt>RenderComponent.NO_DRAW</tt>
    */
   setDrawMode: function(drawMode) {
      this.drawMode = drawMode;
   },

   /**
    * Get the drawing mode of the component.
    * @type Number
    */
   getDrawMode: function() {
      return this.drawMode;
   },

   /**
    * Handles whether or not the component should draw to the
    * render context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {

      // Check visibility
      if ((this.drawMode == RenderComponent.NO_DRAW) ||
          this.getHostObject().getWorldBox &&
          (!renderContext.getViewport().isIntersecting(this.getHostObject().getWorldBox())))
      {
         return false;
      }

      // The object is visible
      Engine.vObj++;
      return true;
   }

}, { // Static

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "RenderComponent";
   },

   /**
    * The component should render itself to the rendering context.
    */
   DRAW: 0,

   /**
    * The component <i>should not</i> render itself to the rendering context.
    */
   NO_DRAW: 1

});

return RenderComponent;

});
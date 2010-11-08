/**
 * The Render Engine
 * UI
 *
 * @fileoverview An extension of the <tt>HostObject</tt> which is specifically geared
 *               towards 2d game development.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
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
Engine.include("/rendercontexts/context.htmldivcontext.js");
Engine.include("/engine/engine.container.js");

// UI Element types
Engine.include("/ui/elements/ui.base.js");
Engine.include("/ui/elements/ui.button.js");
Engine.include("/ui/elements/ui.checkbox.js");
Engine.include("/ui/elements/ui.image.js");
Engine.include("/ui/elements/ui.input.js");
Engine.include("/ui/elements/ui.textbox.js");

Engine.initObject("UI", "HTMLDivContext", function() {

/**
 * @class A user interface object.  Draws a user interface which a user
 * 		 can interact with.  The user interface can be read from a resource
 * 		 file.
 * 
 * @param name {String} The name of the user interface
 * @constructor
 * @extends HTMLDivContext
 * @description Create a user interface
 */
var UI = HTMLDivContext.extend(/** @scope UI.prototype */{

	visible: null,
	rendered: false,

   /**
    * @private
    */
   constructor: function(name, top, left, width, height) {
		top = top || 0;
		left = left || 0;
		width = width || EngineSupport.sysInfo().viewWidth;
		height = height || EngineSupport.sysInfo().viewHeight;
		this.base(name, width, height);
		this.visible = false;
		this.rendered = false;
		this.getSurface().css({
			top: top,
			left: left,
			display: "none"
		});
   },
	
	/**
	 * Destroy the object.
	 */
	destroy: function() {
		this.elements.cleanUp();
		this.elements.destroy();
	},

	isVisible: function() {
		return this.visible;
	},
	
	add: function(uiElement) {
      Assert((BaseUIElement.isInstance(uiElement)), "Invalid element type added to UI");
      uiElement.setUI(this);
		this.base(uiElement);
	},
	
	show: function() {
		this.visible = true;
		this.getSurface().css("display", "block");
	},
	
	hide: function() {
		this.visible = false;
		this.getSurface().css("display", "none");	
	},
	
   /**
    * Draw the UI objects within the render context.
    *
    * @param renderContext {RenderContext} The context the UI will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      // Draw the UI objects
      for (var ui = this.elements.iterator(); ui.hasNext(); ) {
         ui.next().update(renderContext, time);
      }
   }

}, /** @scope UI.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "UI"
    */
   getClassName: function() {
      return "UI";
   }
	
});

return UIObject;

});
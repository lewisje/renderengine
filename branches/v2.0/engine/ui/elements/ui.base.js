/**
 * The Render Engine
 * BaseUIElement
 *
 * @fileoverview The base class from which all UI objects extend.
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
Engine.include("/engine.math2d.js");
Engine.include("/engine.object2d.js");
Engine.include("/components/component.transform2d.js");

Engine.initObject("BaseUIElement", "Object2D", function() {

/**
 * @class All UI components extend from this object class.
 *
 *
 * @constructor
 * @description Create a new instance of a UI element, setting the name and
 * 				 optionally where to position the element relative to it's position.
 * @param name {String} The name of the element
 * @param [horizontalAlign] {Number} One of the horizontal alignment constants
 * @param [verticalAlign] {Number} One of the vertical alignment constants
 * @extends Object2D
 */
var BaseUIElement = Base.extend(/** @scope BaseUIElement.prototype */{

	layout: null,
	relativeTo: null,
	ui: null,
	name: null,
	rendered: false,

   /**
    * @private 
    */
   constructor: function(name, horizontalAlign, verticalAlign) {
		this.base(name);
		this.name = name;
		this.layout = {
			horizontal: horizontalAlign || BaseUIElement.ALIGN_LEFT,
			vertical: verticalAlign || BaseUIElement.VALIGN_TOP
		}
		this.relativeTo = null;
		this.ui = null;
		this.rendered = false;
		
		this.add(Transform2DComponent.create("position"));
   },
	
	/**
	 * Set the user interface this element belongs to.
	 * @param ui {UIObject} The user interface
	 */
	setUI: function(ui) {
		this.ui = ui;
	},
	
	/**
	 * Get the user interface this element belongs to.
	 * @return {UIObject}
	 */
	getUI: function() {
		return this.ui;
	},
	
	/**
	 * Set the horizontal and vertical layout of this element, relative to it's position.
	 * @param horizontal {Number} One of the horizontal layout constants
	 * @param vertical {Number} One of the vertical layout constants
	 */
	setLayout: function(horizontal, vertical) {
		this.layout.horizontal = horizontal;
		this.layout.vertical = vertical;
	},
	
	/**
	 * Set the horizontal layout of this element, relative to it's position.
	 * @param horizontal {Number} One of the horizontal layout constants
	 */
	setHorizontalLayout: function(horizontal) {
		this.layout.horizontal = horizontal;
	},
	
	/**
	 * Set the vertical layout of this element, relative to it's position.
	 * @param vertical {Number} One of the vertical layout constants
	 */
	setVerticalLayout: function(vertical) {
		this.layout.vertical = vertical;
	},

	/**
	 * Get the horizontal layout for this element
	 * @return {Number} Either {@link #ALIGN_LEFT}, {@link #ALIGN_RIGHT}, or {@link #ALIGN_CENTER}
	 */	
	getHorizontalLayout: function() {
		return this.layout.horizontal;
	},

	/**
	 * Get the vertical layout for this element
	 * @return {Number} Either {@link #VALIGN_TOP}, {@link #VALIGN_BOTTOM}, or {@link #VALIGN_MIDDLE}
	 */	
	getVerticalLayout: function() {
		return this.layout.vertical;
	},
	
	/**
	 * Set the UI element this element should be positioned relative to.  This
	 * allows multiple UI elements to be positioned relative to each other so that the interface
	 * maintains a clean look.
	 * @param uiObject {BaseUIElement} The UI element to position relative to
	 */
	setRelativeTo: function(uiElement) {
		Assert((BaseUIElement.isInstance(uiElement)), "BaseUIElement.setRelativeTo() called with invalid element");
		this.relativeTo = uiElement;
	},
	
	/**
	 * Get the UI element this element is positioned relative to.
	 * @return {BaseUIElement}
	 */
	getRelativeTo: function() {
		return this.relativeTo;
	},
	
	setPosition: function(point) {
		this.getComponent("position").setPosition(point);
	},
	
	getPosition: function() {
		return this.getComponent("position").getPosition();
	},
	
	/**
	 * Draw the UI element in the UI.
	 * @param renderContext {RenderContext} The render context to draw the user interface element into
	 * @param time {Number} The engine time
	 * @return {Boolean} <tt>true</tt> if the element should draw
	 */
	update: function(renderContext, time) {
		this.base(renderContext, time);
	}

}, /** @scope BaseUIElement.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "BaseUIElement"
    */
   getClassName: function() {
      return "BaseUIElement";
   },
	
	/**
	 * Left align the component to the given positioning coordinate.
	 * @type {Number}
	 */
	ALIGN_LEFT: 0,
	
	/**
	 * Right align the component to the given positioning coordinate.
	 * @type {Number}
	 */
	ALIGN_RIGHT: 1,
	
	/**
	 * Center the component horizontally to the given positioning coordinate.
	 * @type {Number}
	 */
	ALIGN_CENTER: 2,
	
	/**
	 * Vertically align the component to the top of the given positioning coordinate.
	 * @type {Number}
	 */
	VALIGN_TOP: 0,
	
	/**
	 * Vertically align the component to the bottom of the given positioning coordinate.
	 * @type {Number}
	 */
	VALIGN_BOTTOM: 1,
	
	/**
	 * Vertically align the component to the middle of the given positioning coordinate.
	 * @type {Number}
	 */
	VALIGN_MIDDLE: 2

	
});

return BaseUIElement;

});
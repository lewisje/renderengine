/**
 * The Render Engine
 * BoxBodyComponent
 *
 * @fileoverview A physical rectangular body component for use in a {@link Simulation}.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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
Engine.include("/components/component.basebody.js");
Engine.include("/physics/collision/shapes/b2BoxDef.js");

Engine.initObject("BoxBodyComponent", "BaseBodyComponent", function() {

/**
 * @class An extension of the {@link BaseBodyComponent} which creates a rectangular
 * 		 physical body.  
 *
 * @param name {String} Name of the component
 * @param extents {Point2D} The extents of the body along X and Y
 *
 * @extends BaseBodyComponent
 * @constructor
 * @description A rectangular physical body component.
 */
var BoxBodyComponent = BaseBodyComponent.extend(/** @scope BoxBodyComponent.prototype */{

	extents: null,

	/**
	 * @private
	 */
	constructor: function(name, extents) {
		this.base(name, new b2BoxDef());
		this.extents = Point2D.create(extents);
		var e = extents.get();
		this.getShapeDef().extents.Set(e.x, e.y);
		this.setLocalOrigin(Math.floor(e.x / 2), Math.floor(e.y / 2));
	},
	
	destroy: function() {
		this.extents.destroy();
		this.base();
	},
	
	release: function() {
		this.extents = null;
		this.base();
	},
	
	/**
	 * Set the extents of the box's body.
	 * 
	 * @param extents {Point2D} The extents of the body along X and Y
	 */
	setExtents: function(extents) {
		this.extents = extents;
		var e = extents.get();
		this.getShapeDef().extents.Set(e.x, e.y);;
	},
	
	/**
	 * Get the extents of the box's body.
	 * @return {Point2D}
	 */
	getExtents: function() {
		return this.extents;
	}
	
	/* pragma:DEBUG_START */
	/**
	 * Adds shape debugging
	 * @private
	 */	
	,execute: function(renderContext, time) {
		this.base(renderContext, time);
		if (Engine.getDebugMode()) {
			renderContext.pushTransform();
			renderContext.setLineStyle("blue");
			var hx = this.extents.get().x / 2;
			var hy = this.extents.get().y / 2;
			var rect = Rectangle2D.create(-hx, -hy, hx * 2, hy * 2);
			rect.offset(this.getLocalOrigin());
			renderContext.drawRectangle(rect);
			rect.destroy();
			renderContext.popTransform();
		}	
	}
	/* pragma:DEBUG_END */
	

}, { /** @scope BoxBodyComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String} "BoxBodyComponent"
    */
   getClassName: function() {
      return "BoxBodyComponent";
   }
   
});

return BoxBodyComponent;

});
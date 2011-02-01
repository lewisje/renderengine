/**
 * The Render Engine
 * CircleBodyComponent
 *
 * @fileoverview A physical circular body component for use in a {@link Simulation}.
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.components.CircleBody",
	"requires": [
		"R.components.BaseBody",
		"R.math.Point2D",
		"R.math.Rectangle2D"
	]
});

/**
 * @class An extension of the {@link R.components.BaseBody} which creates a circular
 * 		 rigid body.  
 *
 * @param name {String} Name of the component
 * @param radius {Number} The radius of the circle
 *
 * @extends R.components.BaseBody
 * @constructor
 * @description A circular rigid body component.
 */
R.components.CircleBody = function() {
	return R.components.BaseBody.extend(/** @scope R.components.CircleBody.prototype */{

	radius: 0,

	/**
	 * @private
	 */
	constructor: function(name, radius) {
		var fixDef = new Box2D.Dynamics.b2FixtureDef();
		fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radius);

		this.base(name, fixDef);
		this.radius = radius;
		this.setLocalOrigin(radius, radius);
	},
	
	/**
	 * Releases the component back into the object pool.
	 */
	release: function() {
		this.base();
		this.radius = 0;
	},
	
	/**
	 * Set the radius of the circle's body.  Calling this method after
	 * simulation has started on the body has no effect.
	 * 
	 * @param radius {Number} The radius of the body
	 */
	setRadius: function(radius) {
		this.radius = radius;
		this.getFixtureDef().shape.SetRadius(radius);
		if (this.simulation) {
			this.updateFixture();
		}
	},
	
	/**
	 * Get the radius of the circle's body.
	 * @return {Number}
	 */
	getRadius: function() {
		return this.radius;
	},

	/**
	 * Get a box which bounds the body.
	 * @return {R.math.Rectangle2D}
	 */
	getBoundingBox: function() {
		var box = this.base();
		var r = this.radius;
		box.set(0, 0, r * 2, r * 2);
		return box;
	}

	/* pragma:DEBUG_START */
	/**
	 * Adds shape debugging
	 * @private
	 */	
	,execute: function(renderContext, time) {
		this.base(renderContext, time);
		if (R.Engine.getDebugMode()) {
			renderContext.pushTransform();
			renderContext.setLineStyle("blue");
			renderContext.setScale(1/this.getScale());
			renderContext.drawArc(R.math.Point2D.ZERO, this.getRadius(), 0, 360);
			renderContext.popTransform();
		}	
	}
	/* pragma:DEBUG_END */

}, { /** @scope R.components.CircleBody.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String} "R.components.CircleBody"
    */
   getClassName: function() {
      return "R.components.CircleBody";
   }
   
});
}
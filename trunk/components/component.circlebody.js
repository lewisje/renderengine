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

// Includes
Engine.include("/components/component.basebody.js");
Engine.include("/physics/collision/shapes/b2CircleDef.js");

Engine.initObject("CircleBodyComponent", "BaseBodyComponent", function() {

/**
 * @class An extension of the {@link LogicComponent} which creates a circular
 * 		 physical body.  
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends ColliderComponent
 * @constructor
 * @description For this component to function, a movement vector must be available on the 
 *        host object by implementing the {@link Object2D#getVelocity} method which returns 
 *        a {@link Vector2D} instance.  Additionally the host object and collision object 
 *        must implement the {@link Object2D#getCircle} method which returns a 
 *        {@link Circle2D} instance.
 */
var CircleBodyComponent = BaseBodyComponent.extend(/** @scope CircleBodyComponent.prototype */{

	radius: 0,

	constructor: function(name, radius) {
		this.base(name, new b2CircleDef());
		this.getShapeDef().radius = radius;
	},
	
	setRadius: function(radius) {
		this.getShapeDef().radius = radius;
	},
	
	getRadius: function() {
		return this.getShapeDef().radius;
	}

}, { /** @scope CircleBodyComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String}
    */
   getClassName: function() {
      return "CircleBodyComponent";
   }
   
});

return CircleBodyComponent;

});
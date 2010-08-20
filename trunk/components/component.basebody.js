/**
 * The Render Engine
 * CircleBodyComponent
 *
 * @fileoverview The base component type for all physical bodies which can be used
 * 				  in a {@link Simulation}.
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
Engine.include("/components/component.transform2d.js");
Engine.include("/physics/dynamics/b2BodyDef.js");

Engine.initObject("BaseBodyComponent", "Transform2DComponent", function() {

/**
 * @class The base physical body component which initializes physical bodies
 * 		 for use in a {@link Simulation}.  
 *
 * @param name {String} Name of the component
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends LogicComponent
 * @constructor
 * @description All physical body components should extend from this component type
 * 				 to inherit such values as density and friction.
 */
var BaseBodyComponent = Transform2DComponent.extend(/** @scope BaseBodyComponent.prototype */{

	bodyDef: null,
	shapeDef: null,
	simulation: null,
	body: null,

   /**
    * @private
    */
	constructor: function(name, shapeDef) {
		this.base(name || "BaseBody");	

		this.shapeDef = shapeDef;
		this.shapeDef.restitution = BaseBodyComponent.DEFAULT_RESTITUTION;
		this.shapeDef.density = BaseBodyComponent.DEFAULT_DENSITY;
		this.shapeDef.friction = BaseBodyComponent.DEFAULT_FRICTION;
	},

	setSimulation: function(simulation) {
		this.simulation = simulation;
		this.body = simulation.addBody(this.getBodyDef());		
	},
	
	getShapeDef: function() {
		return this.shapeDef;
	},
	
	getBodyDef: function() {
		if (this.bodyDef == null) {
			this.bodyDef = new b2BodyDef();
			this.bodyDef.AddShape(this.shapeDef);
		}
		return this.bodyDef;
	},
	
	getBody: function() {
		return this.body;
	},
	
	setRestitution: function(restitution) {
		this.shapeDef.resitution = restitution
	},
	
	getRestitution: function() {
		return this.shapeDef.resitution;
	},
	
	setDensity: function(density) {
		this.shapeDef.density = density;
	},
	
	getDensity: function() {
		return this.shapeDef.density;
	},
	
	setFriction: function(friction) {
		this.shapeDef.friction = friction;
	},
	
	getFriction: function() {
		return this.shapeDef.friction;
	},
	
	setPosition: function(point) {
		var pos = point.get();
		this.getBodyDef().position.Set(pos.x, pos.y);
	},
	
	getPosition: function() {
		return Point2D.create(this.body.m_position.x, this.body.m_position.y);	
	},
	
	applyForce: function(forceVector, dirVector) {
		this.getBody().WakeUp();
		var f = forceVector.get();
		var d = forceVector.get();
		var fv = new b2Vec2(f.x, f.y);
		var dv = new b2Vec2(d.x, d.y);
		this.getBody().ApplyForce(fv, dv);	
	}
	
}, { /** @scope BaseBodyComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String}
    */
   getClassName: function() {
      return "BaseBodyComponent";
   },
	
	DEFAULT_RESTITUTION: 0.48,
	DEFAULT_DENSITY: 1.0,
	DEFAULT_FRICTION: 0
   
});

return BaseBodyComponent;

});
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
 * @param shapeDef {b2ShapeDef} The shape definition. Either {@link b2CircleDef}, {@link b2BoxDef}, or
 * 			{@link b2PolyDef}.
 *
 * @extends Transform2DComponent
 * @constructor
 * @description All physical body components should extend from this component type
 * 				 to inherit such values as density and friction, and gain access to position and rotation.
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
		this.simulation = null;
	},

	/**
	 * Start simulating the body.  If the body isn't a part of the simulation,
	 * it is added and simulation occurs.  Position and rotation will be updated.
	 */
	startSimulation: function() {
		if (!this.simulation) {
			this.simulation = this.getHostObject().getSimulation();
			this.body = this.simulation.addBody(this.getBodyDef());
		}
	},
	
	/**
	 * Stop simulating the body.  If the body is a part of a simulation,
	 * it is removed and simulation stops.  The position and rotation of
	 * the body will not be updated.
	 */
	stopSimulation: function() {
		if (this.simulation) {
			this.simulation.removeBody(this.getBody());			
			this.simulation = null;
		}
	},
	
	/**
	 * Get the Box2d shape definition object.
	 * @return {b2ShapeDef}
	 */
	getShapeDef: function() {
		return this.shapeDef;
	},
	
	/**
	 * Get the Box2d body definition object.
	 * @return {b2BodyDef}
	 */
	getBodyDef: function() {
		if (this.bodyDef == null) {
			this.bodyDef = new b2BodyDef();
			this.bodyDef.AddShape(this.shapeDef);
		}
		return this.bodyDef;
	},
	
	/**
	 * Get the Box2d body object which was added to the simulation.
	 * @return {b2Body}
	 */
	getBody: function() {
		return this.body;
	},
	
	/**
	 * Set the resitution (bounciness) of the body.  The value should be between
	 * zero and one.  Values higher than one are accepted, but produce objects which
	 * are unrealistically bouncy.
	 * 
	 * @param restitution {Number} A value between 0.0 and 1.0
	 */
	setRestitution: function(restitution) {
		this.shapeDef.resitution = restitution
	},
	
	/**
	 * Get the resitution (bounciness) value for the body.
	 * @return {Number}
	 */
	getRestitution: function() {
		return this.shapeDef.resitution;
	},
	
	/**
	 * Set the density of the body.
	 * 
	 * @param density {Number} The density of the body
	 */
	setDensity: function(density) {
		this.shapeDef.density = density;
	},
	
	/**
	 * Get the density of the body.
	 * @return {Number}
	 */
	getDensity: function() {
		return this.shapeDef.density;
	},
	
	/**
	 * Set the friction of the body.  Lower values slide easily across other bodies.
	 * Higher values will cause a body to stop moving as it slides across other bodies.
	 * However, even a body which has high friction will keep sliding across a body
	 * with no friction.
	 * 
	 * @param friction {Number} The friction of the body
	 */
	setFriction: function(friction) {
		this.shapeDef.friction = friction;
	},
	
	/**
	 * Get the friction of the body.
	 * @return {Number}
	 */
	getFriction: function() {
		return this.shapeDef.friction;
	},
	
	/**
	 * Set the initial position of the body.  Once a body is in motion, updating
	 * its position should be avoided since it doesn't fit with physical simulation.
	 * To change an object's position, try applying forces or impulses to the body.
	 * 
	 * @param point {Point2D} The initial position of the body
	 */
	setPosition: function(point) {
		var pos = point.get();
		this.getBodyDef().position.Set(pos.x, pos.y);
	},
	
	/**
	 * Get the position of the body during simulation.  This value is updated
	 * as the simulation is stepped.
	 * @return {Point2D}
	 */
	getPosition: function() {
		return Point2D.create(this.body.m_position.x, this.body.m_position.y);	
	},
	
	/**
	 * Get the rotation of the body during simulation.  This value is updated
	 * as the simulation is stepped.
	 * @return {Number}
	 */
	getRotation: function() {
		return this.body.m_rotation;
	},
	
	/**
	 * Apply a force to the body.  Forces are comprised of a force vector and
	 * a position.  The force vector is the direction in which the force is
	 * moving, while the position is where on the body the force is acting.
	 * 
	 * @param forceVector {Vector2D} The force vector
	 * @param position {Point2D} The position where the force is acting upon the body
	 */
	applyForce: function(forceVector, position) {
		this.getBody().WakeUp();
		var f = forceVector.get();
		var d = position.get();
		var fv = new b2Vec2(f.x, f.y);
		var dv = new b2Vec2(d.x, d.y);
		this.getBody().ApplyForce(fv, dv);	
	}
	
}, { /** @scope BaseBodyComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String} "BaseBodyComponent"
    */
   getClassName: function() {
      return "BaseBodyComponent";
   },
	
	/**
	 * The default restitution (bounciness) of a body
	 */
	DEFAULT_RESTITUTION: 0.48,
	
	/**
	 * The default density of a body
	 */
	DEFAULT_DENSITY: 1.0,
	
	/**
	 * The default friction of a body
	 */
	DEFAULT_FRICTION: 0
   
});

return BaseBodyComponent;

});
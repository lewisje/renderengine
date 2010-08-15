/**
 * The Render Engine
 *
 * Simulation object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

Engine.include("/physics/collision/b2AABB.js");
Engine.include("/physics/dynamics/b2World.js");

Engine.initObject("Simulation", "BaseObject", function() {

	/**
	 * @class A representation of a physical world.  This object is used to
	 *        introduce Box2dJS physics into your game by creating a world
	 *        which supports the physical structures provided by Box2dJS.  You
	 *        will need to create a <tt>Simulation</tt> before you can utilize
	 *        physics in a game.
	 *         
	 * @param name {String} The name of the object
	 * @param worldBoundary {Rectangle2D} The physical world boundary
	 * @param [gravity] {Vector2D} The world's gravity vector. default: [0, 300]
	 * @extends BaseObject
	 * @constructor
	 * @description Create a physical world for Box2dJS
	 */
	var Simulation = BaseObject.extend({

		worldAABB: null,
		world: null,
		gravity: null,
		doSleep: true,
		worldBoundary: null,

		constructor: function(name, worldBoundary, gravity) {
			this.base(name);
			this.gravity = gravity || Vector2D.create(0, 300);
			this.worldAABB = new b2AABB();
			
			this.worldBoundary = worldBoundary;
			var wb = worldBoundary.get();
			this.worldAABB.minVertex.Set(wb.x, wb.y);
			this.worldAABB.maxVertex.Set(wb.x + w, wb.y + h);
			this.doSleep = true;

			var gravity = new b2Vec2(this.gravity.x, this.gravity.y);

			// Create the world
			this.world = new b2World(this.worldAABB, gravity, this.doSleep);		
		},
		
		destroy: function() {
			this.worldBoundary.destroy();
			this.gravity.destroy();
			this.base();
		},
		
		release: function() {
			this.worldAABB = null;
			this.gravity = null,
			this.worldBoundary = null;
			this.world = null;
			this.base();
		},
		
		update: function(renderContext, time) {
			// step the world	
		},
		
		/**
		 * Support method to get the ground body for the world.
		 * @return {b2Body} The world's ground body
		 * @private
		 */
		getGroundBody: function() {
			return this.world.GetGroundBody();
		},
		
		/**
		 * Support method to add a body to the simulation.  The body must be one of the
		 * box2d-js body types.  This method is intended to be used by {@link SimulationObject}.
		 * 
		 * @param b2jsBody {b2Body} A box2d-js Body object
		 * @private
		 */
		addBody: function(b2jsBody) {
			this.world.CreateBody(b2jsBody);
		},
		
		/**
		 * Support method to add a joint to the simulation.  The joint must be one of the
		 * box2d-js joint types.  This method is intended to be used by {@link SimulationObject}.
		 * 
		 * @param b2jsJoint {b2Joint} A box2d-js Joint object
		 * @private
		 */
		addJoint: function(b2jsJoint) {
			this.world.CreateJoint(b2jsJoint);
		},
		
		/**
		 * Support method to remove a body from the simulation.  The body must be one of the
		 * box2d-js body types.  This method is intended to be used by {@link SimulationObject}.
		 * 
		 * @param b2jsBody {b2Body} A box2d-js Body object
		 * @private
		 */
		removeBody: function(b2jsBody) {
			this.world.DestroyBody(b2jsBody);
		},
		
		/**
		 * Support method to remove a joint from the simulation.  The joint must be one of the
		 * box2d-js joint types.  This method is intended to be used by {@link SimulationObject}.
		 * 
		 * @param b2jsJoint {b2Joint} A box2d-js Joint object
		 * @private
		 */
		removeJoint: function(b2jsJoint) {
			this.world.DestroyJoint(b2jsJoint);
		}		
		
	});

	return Simulation;
	
});
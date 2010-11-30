/**
 * The Render Engine
 * ConvexColliderComponent
 *
 * @fileoverview A collision component which determines collisions using
 *               the Separating Axis Theorem and a convex hull.
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
Engine.include("/components/component.collider.js");


Engine.initObject("CollisionData", "PooledObject", function() {

/**
 * @class A simple object which contains information about a collision.
 *
 * @extends PooledObject
 * @constructor
 * @description Creates a collision data structure.
 */
	var CollisionData = PooledObject.extend({
		overlap: 0,
		unitVector: null,
		shape1: null,
		shape2: null,
		impulseVector: null,
		
		constructor: function(o,u,s1,s2,i) {
			this.overlap = o;
			this.unitVector = u;
			this.shape1 = s1;
			this.shape2 = s2;
			this.impulseVector = i;
		},
		
		destroy: function() {
			this.impulseVector.destroy();
			this.unitVector.destroy();
			this.base();
		},
		
		release: function() {
			this.base();
			this.overlap = 0;
			this.unitVector = null;
			this.shape1 = null;
			this.shape2 = null;
			this.impulseVector = null;
		}
	});

	return CollisionData;
});

Engine.initObject("ConvexColliderComponent", "ColliderComponent", function() {

/**
 * @class An extension of the {@link ColliderComponent} which will check the
 *        object's convex collision hulls using the Separating Axis Theorm (SAT).  Each object must
 *        have a collision hull assigned to it with {@link Object2D#setCollisionHull}.
 *        <p/>
 *        The SAT states that, if an axis can be found where the two object's hull
 *        don't overlap, then the two objects cannot be colliding.  When a collision
 *        is determined, querying {@link #getImpulseVector} will return a {@link Vector2D}
 *        which can be used to separate the first object from the second.  Negating the
 *        vector, you can apply it to the target object instead.
 *        <p/>
 *        The vector can also be manipulated to simulate physical forces such as
 *        bounciness and friction.
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends ColliderComponent
 * @constructor
 * @description Creates a collider component for SAT collision testing.  Each object's
 *              collision will be determined using its convex collision hull.
 */
var ConvexColliderComponent = ColliderComponent.extend(/** @scope SATColliderComponent.prototype */{

	cData: null,
	
	/**
	 * @private
	 */
	constructor: function(name, collisionModel, priority) {
		this.base(name, collisionModel, priority);
		this.cData = null;
	},
	
	/**
	 * Destroy the collider component.
	 */
	destroy: function() {
		if (this.cData != null) {
			this.cData.destroy();
		}
		this.base();
	},
	
	/**
	 * Release the component back into the object pool.
	 */
	release: function() {
		this.base();
		this.cData = null;
	},

   /**
    * If a collision occurs, calls the host object's <tt>onCollide()</tt> method, 
    * passing the time of the collision, the potential collision object, and the host 
    * and target masks.  The return value should either tell the collision tests to continue or stop.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @param hostMask {Number} The collision mask for the host object
    * @param targetMask {Number} The collision mask for <tt>collisionObj</tt>
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj, hostMask, targetMask) {
		if (this.cData != null) {
			// Clean up old data first
			this.cData.destroy();
		}
		
		this.cData = ConvexColliderComponent.test(this.getHostObject().getCollisionHull(), 
			collisionObj.getCollisionHull());
		
		// If a collision occurred, there will be a data structure describing it	
      if (this.cData != null) {
         return this.base(time, collisionObj, hostMask, targetMask);
      }
      
      return ColliderComponent.CONTINUE;
   },
	
	/**
	 * Returns the computed impulse vector to keep the two objects separate along
	 * the shortest vector.
	 * @return {Vector2D}
	 */
	getCollisionData: function() {
		return this.cData;
	}

}, { /** @scope SATColliderComponent.prototype */

   /**
    * Get the class name of this object
    * @return {String} "ConvexColliderComponent"
    */
   getClassName: function() {
      return "ConvexColliderComponent";
   },
	
	/**
	 * Performs the SAT collision test for <code>shape1</code> against <code>shape2</code>.
	 * Each shape is either a convex hull or a circle (AABB or box is considered a polygon).
	 * If a collision is observed, the method will return a repulsion vector for the first
	 * shape to not collide with the second shape.  If no collision is determined, the
	 * repulsion vector will be {@link Vector2D#ZERO}.
	 * <p/>
	 * The resulting tests used by this component can be found at:<br/>
	 * http://rocketmandevelopment.com/2010/05/19/separation-of-axis-theorem-for-collision-detection/
	 *  
	 * @param shape1 {ConvexHull}
	 * @param shape2 {ConvexHull}
	 * @return {Vector2D}
	 */
	test: function(shape1, shape2) {
		Assert(shape1 != null && shape2 != null, "ConvexColliderComponent failed with: Object has no collision hull!");
			
		if (shape1.getType() == ConvexHull.CONVEX_CIRCLE &&
			 shape2.getType() == ConvexHull.CONVEX_CIRCLE) {
			// Perform circle-circle test if both shapes are circles
			return ConvexColliderComponent.ccTest(shape1, shape2);	 	
		} else if (shape1.getType() != ConvexHull.CONVEX_CIRCLE &&
					  shape2.getType() != ConvexHull.CONVEX_CIRCLE) {
			// Perform polygon test if both shapes are NOT circles
			return ConvexColliderComponent.ppTest(shape1, shape2);			  	
		} else {
			// One shape is a circle, the other is an polygon, do that test
			return ConvexColliderComponent.cpTest(shape1, shape2);
		}		
	},
	
	/**
	 * Circle-circle test
	 * @private
	 */
	ccTest: function(shape1, shape2) {
		var tRad = shape1.getRadius() + shape2.getRadius();
		var c1 = shape1.getCenter();
		var c2 = shape2.getCenter();
		var distSqr = (c1.x - c2.x) * (c1.x - c2.x) +
						  (c1.y - c2.y) * (c1.y - c2.y);
		if (distSqr < tRad * tRad) {
			// Collision, how much to separate shape1 from shape2
			var diff = tRad - Math.sqrt(distSqr);

			// If we got here, there is a collision
			var sep = Vector2D.create((c2.x - c1.x)*diff, (c2.y - c1.y)*diff);
			var cData = CollisionData.create(sep.len(),
														Vector2D.create(c2.x - c1.x, c2.y - c1.y).normalize(),
														shape1,
														shape2,
														sep);
			
			// Return the collision data
			return cData;
		}
		
		// No collision
		return null;	
	},
	
	/**
	 * Poly-poly test
	 * @private
	 */
	ppTest: function(shape1, shape2) {
		var test1, test2, testNum, min1, min2, max1, max2, offset, temp;
		var axis = Vector2D.create(0,0);
		var vectorOffset = Vector2D.create(0,0);
		var vectors1 = shape1.getVertexes();		// This time we want transformed verts
		var vectors2 = shape2.getVertexes();
		var shortestDistance = 0x7FFFFFF;
		var unitVec = null;
		var overlap = 0;
		
		if (vectors1.length == 2) {
			// Pad to fix the test
			temp = Vector2D.create(-(vectors1[1].y - vectors1[0].y),
											vectors1[1].x - vectors1[0].x);
			vectors1.push(vectors1[1].add(temp));
			temp.destroy();
		}
		if (vectors2.length == 2) {
			temp = Vector2D.create(-(vectors2[1].y - vectors2[0].y),
											vectors2[1].x - vectors2[0].x);
			vectors2.push(vectors2[1].add(temp));
			temp.destroy();
		}
		
		// Find vertical offset
		var sc1 = shape1.getCenter();
		var sc2 = shape2.getCenter();
		vectorOffset.set(sc1.x - sc2.x, sc1.y - sc2.y);
		
		// Loop to begin projection
		for (var i = 0; i < vectors1.length; i++) {
			ConvexColliderComponent.findNormalAxis(axis, vectors1, i);
			
			// project polygon 1
			min1 = axis.dot(vectors1[0]);
			max1 = min1;	// Set max and min equal
			
			var j;
			for (j = 1; j < vectors1.length; j++) {
				testNum = axis.dot(vectors1[j]);	// Project each point
				if (testNum < min1) min1 = testNum;	// Test for new smallest
				if (testNum > max1) max1 = testNum;	// Test for new largest
			}
			
			// project polygon 2
			min2 = axis.dot(vectors2[0]);
			max2 = min2;	// Set 2's max and min
			
			for (j = 1; j < vectors2.length; j++) {
				testNum = axis.dot(vectors2[j]);	// Project the point
				if (testNum < min2) min2 = testNum;	// Test for new min
				if (testNum > max2) max2 = testNum; // Test for new max
			}
			
			// Test if they are touching
			test1 = min1 - max2;	// Test min1 and max2
			test2 = min2 - max1; // Test min2 and max1
			
			// Test for a gap
			if (test1 > 0 || test2 > 0) {
				// Clean up before returning
				axis.destroy();
				vectorOffset.destroy();
				// If either is greater than zero, there is a gap
				return null;
			}
			
			var dist = -(max2 - min1);
			var aDist = Math.abs(dist);
			if(aDist < shortestDistance) {
				unitVec = axis;
				overlap = dist;
				shortestDistance = aDist;
			}
		}
		
		// If you're here, there is a collision
		var cData = CollisionData.create(overlap,
													unitVec,
													shape1,
													shape2,
													Vector2D.create(unitVec.x * overlap, unitVec.y * overlap));
		
		// Clean up before returning
		vectorOffset.destroy();
		
		// Return the collision data
		return cData;	
	},
	
	/**
	 * @private
	 */
	findNormalAxis: function(axis, vertices, index) {
		var vector1 = vertices[index];
		var vector2 = (index >= vertices.length - 1) ? vertices[0] : vertices[index + 1];
		axis.set(-(vector2.y - vector1.y), vector2.x - vector1.x);
		axis.normalize();
	},
	
	/**
	 * Circle-poly test
	 * @private
	 */
	cpTest: function(shape1, shape2) {
		var test1, test2, test, min1, max1, min2, max2, offset, distance;
		var vectorOffset = Vector2D.create(0,0);
		var vectors, center, radius, poly;
		var testDistance = 0x7FFFFFFF;
		var shortestDistance = 0x7FFFFFFF;
		var closestVertex = Vector2D.create(0,0);
		var normalAxis = Vector2D.create(0,0);
		var unitVec = null;
		var overlap = 0;
		
		// Determine which shape is the circle and which is the polygon
 		// We don't want the transformed vertexes here, we transform them later
 		if (shape1.getType() != ConvexHull.CONVEX_CIRCLE) {
			vectors = shape1.getUntransformedVertexes();
			poly = shape1.getCenter();
			center = shape2.getCenter();
			radius = shape2.getRadius();
		} else {
			vectors = shape2.getUntransformedVertexes();
			poly = shape2.getCenter();
			center = shape1.getCenter();
			radius = shape1.getRadius();
		}
		
		// Find offset
		var pC = poly;
		var cC = center;
		vectorOffset.set(pC.x - cC.x, pC.y - cC.y);
		
		if (vectors.length == 2) {
			// Pad to fix the test
			temp = Vector2D.create(-(vectors[1].y - vectors[0].y),
											vectors[1].x - vectors[0].x);
			vectors.push(vectors[1].add(temp));
			temp.destroy();
		}
		
		// Find the closest vertex to use to find normal
		var i,j;
		for (i = 0; i < vectors.length; i++) {
			// These points have been transformed
			distance = (cC.x - (pC.x + vectors[i].x)) * (cC.x - (pC.x + vectors[i].x)) +
						  (cC.y - (pC.y + vectors[i].y)) * (cC.y - (pC.y + vectors[i].y));
			if (distance < testDistance) {
				// Closest has the lowest distance
				testDistance = distance;
				closestVertex.set(pC.x + vectors[i].x, pC.y + vectors[i].y);
			}
		}
		
		// Get the normal vector from the poly to the circle
		normalAxis.set(closestVertex.x - cC.x, closestVertex.y - cC.y);
		normalAxis.normalize();	// set length to 1
		
		// We'll remember this so that we can use it in the collision data
		unitVec = Vector2D.create(normalAxis);
		
		// Project the polygon's points against the circle
		min1 = normalAxis.dot(vectors[0]);
		max1 = min1;
		
		for (j = 1; j < vectors.length; j++) {
			test = normalAxis.dot(vectors[j]);
			if (test < min1) min1 = test;
			if (test > max1) max1 = test;
		}
		
		// Project the circle
		max2 = radius;
		min2 = -radius;
		
		// Offset the polygon's max/min
		offset = normalAxis.dot(vectorOffset);
		min1 += offset;
		max1 += offset;
		
		// First test
		test1 = min1 - max2;
		test2 = min2 - max1;
		
		if (test1 > 0 || test2 > 0) {
			// Clean up before returning
			unitVec.destroy();
			normalAxis.destroy();
			vectorOffset.destroy();
			closestVertex.destroy();
			
			// Not colliding
			return null;
		}

		// Now project the circle against the polygon
		for (i = 0; i < vectors.length; i++) {
			ConvexColliderComponent.findNormalAxis(normalAxis, vectors, i);
			min1 = normalAxis.dot(vectors[0]);
			max1 = min1;
			
			for (j = 1; j < vectors.length; j++) {
				test = normalAxis.dot(vectors[j]);
				if (test < min1) min1 = test;
				if (test > max1) max1 = test;
			}
			
			// Project the circle
			max2 = radius;
			min2 = -radius;
			
			// offset points
			offset = normalAxis.dot(vectorOffset);
			min1 += offset;
			max1 += offset;
			
			// Second Test
			test1 = min1 - max2;
			test2 = min2 - max1;

			if (test1 > 0 || test2 > 0) {
				// Clean up before returning
				unitVec.destroy();
				normalAxis.destroy();
				vectorOffset.destroy();
				closestVertex.destroy();
				
				// Not colliding
				return null;	
			}
		}
		
		// The overlap is the nearest poly point to the center of the circle, minus the radius
		var c = Vector2D.create(center);
		overlap = c.sub(closestVertex).len();
		overlap -= radius;
		
		// If we got here, there is a collision
		var cData = CollisionData.create(overlap,
													unitVec,
													shape1,
													shape2,
													Vector2D.create(unitVec.x * overlap,
																		 unitVec.y * overlap));

		// Clean up before returning
		c.destroy();
		vectorOffset.destroy();
		closestVertex.destroy();
		
		// Return the collision data
		return cData;
	}
});

return ConvexColliderComponent;

});
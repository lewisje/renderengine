/**
 * The Render Engine
 * SATColliderComponent
 *
 * @fileoverview A collision component which determines collisions via
 *               the Separating Axis Theorem.
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

Engine.initObject("SATColliderComponent", "ColliderComponent", function() {

/**
 * @class An extension of the {@link ColliderComponent} which will check the
 *        object's bounding boxes for collision using the Separating Axis Theorm (SAT).
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends ColliderComponent
 * @constructor
 * @description Creates a collider component for SAT collision testing.  Each object's
 *              collision will be determined using its {@link Object2D#getCollisionHull}.
 */
var SATColliderComponent = ColliderComponent.extend(/** @scope SATColliderComponent.prototype */{

	impulseVector: null,
	
	constructor: function(name, collisionModel, priority) {
		this.base(name, collisionModel, priority);
		this.impulseVector = Vector2D.create(0,0);
	},
	
	destroy: function() {
		this.impulseVector.destroy();
		this.base();
	},
	
	release: function() {
		this.base();
		this.impulseVector = null;
	},

   /**
    * Call the host object's <tt>onCollide()</tt> method, passing the time of the collision,
    * the potential collision object, and the host and target masks.  The return value should 
    * either tell the collision tests to continue or stop.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @param hostMask {Number} The collision mask for the host object
    * @param targetMask {Number} The collision mask for <tt>collisionObj</tt>
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj, hostMask, targetMask) {
		var vect = SATColliderComponent.test(this.getHostObject().getCollisionHull(), 
			collisionObj.getCollisionHull());
		
		this.impulseVector.set(vect);
		vect.destroy();
			
      if (!this.impulseVector.isZero()) {
         return this.base(time, collisionObj, hostMask, targetMask);
      }
      
      return ColliderComponent.CONTINUE;
   },
	
	/**
	 * Returns the computed impulse vector to keep the two objects separate along
	 * the shortest vector.
	 * @return {Vector2D}
	 */
	getImpulseVector: function() {
		return this.impulseVector;
	}

}, { /** @scope SATColliderComponent.prototype */

   /**
    * Get the class name of this object
    * @return {String} "SATColliderComponent"
    */
   getClassName: function() {
      return "SATColliderComponent";
   },
	
	/**
	 * Performs the SAT collision test for <code>shape1</code> against <code>shape2</code>.
	 * Each shape is either a convex hull or a circle (AABB or box is considered a polygon).
	 * If a collision is observed, the method will return a repulsion vector for the first
	 * shape to not collide with the second shape.  If no collision is determined, the
	 * repulsion vector will be {@link Vector2D#ZERO}.
	 * <p/>
	 * The resulting tests used by this method can be found at:<br/>
	 * http://rocketmandevelopment.com/2010/05/19/separation-of-axis-theorem-for-collision-detection/
	 *  
	 * @param shape1 {ConvexHull}
	 * @param shape2 {ConvexHull}
	 * @return {Vector2D}
	 */
	test: function(shape1, shape2) {
		if (shape1.getType() == ConvexHull.CONVEX_CIRCLE &&
			 shape2.getType() == ConvexHull.CONVEX_CIRCLE) {
			// Perform circle-circle test if both shapes are circles
			return SATColliderComponent.ccTest(shape1, shape2);	 	
		} else if (shape1.getType() != ConvexHull.CONVEX_CIRCLE &&
					  shape2.getType() != ConvexHull.CONVEX_CIRCLE) {
			// Perform n-gon test if both shapes are NOT circles
			return SATColliderComponent.ngonTest(shape1, shape2);			  	
		} else {
			// One shape is a circle, the other is an n-gon, do that test
			return SATColliderComponent.cnTest(shape1, shape2);
		}		
	},
	
	/**
	 * Circle-circle test
	 * @param shape1 {ConvexHull}
	 * @param shape2 {ConvexHull}
	 * @return {Vector2D}
	 * @private
	 */
	ccTest: function(shape1, shape2) {
		var tRad = shape1.getRadius() + shape2.getRadius();
		var c1 = shape1.getCenter().get();
		var c2 = shape2.getCenter().get();
		var distSqr = (c1.x - c2.x) * (c1.x - c2.x) +
						  (c1.y - c2.y) * (c1.y - c2.y);
		if (distSqr < tRad * tRad) {
			// Collision, how much to separate shape1 from shape2
			var diff = tRad - Math.sqrt(distSqr);
			return Vector2D.create((c2.x - c1.x)*diff, (c2.y - c1.y)*diff);
		}
		
		// No collision
		return Vector2D.ZERO;	
	},
	
	/**
	 * Poly-poly test
	 * @param shape1 {ConvexHull}
	 * @param shape2 {ConvexHull}
	 * @return {Vector2D}
	 * @private
	 */
	ngonTest: function(shape1, shape2) {
		var test1, test2, testNum, min1, min2, max1, max2, offset, temp;
		var axis = Vector2D.create(0,0);
		var vectorOffset = Vector2D.create(0,0);
		var faces1 = shape1.getFaces();
		var faces2 = shape2.getFaces();
		if (faces1.length == 2) {
			// Pad to fix the test
			temp = Vector2D.create(-(faces1[1].y - faces1[0].y),
											faces1[1].x - faces1[0].x);
			faces1.push(faces1[1].add(temp));
			temp.destroy();
		}
		if (faces2.length == 2) {
			temp = Vector2D.create(-(faces2[1].y - faces2[0].y),
											faces2[1].x - faces2[0].x);
			faces2.push(faces2[1].add(temp));
			temp.destroy();
		}
		
		// Find vertical offset
		var sc1 = shape1.getCenter().get();
		var sc2 = shape2.getCenter().get();
		vectorOffset.set(sc1.x - sc2.x, sc1.y - sc2.y);
		
		// Loop to begin projection
		for (var i = 0; i < faces1.length; i++) {
			axis.set(shape1.getNormals()[i]);
			
			// project polygon 1
			min1 = axis.dot(faces1[0]);
			max1 = min1;	// Set max and min equal
			
			var j;
			for (j = 1; j < faces1.length; j++) {
				testNum = axis.dot(faces1[j]);	// Project each point
				if (testNum < min1) min1 = testNum;	// Test for new smallest
				if (testNum > max1) max1 = testNum;	// Test for new largest
			}
			
			// project polygon 2
			min2 = axis.dot(faces2[0]);
			max2 = min2;	// Set 2's max and min
			
			for (j = 1; j < faces2.length; j++) {
				testNum = axis.dot(faces2[j]);	// Project the point
				if (testNum < min2) min2 = testNum;	// Test for new min
				if (testNum > max2) max2 = testNum; // Test for new max
			}
			
			// Apply the offset to each max/min(no need for each point, max and
			// min are all that matter)
			offset = axis.dot(vectorOffset);	// Calculate offset
			min1 += offset;	// Apply offset
			max1 += offset;	// ""
			
			// Test if they are touching
			test1 = min1 - max2;	// Test min1 and max2
			test2 = min2 - max1; // Test min2 and max1
			
			if (test1 > 0 || test2 > 0) {
				// Clean up before returning
				axis.destroy();
				vectorOffset.destroy();

				// If either is greater than zero, there is a gap
				return Vector2D.ZERO;
			}
		}
		
		// If you're here, there is a collision
		var a = axis.get();
		
		// Clean up before returning
		axis.destroy();
		vectorOffset.destroy();
		
		// Return the repulsion vector for shape 1
		return Vector2D.create(a.x*((max2-min1) * -1), a.y*((max2-min1) * -1));	
	},
	
	/**
	 * @private
	 */
	findNormalAxis: function(vertices, index) {
		var vector1 = vertices[index];
		var vector2 = (index >= vertices.length - 1) ? vertices[0] : vertices[index + 1];
		var normalAxis = Vector2D.create(-(vector2.y - vector1.y), vector2.x - vector1.x);
		normalAxis.normalize();
		return normalAxis;
	},
	
	/**
	 * Circle-poly test
	 * @param shape1 {ConvexHull}
	 * @param shape2 {ConvexHull}
	 * @return {Vector2D}
	 * @private
	 */
	cnTest: function(shape1, shape2) {
		var test1, test2, test, min1, max1, min2, max2, offset, distance;
		var vectorOffset = Vector2D.create(0,0);
		var faces, center, radius, poly;
		var testDistance = 0x7FFFFFFF;
		var closestVector = Vector2D.create(0,0);
		
		// Determine which shape is the circle and which is the polygon
		if (shape1.getType() != ConvexHull.CONVEX_CIRCLE) {
			faces = shape1.getFaces();
			poly = shape1.getCenter();
			center = shape2.getCenter();
			radius = shape2.getRadius();
		} else {
			faces = shape2.getFaces();
			poly = shape2.getCenter();
			center = shape1.getCenter();
			radius = shape1.getRadius();
		}
		
		// Find offset
		var pC = poly.get();
		var cC = center.get();
		vectorOffset.set(pC.x - cC.x, pC.y - cC.y);
		
		if (faces.length == 2) {
			// Pad to fix the test
			temp = Vector2D.create(-(faces[1].y - faces[0].y),
											faces[1].x - faces[0].x);
			faces.push(faces[1].add(temp));
			temp.destroy();
		}
		
		// Find the closest vertex to use to find normal
		var i,j;
		for (i = 0; i < faces.length; i++) {
			distance = (cC.x - (pC.x + faces[i].x)) * (cC.x - (pC.x + faces[i].x)) +
						  (cC.y - (pC.y + faces[i].y)) * (cC.y - (pC.y + faces[i].y));
			if (distance < testDistance) {
				// Closes has the lowest distance
				testDistance = distance;
				closestVector.set(pC.x + faces[i].x, pC.y + faces[i].y);
			}
		}
		
		// Get the normal vector
		normalAxis.set(closestVector.x - cC.x, closestVector.y - cC.y);
		normalAxis.normalize();	// set length to 1
		
		// Project the polygon's points
		min1 = normalAxis.dot(faces[0]);
		max1 = min1;
		
		for (j = 1; j < faces.length; j++) {
			test = normalAxis.dot(faces[j]);
			if (test < min1) min1 = test;
			if (test > max1) max1 = test;
		}
		
		// Project the circle
		max2 = radius;
		min2 = -radius;
		
		// Offset the polygon's max/min
		offset = normalAxis.dot(vectorOffset);
		min1 += offset;
		max1 += offsetl
		
		if (test1 > 0 || test2 > 0) {
			// Clean up before returning
			vectorOffset.destroy();
			closestVector.destroy();
			return Vector2D.ZERO;
		}
		
		for (i = 0; i < faces.length; i++) {
			var normalAxis = SATColliderComponent.findNormalAxis(faces, i);
			min1 = normalAxis.dot(faces[0]);
			max1 = min1;
			
			for (j = 1; j < faces.length; j++) {
				test = normalAxis.dot(faces[j]);
				if (test < min1) min1 = test;
				if (test > max1) max1 = test;
			}
			
			max2 = radius;
			min2 = -radius;
			
			// offset points
			offset = normalAxis.dot(vectorOffset);
			min1 += offset;
			max1 += offset;
			
			// Do the test, again
			test1 = min1 - max2;
			test2 = min2 - max1;
			
			if (test1 > 0 || test2 > 0) {
				// Clean up before returning
				vectorOffset.destroy();
				closestVector.destroy();
				normalAxis.destroy();
				return Vector2D.ZERO;	
			}
		}	
		
		// If we got here, there is a collision
		var nA = normalAxis.get();

		// Clean up before returning		
		vectorOffset.destroy();
		closestVector.destroy();
		normalAxis.destroy();
		
		return Vector2D.create(nA.x * (max2 - min1) * -1, nA.y * (max2 - min1) * -1);
	}
});

return SATColliderComponent;

});
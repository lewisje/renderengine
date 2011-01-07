/**
 * The Render Engine
 * Vector2D
 *
 * @fileoverview A Vector2D class
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.math.Vector2D",
	"requires": [
		"R.math.Point2D",
		"R.math.Math2D"
	]
});

/**
 * @class A 2D vector class with helpful manipulation methods.
 * 
 * @param x {Point2D|Number} If this arg is a Vector2D, its values will be
 *                           copied into the new vector.  If a number,
 *                           the X length of the vector.
 * @param y {Number} The Y length of the vector.  Only required if X
 *                   was a number.
 * @constructor
 * @description Create a new 2D Vector
 * @extends R.math.Point2D
 */
R.math.Vector2D = function(){
	return R.math.Point2D.extend(/** @scope R.math.Vector2D.prototype */{
	
		/**
		 * @private
		 */
		constructor: function(x, y){
			this.base(x, y);
		},
		
		/**
		 * A mutator method that normalizes this vector, returning a unit length vector.
		 * @return {Vector2D} This vector, normalized
		 * @see #len
		 */
		normalize: function(){
			this._vec = this._vec.toUnitVector();
			return this;
		},
		
		/**
		 * Get the magnitude/length of this vector.
		 *
		 * @return {Number} A value representing the length (magnitude) of the vector.
		 */
		len: function(){
			return this._vec.modulus();
		},
		
		/**
		 * Get the dot product of this vector and another.
		 * @param vector {Vector2D} The Point to perform the operation against.
		 * @return {Number} The dot product
		 */
		dot: function(vector){
			return this._vec.dot(vector._vec);
		},
		
		/**
		 * A mutator method that gets the cross product of this vector and another.
		 * @param vector {Vector2D} The vector to perform the operation against.
		 * @return {Vector2D} This vector
		 */
		cross: function(vector){
			this._vec = this._vec.cross(vector._vec);
			return this;
		},
		
		/**
		 * Returns the angle (in degrees) between two vectors.  This assumes that the
		 * point is being used to represent a vector, and that the supplied point
		 * is also a vector.
		 *
		 * @param vector {Vector2D} The vector to perform the angular determination against
		 * @return {Number} The angle between two vectors, in degrees
		 */
		angleBetween: function(vector){
			return R.math.Math2D.radToDeg(this._vec.angleFrom(vector._vec));
		},
		
		/**
		 * Returns <tt>true</tt> if this vector is parallel to <tt>vector</tt>.
		 * @param vector {Vector2D} The vector to compare against
		 * @return {Boolean}
		 */
		isParallelTo: function(vector){
			return this._vec.isParallelTo(vector._vec);
		},
		
		/**
		 * Returns <tt>true</tt> if this vector is anti-parallel to <tt>vector</tt>.
		 * @param vector {Vector2D} The vector to compare against
		 * @return {Boolean}
		 */
		isAntiparallelTo: function(vector){
			return this._vec.isAntiparallelTo(vector._vec);
		},
		
		/**
		 * Returns <tt>true</tt> if this vector is perpendicular to <tt>vector</tt>.
		 * @param vector {Vector2D} The vector to compare against
		 * @return {Boolean}
		 */
		isPerpendicularTo: function(vector){
			return this._vec.isPependicularTo(vector._vec);
		},
		
		/**
		 * Mutator method that modifies the vector rotated <tt>angle</tt> degrees about
		 * the vector defined by <tt>axis</tt>.
		 *
		 * @param angle {Number} The rotation angle in degrees
		 * @param axis {Vector2D} The axis to rotate about
		 * @return {Vector2D} This vector
		 */
		rotate: function(angle, axis){
			this._vec = this._vec.rotate(R.math.Math2D.degToRad(angle), axis);
			return this;
		},
		
		/**
		 * Project this vector onto <tt>vector</tt>.
		 *
		 * @param vector {Vector2D} The vector to project onto
		 * @return {Vector2D}
		 */
		projectOnto: function(vector){
			var proj = R.math.Vector2D.create(0, 0);
			var v = vector;
			var dp = this.dot(vector);
			proj.set((dp / (v.x * v.x + v.y * v.y)) * v.x, (dp / (v.x * v.x + v.y * v.y)) * v.y);
			return proj;
		},
		
		/**
		 * Get the right-hand normal of this vector.  The left-hand
		 * normal would simply be <tt>this.rightNormal().neg()</tt>.
		 * @return {Vector2D}
		 */
		rightNormal: function(){
			return R.math.Vector2D.create(-this.y, this.x).normalize();
		},
		
		/**
		 * Get the per-product of this vector and <tt>vector</tt>.
		 * @param vector {Vector2D} The other vector
		 * @return {Number}
		 */
		perProduct: function(vector){
			return this.dot(vector.rightNormal());
		}
		
	}, { /** @scope R.math.Vector2D.prototype */
		/**
		 * Return the classname of the this object
		 * @return {String} "R.math.Vector2D"
		 */
		getClassName: function(){
			return "R.math.Vector2D";
		},

		resolved: function() {
			R.math.Vector2D.ZERO = R.math.Vector2D.create(0, 0);
			R.math.Vector2D.UP = R.math.Vector2D.create(0, -1);
			R.math.Vector2D.LEFT = R.math.Vector2D.create(-1, 0);
		},

		/**
		 * The "zero" vector. This vector should not be modified.
		 * @type {R.math.Vector2D}
		 * @memberOf R.math.Vector2D
		 */
		ZERO:	null,

		/**
		 * The "up" vector. This vector should not be modified.
		 * @type {R.math.Vector2D}
		 * @memberOf R.math.Vector2D
		 */
		UP: null,

		/**
		 * The "left" vector. This vector should not be modified.
		 * @type {R.math.Vector2D}
		 * @memberOf R.math.Vector2D
		 */
		LEFT: null 	
	});
	
}
/**
 * The Render Engine
 * Circle2D
 *
 * @fileoverview A Circle2D class
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
	"class": "R.math.Circle2D",
	"requires": [
		"R.math.PooledMathObject",
		"R.math.Point2D",
		"R.math.Math2D"
	]
});

/**
 * @class A 2D circle class with helpful manipulation methods.
 * @extends PooledMathObject
 */
R.math.Circle2D = function(){
	return R.math.PooledMathObject.extend(/** @scope R.math.Circle2D.prototype */{
	
		center: null,
		radius: 0,
		
		/**
		 * Create a circle object specifying the X and Y center position and
		 * the radius.
		 *
		 * @param x {Number} The center X coordinate
		 * @param y {Number} The center Y coordinate
		 * @param radius {Number} The radius of the circle
		 */
		constructor: function(x, y, radius){
			this.center = R.math.Point2D.create(0, 0);
			this.radius = 0;
			this.set(x, y, radius);
		},
		
		destroy: function(){
			this.center.destroy();
			this.base();
		},
		
		release: function(){
			this.base();
			this.center = null;
			this.radius = 0;
		},
		
		/**
		 * Set the values of this circle.
		 *
		 * @param x {Number|Point2D|Circle2D} An optional value to initialize the X coordinate of the circle
		 * @param y {Number} An optional value to initialize the Y coordinate of the circle
		 * @param radius {Number} An optional value to initialize the radius
		 */
		set: function(x, y, radius){
			if (x instanceof R.math.Circle2D) {
				this.center.set(x.getCenter());
				this.radius = x.getRadius();
			}
			else 
				if (x instanceof R.math.Point2D) {
					this.center.set(x);
					this.radius = y;
				}
				else {
					this.center.set(x || 0, y || 0);
					this.radius = radius || 0.0;
				}
		},
		
		/**
		 * Get an object with the elements containing centerX, centerY, and radius
		 * as the elements x, y, and r.
		 *
		 * @return {Object} An object with the specified elements
		 */
		get: function(){
			var c = this.getCenter();
			return {
				x: c.x,
				y: c.y,
				r: this.getRadius()
			};
		},
		
		/**
		 * Returns <tt>true</tt> if this circle is equal to the specified circle.
		 *
		 * @param circle {Circle2D} The circle to compare to
		 * @return {Boolean} <tt>true</tt> if the two circles are equal
		 */
		equals: function(circle){
			return (this.center.equals(circle.getCenter()) && this.radius == circle.getRadius());
		},
		
		/**
		 * Offset this circle by the given amount in the X and Y axis.  The first parameter
		 * can be either a {@link Point2D}, or the value for the X axis.  If the X axis is specified,
		 * the second parameter should be the amount to offset in the Y axis.
		 *
		 * @param offsetPtOrX {Point/int} Either a {@link Point2D} which contains the offset in X and Y, or an integer
		 *                                representing the offset in the X axis.
		 * @param offsetY {int} If <code>offsetPtOrX</code> is an integer value for the offset in the X axis, this should be
		 *                      the offset along the Y axis.
		 */
		offset: function(offsetPtOrX, offsetY){
			var offs = R.math.Point2D.create(0, 0);
			if (offsetPtOrX instanceof R.math.Point2D) {
				offs.set(offsetPtOrX);
			}
			else {
				offs.set(offsetPtOrX, offsetY);
			}
			
			this.center.add(offs);
			offs.destroy();
			return this;
		},
		
		/**
		 * Get the center point of this circle.
		 * @return {Point2D} The center point
		 */
		getCenter: function(){
			return this.center;
		},
		
		/**
		 * Get the radius of this circle
		 * @return {Number} The radius
		 */
		getRadius: function(){
			return this.radius;
		},
		
		/**
		 * Determine if this circle intersects another circle.
		 *
		 * @param circle A {@link Circle2D} to compare against
		 * @return {Boolean} <tt>true</tt> if the two circles intersect.
		 */
		isIntersecting: function(circle){
			// Square root is slow...
			//var d = this.getCenter().dist(circle.getCenter());
			//return (d <= (this.getRadius() + circle.getRadius())); 
			
			// Faster
			var c1 = this.getCenter();
			var c2 = circle.getCenter();
			var dX = Math.pow(c1.x - c2.x, 2);
			var dY = Math.pow(c1.y - c2.y, 2);
			var r2 = Math.pow(this.getRadius() + circle.getRadius(), 2);
			return (dX + dY <= r2);
		},
		
		/**
		 * Determine if this circle is contained within the specified circle.
		 *
		 * @param circle {Circle} A circle to compare against
		 * @return {Boolean} <tt>true</tt> if the this circle is fully contained in the specified circle.
		 */
		isContained: function(circle){
			var d = circle.getCenter().dist(this.getCenter());
			return (d < (this.getRadius() + circle.getRadius()));
		},
		
		/**
		 * Determine if this circle contains the specified circle.
		 *
		 * @param circle {Circle} A circle to compare against
		 * @return {Boolean} <tt>true</tt> if the rectangle is fully contained within this rectangle.
		 */
		containsCircle: function(circle){
			return circle.isContained(this);
		},
		
		/**
		 * Returns <tt>true</tt> if this circle contains the specified point.
		 *
		 * @param point {Point} The point to test
		 * @return {Boolean} <tt>true</tt> if the point is within the circle
		 */
		containsPoint: function(point){
			var c1 = this.getCenter();
			var r = this.getRadius();
			return (c1.dist(point) <= r);
		},
		
		/**
		 * Returns a printable version of this object.
		 * @return {String} Formatted like "cX,cY r#"
		 */
		toString: function(){
			return this.center.toString() + " r" + Number(this.radius).toFixed(2);
		}
		
	}, { /** @scope R.math.Circle2D.prototype */
		/**
		 * Return the classname of the this object
		 * @return {String} "R.math.Circle2D"
		 */
		getClassName: function(){
			return "R.math.Circle2D";
		}
		
	});
	
}
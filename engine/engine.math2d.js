/**
 * The Render Engine
 * Math
 *
 * @fileoverview A 2D math library with static methods, plus objects to represent 
 *               points, rectangles and circles.
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

Engine.include("/engine/engine.mathprimitives.js");

Engine.initObject("Math2D", null, function() {

/**
 * @class A static class with methods and fields that are helpful
 * when dealing with two dimensional mathematics.
 *
 * @static
 */
var Math2D = Base.extend(/** @scope Math2D.prototype */{

   constructor: null,

   /**
    * An approximation of PI for speedier calculations.  (3.14159)
    * @type {Number}
    * @const
    */
   PI: 3.14159,

   /**
    * An approximation of the inverse of PI so we can
    * avoid divisions. (0.31831)
    * @type {Number}
    * @const
    */
   INV_PI: 0.31831,

   /**
    * Convert degrees to radians.
    * @param degrees {Number} An angle in degrees
    * @return {Number} The degrees value converted to radians
    */
   degToRad: function(degrees) {
      return (0.01745 * degrees);
   },

   /**
    * Convert radians to degrees.
    * @param radians {Number} An angle in radians
    * @return {Number} The radians value converted to degrees
    */
   radToDeg: function(radians) {
      return (radians * 180 / Math2D.PI);
   },

   /**
    * Perform AAB (axis-aligned box) to AAB collision testing, returning <tt>true</tt>
    * if the two boxes overlap.
    *
    * @param box1 {Rectangle2D} The collision box of object 1
    * @param box2 {Rectangle2D} The collision box of object 2
    * @return {Boolean} <tt>true</tt> if the rectangles overlap
    */
   boxBoxCollision: function(box1, box2) {
      return box1.isIntersecting(box2);
   },

   /**
    * Perform point to AAB collision, returning <code>true</code>
    * if a collision occurs.
    *
    * @param box {Rectangle2D} The collision box of the object
    * @param point {Point2D} The point to test, in world coordinates
    * @return {Boolean} <tt>true</tt> if the point is within the rectangle
    */
   boxPointCollision: function(box, point) {
      return box.containsPoint(point);
   },

   /**
    * Check to see if a line intersects another
    *
    * @param p1 {Point2D} Start of line 1
    * @param p2 {Point2D} End of line 1
    * @param p3 {Point2D} Start of line 2
    * @param p4 {Point2D} End of line 2
    * @return {Boolean} <tt>true</tt> if the lines intersect
    */
   lineLineCollision: function(p1, p2, p3, p4) {
      var d = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y));
      var n1 = ((p4.x - p3.x) * (p1.y - p3.y)) - ((p4.y - p3.y) * (p1.x - p3.x));
      var n2 = ((p2.x - p1.x) * (p1.y - p3.y)) - ((p2.y - p1.y) * (p1.x - p3.x));

      if ( d == 0.0 )
      {
         if ( n1 == 0.0 && n2 == 0.0 )
         {
            return false;  //COINCIDENT;
         }
         return false;   // PARALLEL;
      }
      var ua = n1 / d;
      var ub = n2 / d;

      return (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0);
   },

   /**
    * Test to see if a line intersects a Rectangle.
    *
    * @param p1 {Point2D} The start of the line
    * @param p2 {Point2D} The end of the line
    * @param rect {Rectangle} The box to test against
    * @return {Boolean} <tt>true</tt> if the line intersects the box
    */
   lineBoxCollision: function(p1, p2, rect) {
      // Convert the line to a box itself and do a quick box box test
      var lRect = Rectangle2D.create(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
		var coll = Math2D.boxBoxCollision(lRect, rect);
		lRect.destroy();
		return coll;
   },

   /*
    * Test to see if a line intersects a Rectangle.
    *
    * @param p1 {Point2D} The start of the line
    * @param p2 {Point2D} The end of the line
    * @param rect {Rectangle} The box to test against
    * @return <tt>true</tt> if the line intersects the box
    * @type Boolean
   lineBoxCollision: function(p1, p2, rect)
   {
      if (Math2D.boxPointCollision(rect, p1) &&
          Math2D.boxPointCollision(rect, p2))
      {
         // line inside
         return true;
      }

      // check each line for intersection
      var topLeft = rect.getTopLeft();
      var bottomRight = rect.getBottomRight();
      var topRight = new Point2D(rect.x, rect.y).add(new Point2D(rect.width, 0));
      var bottomLeft = new Point2D(rect.x, rect.y).add(new Point2D(0, rect.height));

      if (Math2D.lineLineCollision(p1, p2, topLeft, topRight)) return true;
      if (Math2D.lineLineCollision(p1, p2, topRight, bottomRight)) return true;
      if (Math2D.lineLineCollision(p1, p2, bottomRight, bottomLeft)) return true;
      if (Math2D.lineLineCollision(p1, p2, bottomLeft, topLeft)) return true;

      return false;
   },
    */

   /**
    * A static method used to calculate a direction vector
    * from a heading angle.
    *
    * @param origin {Point2D} The origin of the shape
    * @param baseVec {Vector2D} The base vector
    * @param angle {Number} The rotation in degrees
    * @return {Vector2D} The direction vector
    */
   getDirectionVector: function(origin, baseVec, angle) {
      var r = Math2D.degToRad(angle);

      var x = Math.cos(r) * baseVec.x - Math.sin(r) * baseVec.y;
      var y = Math.sin(r) * baseVec.x + Math.cos(r) * baseVec.y;

      var v = Vector2D.create(x, y).sub(origin);
      return v.normalize();
   },

   /**
    * Given a {@link Rectangle2D}, generate a random point within it.
    *
    * @param rect {Rectangle2D} The rectangle
    * @return {Point2D} A random point within the rectangle
    */
   randomPoint: function(rect) {
      var r = rect.get();
      return Point2D.create(Math.floor(r.x + Math2.random() * r.w),
                            Math.floor(r.y + Math2.random() * r.h));
   },
	
	/**
	 * Calculate an approximate 2D convex hull for the given array of points.
	 * <p/>
	 * Copyright 2001, softSurfer (www.softsurfer.com)
	 * This code may be freely used and modified for any purpose
	 * providing that this copyright notice is included with it.
	 * SoftSurfer makes no warranty for this code, and cannot be held
	 * liable for any real or imagined damage resulting from its use.
	 * Users of this code must verify correctness for their application.
	 * 
	 * @param points {Array} An array of {@link Point2D} instances
	 * @param k {Number} The approximation accuracy (larger = more accurate)
	 * @return {Array} An array of {@link Point2D} which contains the 
	 * 	approximate hull of the given points
	 */ 
	convexHull: function(points, k) {
		// Tests if a point is Left|On|Right of an infinite line.
		function isLeft(point0, point1, point2) {
			var p0 = point0.get(), p1 = point1.get(), p2 = point2.get(); 
			return (p1.x - p0.x)*(p2.y - p0.y) - (p2.x - p0.x)*(p1.y - p0.y);
		}
		
		var Bin = Base.extend({
			B: null,
			constructor: function(size) {
				this.B = [];
				for (var i = 0; i < size; i++) {
					this.B.push({
						min: 0,
						max: 0
					});
				}
			}
		});
		
		var NONE = -1;
		var minmin=0, minmax=0,
			 maxmin=0, maxmax=0,
			 xmin = points[0].get().x,  xmax = points[0].get().x,
			 cP, bot=0, top=(-1), n = points.length,  // indices for bottom and top of the stack
	 		 hull = [];
			 
		// Get the points with (1) min-max x-coord, and (2) min-max y-coord
		for ( i=1; i < n; i++) {
			cP = points[i].get();
			if (cP.x <= xmin) {
				if (cP.x < xmin) {        // new xmin
					xmin = cP.x;
					minmin = minmax = i;
				} else {                      // another xmin
					if (cP.y < points[minmin].get().y)
						minmin = i;
					else if (cP.y > points[minmax].get().y)
						minmax = i;
				}
			}
			
			if (cP.x >= xmax) {
				if (cP.x > xmax) {        // new xmax
					xmax = cP.x;
					maxmin = maxmax = i;
				} else {                      // another xmax
					if (cP.y < points[maxmin].get().y)
						maxmin = i;
					else if (cP.y > points[maxmax].get().y)
						maxmax = i;
				}
			}
		}
		
		if (xmin == xmax) {      // degenerate case: all x-coords == xmin
			hull[++top] = points[minmin];           // a point, or
			if (minmax != minmin)           // a nontrivial segment
				hull[++top] = points[minmax];
			return hull;                   // one or two points
		}
		
		// Next, get the max and min points in the k range bins
		var bin = new Bin(k+2);   // first allocate the bins
		bin.B[0].min = minmin;         bin.B[0].max = minmax;        // set bin 0
		bin.B[k+1].min = maxmin;       bin.B[k+1].max = maxmax;      // set bin k+1
		for (var b = 1; b <= k; b++) { // initially nothing is in the other bins
			bin.B[b].min = bin.B[b].max = NONE;
		}
		
		for (var b, i=0; i < n; i++) {
			var cPP = points[i]; 
			cP = cPP.get();
			if (cP.x == xmin || cP.x == xmax) // already have bins 0 and k+1 
				continue;
			
			// check if a lower or upper point
			if (isLeft(points[minmin], points[maxmin], cPP) < 0) {  // below lower line
				b = (k * (cP.x - xmin) / (xmax - xmin) ) + 1;  // bin #
				if (bin.B[b].min == NONE)       // no min point in this range
					bin.B[b].min = i;           // first min
				else if (cP.y < points[bin.B[b].min].get().y)
					bin.B[b].min = i;           // new min
				continue;
			}
			
			if (isLeft(points[minmax], points[maxmax], cPP) > 0) {  // above upper line
				b = (k * (cP.x - xmin) / (xmax - xmin) ) + 1;  // bin #
				if (bin.B[b].max == NONE)       // no max point in this range
					bin.B[b].max = i;           // first max
				else if (cP.y > points[bin.B[b].max].get().y)
					bin.B[b].max = i;           // new max
				continue;
			}
		}
		
		// Now, use the chain algorithm to get the lower and upper hulls
		// the output array hull[] will be used as the stack
		// First, compute the lower hull on the stack hull[]
		for (var i = 0; i <= k+1; ++i) {
			if (bin.B[i].min == NONE)  // no min point in this range
				continue;
			
			var cPP = points[bin.B[i].min];    // select the current min point
			cP = cPP.get();

			while (top > 0) {        // there are at least 2 points on the stack
				// test if current point is left of the line at the stack top
				if (isLeft(hull[top-1], hull[top], cPP) > 0)
					break;         // cP is a new hull vertex
				else
					top--;         // pop top point off stack
			}
			hull[++top] = cPP;        // push current point onto stack
		}
		
		// Next, compute the upper hull on the stack H above the bottom hull
		if (maxmax != maxmin)      // if distinct xmax points
			hull[++top] = points[maxmax];  // push maxmax point onto stack
			
		bot = top;                 // the bottom point of the upper hull stack
		for (var i = k; i >= 0; --i) {
			if (bin.B[i].max == NONE)  // no max point in this range
				continue;
			
			var cPP = points[bin.B[i].max];   // select the current max point
			cP = cPP.get();
			
			while (top > bot) {      // at least 2 points on the upper stack
				// test if current point is left of the line at the stack top
				if (isLeft(hull[top-1], hull[top], cPP) > 0)
					break;         // current point is a new hull vertex
				else
					top--;         // pop top point off stack
			}
			hull[++top] = cPP;        // push current point onto stack
		}
		if (minmax != minmin)
			hull[++top] = points[minmin];  // push joining endpoint onto stack
		
		bin = null;                  // free bins before returning
		return hull;              // # of points on the stack
	},	
	
	/**
	 * Determine the Minkowski Difference of two convex hulls.  Useful for
	 * calculating collision response.
	 * 
	 * @param hullA {Array} An array of {@link Point2D}
	 * @param hullB {Array} An array of {@link Point2D}
	 * @return {Array} An array of {@link Point2D} which are the Minkowski Difference of
	 * 	the two hulls.
	 */
	minkDiff: function(hullA, hullB) {
		var cP = 0, minkDiff = new Array(hullA.length * hullB.length);
		for (var a in hullA) {
			for (var b in hullB) {
				var ha = hullA[a].get(), hb = hullB[b].get(),
					 pt = Point2D.create(hb.x - ha.x, hb.y - ha.y);
				minkDiff[cP++] = pt;	
			}
		}
		return minkDiff;	
	},
	
	ISOMETRIC_PROJECTION: 0, 
	DIMETRIC_SIDE_PROJECTION: 1,
	DIMETRIC_TOP_PROJECTION: 2
	
});

return Math2D;

});

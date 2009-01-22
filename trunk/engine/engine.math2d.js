/**
 * The Render Engine
 * Math2D
 *
 * @fileoverview A 2D math library with objects to represent points and rectangles
 *               plus methods to assist in manipulating them.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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
    * An approximation of PI for speedier calculations.
    * @memberOf Math2D
    */
   PI: 3.14159,

   /**
    * An approximation of the inverse of PI so we can
    * avoid divisions.
    * @memberOf Math2D
    */
   INV_PI: 0.31831,

   /**
    * Convert degrees to radians.
    * @param degrees {Number} An angle in degrees
    * @type Number
    * @memberOf Math2D
    */
   degToRad: function(degrees) {
      // ((Math.PI / 180) * deg);
      return (0.01745 * degrees);
   },

   /**
    * Convert radians to degrees.
    * @param radians {Number} An angle in radians
    * @type Number
    * @memberOf Math2D
    */
   radToDeg: function(radians) {
      // ((rad * 180) / Math.PI)
      return ((radians * 180) * Math2D.INV_PI);
   },

   /**
    * Perform AAB (axis-aligned box) to AAB collision testing, returning <tt>true</tt>
    * if the two boxes overlap.
    *
    * @param box1 {Rectangle2D} The collision box of object 1
    * @param box2 {Rectangle2D} The collision box of object 2
    * @type Boolean
    * @memberOf Math2D
    */
   boxBoxCollision: function(box1, box2) {
      return box1.isIntersecting(box2);
   },
	
	circleCircleCollision: function(circle1, circle2) {
		
	},

   /**
    * Perform point to AAB collision, returning <code>true</code>
    * if a collision occurs.
    *
    * @param box {Rectangle2D} The collision box of the object
    * @param point {Point2D} The point to test, in world coordinates
    * @type Boolean
    * @memberOf Math2D
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
    * @return <tt>true</tt> if the lines intersect
    * @type Boolean
    * @memberOf Math2D
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
    * @return <tt>true</tt> if the line intersects the box
    * @type Boolean
    * @memberOf Math2D
    */
   lineBoxCollision: function(p1, p2, rect) {
      // Convert the line to a box itself and do a quick box box test
      var lRect = Rectangle2D.create(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      return Math2D.boxBoxCollision(lRect, rect);
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
    * @param origin {Point2D} The origin of the shape
    * @param baseVec {Vector2D} The base vector
    * @param angle {Number} The rotation in degrees
    * @type Vector2D
    * @memberOf Math2D
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
      return Point2D.create(Math.floor(r.x + Math.random() * r.w),
                            Math.floor(r.y + Math.random() * r.h));
   }

});

return Math2D;

});

Engine.initObject("MathObject", null, function() {

var MathObject = Base.extend({
   constructor: function() {
   },
	
   release: function() {
   },

   /**
    * Destroy this object instance (remove it from the Engine).  The object
    * is returned to the pool of math objects so it can be used again.
    */
   destroy: function() {
      this.release();
   },
}, { /** @scope MathObject.prototype */
   poolNew: 0,

   poolSize: 0,

   /**
    * This method is used in place of a constructor.  If an object of this
    * type is available in the pool, it will be used, rather than creating
    * a new instance.  If the object is not in the pool, it will be created.
    * Upon destruction, the object will return to the pool.
    * <p/>
    * Usage: <tt>var obj = [MathObjectClass].create(arg1, arg2, arg3...);</tt>
    *
    */
   create: function() {
      return new this(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8],arguments[9]);
   },

   /**
    * During object destruction, it needs to return itself to the
    * pool so it can be used again.  Instead of creating new instances
    * of each object, we utilize a pooled object so we don't need the
    * garbage collector to be invoked for removed objects.
    * @private
    */
   returnToPool: function(obj) {
   },

   /**
    * The pool of all math objects.  Each object is stored
    * by it's classname, retrieved from <tt>getClassName()</tt>
    * that should be defined by all objects.
    * @private
    */
   objectPool: {},

	/**
	 * Return the classname of the math object
	 * @return {String}
	 */
   getClassName: function() {
      return "MathObject";
   }
});

return MathObject;

});

Engine.initObject("Point2D", "MathObject", function() {

/**
 * @class A 2D point class with helpful methods for manipulation
 */
var Point2D = MathObject.extend(/** @scope Point2D.prototype */{

   _vec: null,

   x: 0,
   y: 0,

   /**
    * Create a new 2D point.
    *
    * @param x {Point2D/Number} If this arg is a Point2D, its values will be
    *                           copied into the new point.
    * @param y {Number} The Y coordinate of the point.  Only required if X
    *                   was a number.
    */
   constructor: function(x, y) {
      this.base("Point2D");
      this.set(x, y);
   },

   release: function() {
      this.base();
      this.x = 0;
      this.y = 0;
      this._vec.setElements([0,0]);
   },

   /**
    * Private method used to update underlying object.
    * @private
    */
   upd: function() {
      this.x = this._vec.e(1); this.y = this._vec.e(2);
   },

   /**
    * Returns <tt>true</tt> if this point is equal to the specified point.
    *
    * @param point {Point2D} The point to compare to
    * @type Boolean
    */
   equals: function(point) {
      return (this.x == point.x && this.y == point.y);
   },

   /**
    * Set the position of a 2D point.
    *
    * @param x {Point2D/Number} If this arg is a Point2D, its values will be
    *                           copied into the new point.
    * @param y {Number} The Y coordinate of the point.  Only required if X
    *                   was a number.
    */
   set: function(x, y) {
      if (x instanceof Point2D)
      {
         this._vec = x._vec.dup();
      }
      else
      {
         AssertWarn((y != null), "Undefined Y value for point initialized to zero.");
         this._vec = $V([x, y || 0]);
      }
      this.upd();
      return this;
   },
   
   get: function() {
      return { x: this._vec.e(1), y: this._vec.e(2) };
   },

   /**
    * Set the X coordinate
    *
    * @param x {Number} The X coordinate
    */
   setX: function(x) {
      this._vec.setElements([x, this._vec.e(2)]);
      this.upd();
   },

   /**
    * Set the Y coordinate
    *
    * @param y {Number} The Y coordinate
    */
   setY: function(y) {
      this._vec.setElements([this._vec.e(1), y]);
      this.upd();
   },

   /**
    * Adds the specified point to this point.
    * @param point {Point2D} A point
    * @type Point2D
    */
   add: function(point) {
      this._vec = this._vec.add(point._vec);
      this.upd();
      return this;
   },

   /**
    * Add the scalar value to each component of the point
    * @param scalar {Number} A number
    * @type Point2D
    */
   addScalar: function(scalar) {
      this._vec = this._vec.map(function(x) { return x + scalar; });
      this.upd();
      return this;
   },

   /**
    * Subtract the specified point from this point.
    * @param point {Point2D} a point
    * @type Point2D
    */
   sub: function(point) {
      this._vec = this._vec.subtract(point._vec);
      this.upd();
      return this;
   },

   /**
    * Multiply the components of two points together.
    * @param point {Point2D} A point
    * @type Point2D
    */
   convolve: function(point) {
      this._vec = this._vec.map(function(x, i) { return x * (i == 1 ? point.x : point.y); });
      this.upd();
      return this;
   },

   /**
    * Divide the components of two points.  The point cannot contain zeros for its components.
    * @param point {Point2D} A point
    * @type Point2D
    */
   convolveInverse: function(point) {
      Assert((point.x != 0 && point.y != 0), "Division by zero in Point.convolveInverse");
      this._vec = this._vec.map(function(x, i) { return x / (i == 1 ? point.x : point.y); });
      this.upd();
      return this;
   },

   /**
    * Multiply the components of this point by a scalar value.
    * @param scalar {Number} A number
    * @type Point2D
    */
   mul: function(scalar) {
      this._vec = this._vec.map(function(x) { return x * scalar; });
      this.upd();
      return this;
   },

   /**
    * Divide the components of this point by a scalar value.
    * @param scalar {Number} A number - cannot be zero
    * @type Point2D
    */
   div: function(scalar) {
      Assert((scalar != 0), "Division by zero in Point.divScalar");

      this._vec = this._vec.map(function(x) { return x / scalar; });
      this.upd();
      return this;
   },

   /**
    * Negate the point, inversing it's components.
    * @type Point2D
    */
   neg: function() {
      this._vec.setElements([ -this._vec.e(1), -this._vec.e(2) ]);
      this.upd();
      return this;
   },

   /**
    * Returns true if the point is the zero point.
    * @type Boolean
    */
   isZero: function() {
      return this._vec.eql(Vector.Zero);
   },
	
	/**
	 * Returns the distance between two points.
	 * @param point {Point2D} The point to compare against
	 */
	dist: function(point) {
		return this._vec.distanceFrom(point._vec);
	},

   /**
    * Returns a printable version of this object.
    */
   toString: function() {
      return Number(this._vec.e(1)).toFixed(2) + "," + Number(this._vec.e(2)).toFixed(2);
   }

}, { /** @scope Point2D.prototype */

   getClassName: function() {
      return "Point2D";
   }
});

/**
 * The "zero" point. This point should not be modified.
 */
Point2D.ZERO = new Point2D(0,0);

return Point2D;

});

Engine.initObject("Vector2D", "Point2D", function() {

/**
 * @class A 2D vector class with helpful manipulation methods.
 * @extends Point2D
 */
var Vector2D = Point2D.extend(/** @scope Vector2D.prototype */{

   /**
    * Normalize the vector, returning its unit length, not including the actual length of the vector.
    * @type Vector2D
    */
   normalize: function() {
      this._vec = this._vec.toUnitVector();
      this.upd();
      return this;
   },

   /**
    * Get the magnitude/length of the vector.
    *
    * @returns A value representing the length (magnitude) of the point.
    * @type Number
    */
   len: function() {
      return this._vec.modulus();
   },

   /**
    * Get the dot product of two vectors.
    * @param vector {Vector} The Point to perform the operation against.
    * @type Vector2D
    */
   dot: function(vector) {
      return this._vec.dot(vector._vec);
   },

   /**
    * Get the cross product of two vectors.
    * @param vector {Vector2D} The vector to perform the operation against.
    * @type Vector2D
    */
   cross: function(vector) {
      this._vec = this._vec.cross(vector._vec);
      this.upd();
      return this;
   },

   /**
    * Returns the angle (in degrees) between two vectors.  This assumes that the
    * point is being used to represent a vector, and that the supplied point
    * is also a vector.
    *
    * @param vector {Vector} The vector to perform the angular determination against
    * @type Number
    */
   angleBetween: function(vector) {
      return Math2D.radToDeg(this._vec.angleFrom(vector._vec));
   }

}, { /** @scope Vector2D.prototype */
   getClassName: function() {
      return "Vector2D";
   }
});

return Vector2D;

});

Engine.initObject("Rectangle2D", "MathObject", function() {

/**
 * @class A 2D rectangle class with helpful manipulation methods.
 */
var Rectangle2D = MathObject.extend(/** @scope Rectangle2D.prototype */{

   topLeft: null,
   dims: null,

   /**
    * Create a rectangle object specifying the X and Y position and
    * the width and height.
    *
    * @param x {Number} The top-left X coordinate
    * @param y {Number} The top-left Y coordinate
    * @param width {Number} the width of the rectangle
    * @param height {Number} The height of the rectangle
    */
   constructor: function(x, y, width, height) {
      this.topLeft = Point2D.create(0,0);
      this.dims = Point2D.create(0,0);
      this.set(x,y,width,height);
   },

   release: function() {
      this.base();
      this.topLeft = null;
      this.dims = null;
   },

   /**
    * Set the values of this rectangle.
    *
    * @param x {Float} An optional value to initialize the X coordinate of the rectangle
    * @param y {Float} An optional value to initialize the Y coordinate of the rectangle
    * @param width {Float} An optional value to initialize the width of the rectangle
    * @param height {Float} An optional value to initialize the height of the rectangle
    */
   set: function(x, y, width, height)
   {
      if (x instanceof Rectangle2D) {
         this.topLeft.set(x.getTopLeft());
         this.dims.set(x.getDims());
      }
      else
      {
         this.topLeft.set((x != null ? x : 0.0), (y != null ? y : 0.0));
         this.dims.set((width != null ? width : 0.0), (height != null ? height : 0.0));
      }
   },

   /**
    * Get an object with the elements containing left, top, width, height, right
    * and bottom as the elements x, y, w, h, r, and b. 
    *
    * @return {Object} An object with the specified elements
    */
   get: function() {
      var tl = this.getTopLeft();
      var d = this.getDims();
      return {x: tl.x, y: tl.y, w: d.x, h: d.y, r: tl.x + d.x, b: tl.y + d.y};
   },

   /**
    * Returns <tt>true</tt> if this rectangle is equal to the specified rectangle.
    *
    * @param rect {Rectangle2D} The rectangle to compare to
    * @type Boolean
    */
   equals: function(rect) {
      return (this.topLeft.equals(rect.getTopLeft()) && this.dims.equals(rect.getDims()));
   },

   /**
    * Offset this rectangle by the given amount in the X and Y axis.  The first parameter
    * can be either a point, or the value for the X axis.  If the X axis is specified,
    * the second parameter should be the amount to offset in the Y axis.
    *
    * @param offsetPtOrX {Point/int} Either a {@link Point} which contains the offset in X and Y, or an integer
    *                                representing the offset in the X axis.
    * @param offsetY {int} If <code>offsetPtOrX</code> is an integer value for the offset in the X axis, this should be
    *                      the offset along the Y axis.
    */
   offset: function(offsetPtOrX, offsetY)
   {
      var offs = Point2D.create(0,0);
      if (offsetPtOrX instanceof Point2D)
      {
         offs.set(offsetPtOrX);
      }
      else
      {
         offs.set(offsetPtOrX, offsetY);
      }

      this.topLeft.add(offs);
      return this;
   },

   /**
    * Set the top left of the rectangle to the point, or coordinates specified.
    *
    * @param ptOrX {Point2D/Number} The top left point, or the X coordinate
    * @param y {Number} If the top left wasn't specified as the first argument, this is the Y coordinate
    */
   setTopLeft: function(ptOrX, y) {
      if (ptOrX instanceof Point2D)
      {
         this.topLeft.set(ptOrX);
      }
      else
      {
         this.topLeft.set(ptOrX, y);
      }
   },

   setDims: function(point) {
      this.dims.set(point.x, point.y);
   },

   /**
    * Set the width of the rectangle.
    *
    * @param width {Number} The new width of the rectangle
    */
   setWidth: function(width) {
      this.setDims(Point2D.create(width, this.get().h));
   },

   /**
    * Set the height of the rectangle
    *
    * @param height {Number} The new height of the rectangle
    */
   setHeight: function(height) {
      this.setDims(Point2D.create(this.get().w, height));
   },

   /**
    * Determine if this rectangle overlaps another rectangle along
    * any axis.  If an overlap occurs, a vector is returned that will
    * resolve the overlap.
    *
    * @param rect A {@link Rectangle} to compare against
    * @return {Vector2D} The vector to resolve the overlap
    * @type Boolean
    */
   isOverlapped: function(rect)
   {
      // TODO: This will implement the Separating Axis Theorem, eventually...
   },

   /**
    * Determine if this rectangle intersects another rectangle.
    *
    * @param rect A {@link Rectangle2D} to compare against
    * @return <code>true</code> if the two rectangles intersect.
    * @type Boolean
    */
   isIntersecting: function(rect) {
      var r1 = this.get();
      var r2 = rect.get();
      return !(r1.r < r2.x ||
               r1.x > r2.r ||
               r1.y > r2.b ||
               r1.b < r2.y);
   },

   /**
    * Determine if this rectangle is contained within the specified rectangle.
    *
    * @param rect A {@link Rectangle2D} to compare against
    * @return <code>true</code> if the this rectangle is fully contained in the specified rectangle.
    * @type Boolean
    */
   isContained: function(rect)
   {
      var r1 = this.get();
      var r2 = rect.get();
      return ((r1.x >= r2.x) &&
              (r1.y >= r2.y) &&
              (r1.r <= r2.r) &&
              (r1.b <= r2.b));
   },

   /**
    * Determine if this rectangle contains the specified rectangle.
    *
    * @param rect A {@link Rectangle2D} to compare against
    * @return <code>true</code> if the rectangle is fully contained within this rectangle.
    * @type Boolean
    */
   containsRect: function(rect)
   {
      var r1 = this.get();
      var r2 = rect.get();
      return ((r2.x >= r1.x) &&
              (r2.y >= r1.y) &&
              (r2.r <= r1.r) &&
              (r2.b <= r1.b));

   },

   /**
    * Returns <tt>true</tt> if this rectangle contains the specified point.
    *
    * @param point {Point} The point to test
    * @type Boolean
    */
   containsPoint: function(point)
   {
      var r1 = this.get();
      return (point.x >= r1.x &&
              point.y >= r1.y &&
              point.x <= r1.r &&
              point.y <= r1.b);
   },

   /**
    * Returns a {@link Point2D} that contains the center point of this rectangle.
    *
    * @return {Point2D}
    */
   getCenter: function()
   {
      return Point2D.create(this.topLeft.x + (this.dims.x * 0.5), this.topLeft.y + (this.dims.y * 0.5));
   },

   getHalfWidth: function() {
      return this.len_x() * 0.5;
   },

   getHalfHeight: function() {
      return this.len_y() * 0.5;
   },

   /**
    * Returns the positive length of this rectangle, along the X axis.
    *
    * @return {Number}
    */
   len_x: function()
   {
      return Math.abs(this.dims.x);
   },

   /**
    * Returns the positive length of this rectangle, along the Y axis.
    *
    * @return {Number}
    */
   len_y: function()
   {
      return Math.abs(this.dims.y);
   },

   /**
    * Gets a {@link Point2D} representing the top-left corner of this rectangle.
    * @return {Point2D}
    */
   getTopLeft: function()
   {
      return Point2D.create(this.topLeft);
   },

   /**
    * Gets a {@link Point2D) representing the width and height of this rectangle.
    * @return {Point2D}
    */
   getDims: function()
   {
      return Point2D.create(this.dims);
   },

   /**
    * Gets a {@link Point2D} representing the bottom-right corner of this rectangle.
    * @return {Point2D}
    */
   getBottomRight: function()
   {
      var p = Point2D.create(this.topLeft);
      p.add(this.dims);

      return p;
   },

   /**
    * Returns a printable version of this object.
    * @return {String}
    */
   toString: function()
   {
      return (this.topLeft + " [" + this.dims + "]");
   }
}, { /** @scope Rectangle2D.prototype */
   getClassName: function() {
      return "Rectangle2D";
   }
});

return Rectangle2D;

});


Engine.initObject("Circle2D", "MathObject", function() {

/**
 * @class A 2D circle class with helpful manipulation methods.
 */
var Circle2D = MathObject.extend(/** @scope Circle2D.prototype */{

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
   constructor: function(x, y, radius) {
      this.center = Point2D.create(0,0);
      this.radius = 0;
      this.set(x,y,radius);
   },

   release: function() {
      this.base();
      this.center = null;
      this.radius = 0;
   },

   /**
    * Set the values of this circle.
    *
    * @param x {Float} An optional value to initialize the X coordinate of the circle
    * @param y {Float} An optional value to initialize the Y coordinate of the circle
    * @param radius {Float} An optional value to initialize the radius
    */
   set: function(x, y, radius)
   {
      if (x instanceof Circle2D) {
         this.center.set(x.getCenter());
         this.radius = x.getRadius();
      }
		else if (x instanceof Point2D) {
			this.center.set(x);
			this.radius = y;
		}
      else
      {
         this.center.set((x != null ? x : 0.0), (y != null ? y : 0.0));
         this.radius = (radius != null ? radius : 0.0);
      }
   },

   /**
    * Get an object with the elements containing centerX, centerY, and radius
    * as the elements x, y, and r. 
    *
    * @return {Object} An object with the specified elements
    */
   get: function() {
      var c = this.getCenter();
      return {x: c.x, y: c.y, r: this.getRadius()};
   },

   /**
    * Returns <tt>true</tt> if this circle is equal to the specified circle.
    *
    * @param circle {Circle2D} The circle to compare to
    * @type Boolean
    */
   equals: function(circle) {
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
   offset: function(offsetPtOrX, offsetY)
   {
      var offs = new Point2D(0,0);
      if (offsetPtOrX instanceof Point2D)
      {
         offs.set(offsetPtOrX);
      }
      else
      {
         offs.set(offsetPtOrX, offsetY);
      }

      this.center.add(offs);
      return this;
   },
	
	getCenter: function() {
		return Point2D.create(this.center);
	},
	
	getRadius: function() {
		return this.radius;
	},
	
   /**
    * Determine if this circle intersects another circle.
    *
    * @param circle A {@link Circle2D} to compare against
    * @return <code>true</code> if the two circles intersect.
    * @type Boolean
    */
   isIntersecting: function(circle) {
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
    * @param circle A {@link Circle2D} to compare against
    * @return <code>true</code> if the this circle is fully contained in the specified circle.
    * @type Boolean
    */
   isContained: function(circle)
   {
		var d = circle.getCenter().dist(this.getCenter());
		return (d < (this.getRadius() + circle.getRadius()));
   },

   /**
    * Determine if this rectangle contains the specified rectangle.
    *
    * @param rect A {@link Rectangle2D} to compare against
    * @return <code>true</code> if the rectangle is fully contained within this rectangle.
    * @type Boolean
    */
   containsCircle: function(circle)
   {
		return circle.isContained(this);
   },

   /**
    * Returns <tt>true</tt> if this rectangle contains the specified point.
    *
    * @param point {Point} The point to test
    * @type Boolean
    */
   containsPoint: function(point)
   {
      var c1 = this.getCenter();
		var r = this.getRadius();
      return (c1.dist(point) <= r);
   },

	toString: function() {
		return this.center.toString() + " r" + Number(this.radius).toFixed(2);
	}	

},{ /** @scope Circle2D.prototype */
	
   getClassName: function() {
      return "Circle2D";
   }
	
});

return Circle2D;

});

/**
 * The Render Engine
 * Math2D
 *
 * A simple 2D math library.  The objects exposed in this library wrap
 * the functionality provided by the Sylvester library.  I did this because
 * a lot of the code is currently in use within the engine.
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

var Math2D = Base.extend(/** @scope Math2D.prototype */{

   constructor: null,

   /**
    * An approximation of PI for speedier calculations.
    */
   PI: 3.14159,

   /**
    * An approximation of the inverse of PI so we can
    * avoid divisions.
    */
   INV_PI: 0.31831,

   /**
    * Convert degrees to radians.
    * @param degrees {Number} An angle in degrees
    * @type Number
    */
   degToRad: function(degrees) {
      // ((Math.PI / 180) * deg);
      return (0.01745 * degrees);
   },

   /**
    * Convert radians to degrees.
    * @param radians {Number} An angle in radians
    * @type Number
    */
   radToDeg: function(radians) {
      // ((rad * 180) / Math.PI)
      return ((radians * 180) * Math2D.INV_PI);
   },

   /**
    * Perform AAB (axis-aligned box) to AAB collision testing in world coordinates, returning <code>true</code>
    * if the two boxes overlap.
    *
    * @param box1 {Rectangle} The collision box of object 1
    * @param offset1 {Point2D} The position, in world coordinates, of object 1
    * @param box2 {Rectangle} The collision box of object 2
    * @param offset2 {Point2D} The position, in world coordinates, of object 2
    * @type Boolean
    */
   boxBoxCollision: function(box1, offset1, box2, offset2)
   {
      return box1.offset(offset1).isOverlapped(box2.offset(offset2));
   },

   /**
    * Perform point to AAB collision testing in world coordinates, returning <code>true</code>
    * if a collision occurs.
    *
    * @param box1 {Rectangle} The collision box of the object
    * @param offset1 {Point2D} The position, in world coordinates, of the object
    * @param p {Point} The point to test, in world coordinates
    * @type Boolean
    */
   boxPointCollision: function(box1, offset1, p)
   {
      return box1.offset(offset1).containsPoint(p);
   },

   /**
    * A static method used to calculate a direction vector
    * for the player's heading.
    * @param origin {Point2D} The origin of the shape
    * @param baseVec {Vector2D} The base vector
    * @param angle {Number} The rotation in degrees
    * @type Vector2D
    */
   getDirectionVector: function(origin, baseVec, angle)
   {
      var r = Math2D.degToRad(angle);

      var x = Math.cos(r) * baseVec.x - Math.sin(r) * baseVec.y;
      var y = Math.sin(r) * baseVec.x + Math.cos(r) * baseVec.y;

      var v = new Vector2D(x, y).sub(origin);
      return v.normalize();
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
    */
   lineLineCollision: function(p1, p2, p3, p4)
   {
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
    */
   lineBoxCollision: function(p1, p2, rect)
   {
      if (Math2D.boxPointCollision(rect, Point2D.ZERO, p1) &&
          Math2D.boxPointCollision(rect, Point2D.ZERO, p2))
      {
         // line inside
         return true;
      }

      // check each line for intersection
      var topLeft = rect.getTopLeft();
      var bottomRight = rect.getBottomRight();
      var topRight = new Point2D(rect.x, rect.y).add(new Point2D(rect.width, 0));
      var bottomLeft = new Point2D(rect.x, rect.y).add(new Point2D(0, rect.height));

      if (Math2D.lineLineCollision(p1, p2, topLeft, bottomLeft)) return true;
      if (Math2D.lineLineCollision(p1, p2, topRight, lowerRight)) return true;
      if (Math2D.lineLineCollision(p1, p2, upperLeft, upperRight)) return true;
      if (Math2D.lineLineCollision(p1, p2, upperRight, lowerRight)) return true;

      return false;
   }
});

/**
 * 2D point class
 */
var Point2D = Base.extend(/** @scope Point2D.prototype */{

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
      this.set(x, y);
   },

   /**
    * Private method used to update underlying object.
    * @private
    */
   upd: function() {
      this.x = this._vec.e(1); this.y = this._vec.e(2);
   },

   /**
    * Returns true if this point is equal to the specified point.
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
      this._vec.subtract(point._vec);
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
    * Returns a printable version of this object.
    */
   toString: function() {
      return this._vec.inspect();
   }

});

Point2D.ZERO = new Point2D(0,0);


/**
 * 2D vector class
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

});

var Rectangle2D = Base.extend(/** @scope Rectangle2D.prototype */{

   x: 0,
   y: 0,
   width: 0,
   height: 0,

   constructor: function(x, y, width, height) {
      this.set(x,y,width,height);
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
         this.x = x.x;
         this.y = x.y;
         this.width = x.width;
         this.height = x.height;
      }
      else
      {
         this.x = (x != null ? x : 0.0);
         this.y = (y != null ? y : 0.0);
         this.width = (width != null ? width : 0.0);
         this.height = (height != null ? height : 0.0);
      }
   },

   /**
    * Returns true if this rectangle is equal to the specified rectangle.
    *
    * @param rect {Rectangle2D} The rectangle to compare to
    * @type Boolean
    */
   equals: function(rect) {
      return (this.x == rect.x && this.y == rect.y &&
              this.width == rect.width && this.height == rect.height);
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
      var xOff = 0;
      var yOff = 0;
      if (offsetPtOrX instanceof Point2D)
      {
         xOff = offsetPtOrX.x;
         yOff = offsetPtOrX.y;
      }
      else
      {
         xOff = offsetPtOrX;
         yOff = offsetY;
      }

      this.x += xOff;
      this.y += yOff;
   },

   /**
    * Set the width of the rectangle.
    *
    * @param width {Number} The new width of the rectangle
    */
   setWidth: function(width) {
      this.width = width;
   },

   /**
    * Set the height of the rectangle
    *
    * @param height {Number} The new height of the rectangle
    */
   setHeight: function(height) {
      this.height = height;
   },

   /**
    * Determine if this rectangle overlaps another rectangle.
    *
    * @param rect A {@link Rectangle} to compare against
    * @return <code>true</code> if the two rectangles overlap.
    * @type Boolean
    */
   isOverlapped: function(rect)
   {
      if ((rect.x > (this.x + this.width)) ||
          (rect.y > (this.y + this.height)))
      {
         return false;
      }

      return !((rect.x + rect.width) < this.x ||
               (rect.y + rect.height) < this.y);
   },

   /**
    * Determine if this rectangle is contained within another rectangle.
    *
    * @param rect A {@link Rectangle} to compare against
    * @return <code>true</code> if the this rectangle is fully contained in the specified rectangle.
    * @type Boolean
    */
   isContained: function(rect)
   {
      return (this.x >= rect.x) &&
             (this.y >= rect.y) &&
             ((this.x + this.width) <= (rect.x + rect.width)) &&
             ((this.y + this.height) <= (rect.y + rect.height));
   },

   /**
    * Returns true if this rectangle contains the specified point.
    *
    * @param point {Point} The point to test
    * @type Boolean
    */
   containsPoint: function(point)
   {
      return (point.x >= this.x &&
              point.y >= this.y &&
              point.x <= this.x + this.width &&
              point.y <= this.y + this.height);
   },

   /**
    * Returns a {@link Point} that contains the center point of this rectangle.
    *
    * @type Point2D
    */
   getCenter: function()
   {
      return new Point2D(this.x + (this.width * 0.5), this.y + (this.height * 0.5));
   },

   /**
    * Returns the positive length of this rectangle, along the X axis.
    *
    * @type Number
    */
   len_x: function()
   {
      return Math.abs(this.width);
   },

   /**
    * Returns the positive length of this rectangle, along the Y axis.
    *
    * @type Number
    */
   len_y: function()
   {
      return Math.abs(this.height);
   },

   /**
    * Gets a <code>Point</code> representing the top-left corner of this rectangle
    * in world coordinate space.
    * @type Point2D
    */
   getTopLeft: function()
   {
      return new Point2D(this.x, this.y);
   },

   /**
    * Gets a <code>Point</code> representing the bottom-right corner of this rectangle
    * in world coordinate space.
    * @type Point2D
    */
   getBottomRight: function()
   {
      var p = this.getTopLeft();
      p.add(new Point2D(this.width, this.height));

      return p;
   },

   /**
    * Returns a printable version of this object.
    */
   toString: function()
   {
      return (this.x + "," + this.y + " [" + this.width + "," + this.height + "]");
   }
});
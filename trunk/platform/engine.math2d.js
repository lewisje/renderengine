/**
 * The Render Engine
 * Math2D
 *
 * A simple 2D math library.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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

var Math2D = Base.extend({

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
    * Convert degrees to radians
    */
   degToRad: function(degrees) {
      // ((Math.PI / 180) * deg);
      return (0.01745 * degrees);
   },

   /**
    * Convert radians to degrees
    */
   radToDeg: function(radians) {
      // ((rad * 180) / Math.PI)
      return ((rad * 180) * Math2D.INV_PI);
   },
   
   /**
    * Perform AAB to AAB collision testing in world coordinates, returning <code>true</code>
    * if the two boxes overlap.
    *
    * @param box1 {Rectangle} The collision box of object 1
    * @param offset1 {Point} The position, in world coordinates, of object 1
    * @param box2 {Rectangle} The collision box of object 2
    * @param offset2 {Point} The position, in world coordinates, of object 2
    * @type Boolean
    */
   boxBoxCollision: function(box1, offset1, box2, offset2)
   {
      return box1.offset(offset1).isOverlapped(box2.offset(offset2));
   },

   /**
    * Perform Point to AAB collision testing in world coordinates, returning <code>true</code>
    * if a collision occurs.
    *
    * @param box1 {Rectangle} The collision box of the object
    * @param offset1 {Point} The position, in world coordinates, of the object
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
    * @param origin {Point} The origin of the shape
    * @param point {Point} The point to create the vector for
    * @param angle {Number} The rotation in degrees
    */
   getDirectionVector: function(origin, point, angle)
   {
      var r = MathUtil.degreesToRadians(angle);

      var x = Math.cos(r) * point.x - Math.sin(r) * point.y;
      var y = Math.sin(r) * point.x + Math.cos(r) * point.y;

      var v = new Point2D(x, y).sub(origin);
      return v.normalize();
   }   

});

/**
 * 2D point class
 */
var Point2D = Base.extend({

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
      if (x instanceof Point2D)
      {
         this.x = x.x;
         this.y = x.y;
      }
      else
      {
         AssertWarn((y != null), "Undefined Y value for point initialized to zero.");
         this.x = x;
         this.y = y || 0;
      }
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
         this.x = x.x;
         this.y = x.y;
      }
      else
      {
         AssertWarn((y != null), "Undefined Y value for point initialized to zero.");
         this.x = x;
         this.y = y || 0;
      }

      return this;
   },

   add: function(point) {
      this.x += point.x;
      this.y += point.y;

      return this;
   },

   addScalar: function(scalar) {
      this.x += scalar;
      this.y += scalar;

      return this;
   },

   sub: function(point) {
      this.x -= point.x;
      this.y -= point.y;

      return this;
   },

   convolve: function(point) {
      this.x *= point.x;
      this.y *= point.y;

      return this;
   },

   convolveInverse: function(point) {
      Assert((point.x != 0 && point.y != 0), "Division by zero in Point.convolveInverse");

      this.x /= point.x;
      this.y /= point.y;

      return this;
   },

   mul: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;

      return this;
   },

   div: function(scalar) {
      Assert((scalar != 0), "Division by zero in Point.divScalar");
      this.x /= scalar;
      this.y /= scalar;

      return this;
   },

   /**
    * Negate the point.
    *
    */
   neg: function() {
      this.x = -this.x;
      this.y = -this.y;

      return this;
   },

   /**
    * Returns true if the point is the zero point.
    *
    */
   isZero: function() {
      return (this.x == 0 && this.y == 0);
   },
   
   toString: function() {
      return "[" + this.x + "," + this.y + "]";
   }

});


/**
 * 2D vector class
 */
var Vector2D = Point2D.extend({

   /**
    * Normalize the vector.  Returning its unit length, not including the actual length of the vector.
    */
   normalize: function() {
      var factor = 1.0 / this.len();
      this.x *= factor;
      this.y *= factor;

      return this;
   },

   /**
    * Get the magnitude/length of the vector.
    *
    * @returns a value representing the length (magnitude) of the point.
    */
   len: function() {
      return Math.sqrt((this.x*this.x) + (this.y*this.y));
   },

   /**
    * Get the dot product of two vectors.
    * @param vector {Vector} The Point to perform the operation against.
    */
   dot: function(vector)
   {
      return (this.x * vector.x) + (this.y * vector.y);
   },

   /**
    * Returns the angle (in degrees) between two vectors.  This assumes that the
    * point is being used to represent a vector, and that the supplied point
    * is also a vector.
    *
    * @param vector {Vector} The vector to perform the angular determination against
    */
   angleBetween: function(vector)
   {
      var p1 = new Vector(this);
      var p2 = new Vector(vector);
      p1.normalize();
      p2.normalize();
      // (((Math.acos(p1.dot(p2))) * 180) / Math2D.PI);
      return (((Math.acos(p1.dot(p2))) * 180) * Math2D.INV_PI);
   }

});

var Rectangle2D = Base.extend({
   
   x: 0,
   y: 0,
   width: 0,
   height: 0,
   
   constructor: function(x, y, width, height) {
      this.x = (x != null ? x : 0.0);
      this.y = (y != null ? y : 0.0);
      this.width = (width != null ? width : 0.0);
      this.height = (height != null ? height : 0.0);
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
      this.x = (x != "" ? x : 0.0);
      this.y = (y != "" ? y : 0.0);
      this.width = (width != "" ? width : 0.0);
      this.height = (height != "" ? height : 0.0);
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
    * @type Point
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
    * @type Point
    */
   getTopLeft: function()
   {
      return new Point2D(this.x, this.y);
   },

   /**
    * Gets a <code>Point</code> representing the bottom-right corner of this rectangle
    * in world coordinate space.
    * @type Point
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
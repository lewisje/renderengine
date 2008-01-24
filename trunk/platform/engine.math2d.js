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

   degToRad: function(degrees) {
      // ((Math.PI / 180) * deg);
      return (0.01745 * degrees);
   },

   radToDeg: function(radians) {
      // ((rad * 180) / Math.PI)
      return ((rad * 180) * Math2D.INV_PI);
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
   angleBetween = function(vector)
   {
      var p1 = new Vector(this);
      var p2 = new Vector(vector);
      p1.normalize();
      p2.normalize();
      // (((Math.acos(p1.dot(p2))) * 180) / Math2D.PI);
      return (((Math.acos(p1.dot(p2))) * 180) * Math2D.INV_PI);
   }

});
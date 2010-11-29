/**
 * The Render Engine
 * AABBHull
 *
 * @fileoverview A collision shape which represents an AABB hull.
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

Engine.include("/engine.math2d.js");

Engine.initObject("AABBHull", "ConvexHull", function() {

/**
 * @class An rectangular convex hull.
 *
 * @param rect {Rectangle2D} An rectangle which represents the AABB
 *
 * @extends ConvexHull
 * @constructor
 * @description Creates an AABB hull.
 */
var AABBHull = ConvexHull.extend(/** @scope AABBHull.prototype */{

	constructor: function(rect) {
		var points = [Point2D.create(0,0),
						  Point2D.create(rect.w,0),
						  Point2D.create(rect.w,rect.h),
						  Point2D.create(0,rect.h)];
		this.base(points, 4);
	}

}, { /** @scope ConvexHull.prototype */

   /**
    * Get the class name of this object
    * @return {String} "AABBHull"
    */
   getClassName: function() {
      return "AABBHull";
   }   
});

return AABBHull;

});
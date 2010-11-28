/**
 * The Render Engine
 * ConvexHull
 *
 * @fileoverview A collision shape which represents a convex hull.
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

Engine.initObject("ConvexHull", null, function() {

/**
 * @class A convex hull with which to perform collision testing.  A convex hull
 * 		 is a simplification of the object which it contains.
 *
 * @param points {Array} An array of {@link Point2D} which make up the shape of the object
 * @param [lod] {Number} The level of detail for the hull.  Larger numbers make for a more 
 * 		complex hull.  Default: 6
 *
 * @extends PooledObject
 * @constructor
 * @description Create a polygonal convex hull which has, at most, <tt>lod</tt> vertexes.
 */
var ConvexHull = PooledObject.extend(/** @scope ConvexHull.prototype */{

	center: null,
	radius: -1,
	faces: null,
	normals: null,
	vertexes: null,
	dirty: false,

	/**
	 * @private
	 */
	constructor: function(points, lod) {
		this.base("ConvexHull");
		lod = lod || 6;

		// Calculate the center and radius based on the given points
		var cX = 0, cY = 0;
		for (var p = 0; p < points.length; p++) {
			cX += points[p].get().x;
			cY += points[p].get().y;
		}
		this.center = Point2D.create(cX / points.length, cY / points.length);

		// Back through the points again to find the point farthest from the center
		// to create our radius
		var dist = -1;
		var rVec = Vector2D.create(0,0);
		var d = Vector2D.create(0,0);
		for (var p = 0; p < points.length; p++) {
			d.set(this.center);
			d.sub(points[p]);
			if (d.len() > dist) {
				dist = d.len();
				rVec.set(d);
			}
		}
		d.destroy();
		this.radius = rVec.len();
		rVec.destroy();

		// Create the simplified hull
		this.vertexes = Math2D.convexHull(points, lod);
		this.dirty = true;
		this.faces = [];
		this.normals = [];
	},

	/**
	 * Get the point at the center of the convex hull
	 * @return {Point2D}
	 */
	getCenter: function() {
		return this.center;
	},

	/**
	 * Get the radius (distance to farthest point in shape, from center)
	 * @return {Number}
	 */
	getRadius: function() {
		return this.radius;
	},

	/**
	 * Build the faces and normals array, if the hull has been transformed.
	 * @private
	 */
	_build: function() {
		if (this.dirty) {
			// Destroy any previous objects
			for (var k = 0; k < this.faces.length; k++) {
				this.faces[k].destroy();
				this.normals[k].destroy();
			}
			
			// Build the face and normals array
			for (var n = 1; n < this.hull.length; n++) {
				var p1 = this.hull[n];
				var p2 = this.hull[n-1];
				v.set(p2).sub(p1);
				var v = Vector2D.create(0,0);
				this.faces.push(v);
				this.normals.push(v.rightNormal());
			}
			this.dirty = false;		
		}
	},

	/**
	 * Get the array of face vectors in the convex hull
	 * @return {Array} of {@link Vector2D}
	 */
	getFaces: function() {
		this._build();
		return this.faces;
	},

	/**
	 * Get the array of face normal vectors in the convex hull
	 * @return {Array} of {@link Vector2D}
	 */
	getNormals: function() {
		this._build();
		return this.normals;
	},
	
	/**
	 * Get the array of vertexes in the convex hull
	 * @return {Array} of {@link Point2D}
	 */
	getVertexes: function() {
		return this.hull;	
	},
	
	/**
	 * Return the type of convex hull this represents.
	 * @return {Number} {@link #CONVEX_NGON}
	 */
	getType: function() {
		return ConvexHull.CONVEX_NGON;
	},
	
	/**
	 * Transform the points of the hull.
	 * 
	 * @param pos {Point2D}
	 * @param rot {Number}
	 * @param scaleX {Number}
	 * @param scaleY {Number}
	 */
	transform: function(pos, rot, scaleX, scaleY) {
		this.dirty = true;

		// Default some values
		rot = rot || 0;
		scaleX = scaleX || 1.0;
		scaleY = scaleY || scaleX;
		
		var p = pos.get();
		var tM = $M([
			[1,0,p.x],
			[0,1,p.y],
			[0,0,1]
		]);
		if (rot != 0) {
			tM.multiply($M.Rotation(Math2D.degToRad(rot), $V([0,1,0])));
		}
		if (scaleX != 1.0 && scaleY != 1.0) {
			tM.multiply($M([
				[scaleX,0,0],
				[0,scaleY,0],
				[0,0,1]
			]));
		}

		// Transform the vertexes of the hull		
		for (var p = 0; p < this.vertexes.length; p++) {
			this.vertexes.transform(tM);	
		}	
	}

}, { /** @scope ConvexHull.prototype */

   /**
    * Get the class name of this object
    * @return {String} "ConvexHull"
    */
   getClassName: function() {
      return "ConvexHull";
   },
	
	/**
	 * An N-gon convex hull shape (3 or more vertexes)
	 * @type {Number}
	 */
	CONVEX_NGON: 1,
	
	/**
	 * A circular convex hull shape (center and radius)
	 * @type {Number}
	 */
	CONVEX_CIRCLE: 2   
});

return ConvexHull;

});
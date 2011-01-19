/**
 * The Render Engine
 * Object2D
 *
 * @fileoverview An extension of the <tt>HostObject</tt> which is specifically geared
 *               towards 2d game development.
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
	"class": "R.engine.Object2D",
	"requires": [
		"R.engine.HostObject",
		"R.collision.ConvexHull",
		"R.math.Rectangle2D",
		"R.math.Point2D",
		"R.math.Vector2D",
		"R.math.Math2D",
		"R.collision.ConvexHull"
	]
});

/**
 * @class An object for use in a 2d environment.  Methods for getting the position, rotation
 * and scale should be implemented within the extended class.
 * 
 * @param name {String} The name of the object
 * @extends R.engine.HostObject
 * @constructor
 * @description Create a 2d host object
 */
R.engine.Object2D = function(){
	return R.engine.HostObject.extend(/** @scope R.engine.Object2D.prototype */{
	
		/** @private */
		zIndex: 1,
		
		/** @private */
		bBox: null,
		AABB: null,
		wBox: null,
		lastPosition: null,
		origin: null,
		collisionHull: null,
		
		// Current origin/negative-origin matrices
		oMtx: null,
		oMtxN: null,
		
		/**
		 * @private
		 */
		constructor: function(name){
			this.base(name);
			this.lastPosition = R.math.Point2D.create(5, 5);
			this.bBox = R.math.Rectangle2D.create(0, 0, 1, 1);
			this.AABB = R.math.Rectangle2D.create(0, 0, 1, 1);
			this.wBox = R.math.Rectangle2D.create(0, 0, 1, 1);
			this.zIndex = 0;
			this.origin = R.math.Point2D.create(0, 0);
			this.collisionHull = null;
						
			// Initialize the matrices
			this.oMtx = R.math.Math2D.identityMatrix();
			this.oMtxN = R.math.Math2D.identityMatrix();
		},
		
		/**
		 * Destroy the object.
		 */
		destroy: function(){
			this.bBox.destroy();
			this.wBox.destroy();
			this.lastPosition.destroy();
			if (this.collisionHull) {
				this.collisionHull.destroy();
			}
			this.base();
		},
		
		/**
		 * Release the object back into the pool.
		 */
		release: function(){
			this.base();
			this.zIndex = 1;
			this.bBox = null;
			this.lastPosition = null;
			this.collisionHull = null;
			
			// Free the matrices
			this.oMtx = null;
			this.oMtxN = null;
		},
		
		/**
		 * Get the transformation matrix for this object
		 * @return {Matrix}
		 */
		getTransformationMatrix: function(){
			// Translation
			var p = this.getRenderPosition();
			var tMtx = $M([[1, 0, p.x], [0, 1, p.y], [0, 0, 1]]);
			tMtx = tMtx.multiply(this.oMtxN);
			
			// Rotation
			var a = this.getRotation();
			var rMtx;
			if (a != 0) {
				// Move the origin
				rMtx = this.oMtx.dup();
				// Rotate
				rMtx = rMtx.multiply(Matrix.Rotation(R.math.Math2D.degToRad(a), R.engine.Object2D.ROTATION_AXIS));
				// Move the origin back
				rMtx = rMtx.multiply(this.oMtxN);
			}
			else {
				// Set to identity
				rMtx = R.math.Math2D.identityMatrix();
			}
			
			// Scale
			var sX = this.getScaleX();
			var sY = this.getScaleY();
			var sMtx = $M([[sX, 0, 0], [0, sY, 0], [0, 0, 1]]);
			
			return tMtx.multiply(rMtx).multiply(sMtx);
		},
		
		/**
		 * Set the render origin of the object.  The render origin is where the object will be
		 * centered around when drawing position and rotation.
		 *
		 * @param x {Number|Point2D} The X coordinate or the render origin (default: 0,0 - top left corner)
		 * @param y {Number} The Y coordinate or <code>null</code> if X is a <code>Point2D</code>
		 */
		setOrigin: function(x, y){
			this.origin.set(x, y);
			
			var pX = x;
			var pY = y;
			
			if (x instanceof R.math.Point2D) {
				pX = x.x;
				pY = x.y;
			}
			
			this.oMtx.setElements([[1, 0, pX], [0, 1, pY], [0, 0, 1]]);
			this.oMtxN.setElements([[1, 0, -pX], [0, 1, -pY], [0, 0, 1]]);
			
			this.markDirty();
		},
		
		/**
		 * Get the render origin of the object.
		 * @return {Point2D}
		 */
		getOrigin: function(){
			return this.origin;
		},
		
		/**
		 * Set the bounding box of this object
		 *
		 * @param width {Number|Rectangle2D} The width, or the rectangle that completely encompasses
		 *                           		this object.
		 * @param height {Number} If width is a number, this is the height
		 */
		setBoundingBox: function(width, height){
			if (width instanceof R.math.Rectangle2D) {
				this.bBox.set(width);
			}
			else {
				this.bBox.set(0, 0, width, height);
			}
			this.markDirty();
		},
		
		/**
		 * Get the bounding box of this object
		 * @return {Rectangle2D} The object bounding rectangle
		 */
		getBoundingBox: function(){
			return this.bBox;
		},
		
		/**
		 * Get the bounding box in world coordinates.
		 * @return {Rectangle2D} The world bounding rectangle
		 */
		getWorldBox: function(){
			this.wBox.set(this.getBoundingBox());
			var rPos = R.math.Point2D.create(this.getRenderPosition());
			rPos.sub(this.origin);
			this.wBox.offset(rPos);
			rPos.destroy();
			return this.wBox;
		},
		
		/**
		 * Get the axis aligned world bounding box for the object.  This bounding box
		 * is ensured to encompass the entire object.
		 * @return {Rectangle2D}
		 */
		getAABB: function(){
			// Start with the world bounding box and transform it
			var bb = R.math.Rectangle2D.create(this.getBoundingBox());
			
			// Transform the world box
			var txfm = this.getTransformationMatrix();
			
			var p1 = bb.getTopLeft();
			var p2 = R.math.Point2D.create(bb.getTopLeft());
			p2.x += bb.getDims().x;
			var p3 = bb.getBottomRight();
			var p4 = R.math.Point2D.create(bb.getTopLeft());
			p4.y += bb.getDims().y;
			var pts = [p1.transform(txfm), p2.transform(txfm), p3.transform(txfm), p4.transform(txfm)];
			
			// Now find the AABB
			var x1 = R.lang.Math2.MAX_INT;
			var x2 = -R.lang.Math2.MAX_INT;
			var y1 = x1;
			var y2 = x2;
			
			for (var p in pts) {
				var pt = pts[p];
				if (pt.x < x1) 
					x1 = pt.x;
				if (pt.x > x2) 
					x2 = pt.x;
				if (pt.y < y1) 
					y1 = pt.y;
				if (pt.y > y2) 
					y2 = pt.y;
			}
			
			bb.destroy();
			p2.destroy();
			p3.destroy();
			
			this.AABB.set(x1, y1, x2 - x1, y2 - y1);
			return this.AABB;
		},
		
		/**
		 * [ABSTRACT] Get the world bounding circle.
		 * @return {Circle2D}
		 * @deprecated
		 */
		getCircle: function(){
			// ABSTRACT METHOD
		},
		
		/**
		 * Set the convex hull used for collision.
		 * @param convexHull {ConvexHull} The convex hull object
		 */
		setCollisionHull: function(convexHull){
			Assert(convexHull instanceof R.collision.ConvexHull, "setCollisionHull() - not ConvexHull!");
			this.collisionHull = convexHull;
			this.collisionHull.setHostObject(this);
			this.markDirty();
		},
		
		/**
		 * Get the convex hull used for collision.
		 * @return {ConvexHull}
		 */
		getCollisionHull: function(){
			return this.collisionHull;
		},
		
		/**
		 * [ABSTRACT] Get the velocity of the object.
		 * @return {Vector2D}
		 * @deprecated
		 */
		getVelocity: function(){
			// ABSTRACT METHOD
		},
		
		/**
		 * [ABSTRACT] Set the position of the object
		 * @param point {Point2D} The position of the object
		 */
		setPosition: function(point){
			this.markDirty();
		},
		
		/**
		 * Get the position of the object.
		 * @return {Point2D} The position
		 */
		getPosition: function(){
			return R.math.Point2D.ZERO;
		},
		
		/**
		 * Get the render position of the object.
		 * @return {Point2D}
		 */
		getRenderPosition: function(){
			return R.math.Point2D.ZERO;
		},
		
		/**
		 * Get the last position the object was rendered at.
		 * @return {Point2D}
		 */
		getLastPosition: function(){
			return R.math.Point2D.ZERO;
		},
		
		/**
		 * [ABSTRACT] Set the rotation of the object
		 * @param angle {Number} The rotation angle
		 */
		setRotation: function(angle){
			this.markDirty();
		},
		
		/**
		 * Get the rotation of the object
		 * @return {Number}
		 */
		getRotation: function(){
			return 0;
		},
		
		/**
		 * Store the scale of the object along the X and Y axis in the scaling matrix
		 * @param scaleX {Number} The scale along the X axis
		 * @param scaleY {Number} The scale along the Y axis
		 */
		setScale: function(scaleX, scaleY){
			this.markDirty();
		},
		
		/**
		 * Get the uniform scale of the object.
		 * @return {Number}
		 */
		getScale: function(){
			return 1;
		},
		
		/**
		 * Get the scale of the object along the X axis
		 * @return {Number}
		 */
		getScaleX: function(){
			return 1;
		},
		
		/**
		 * Get the scale of the object along the Y axis.
		 * @return {Number}
		 */
		getScaleY: function(){
			return 1;
		},
		
		/**
		 * Set the depth at which this object will render to
		 * the context.  The lower the z-index, the further
		 * away from the front the object will draw.
		 *
		 * @param zIndex {Number} The z-index of this object
		 */
		setZIndex: function(zIndex){
			if (this.getRenderContext() && this.getRenderContext().swapBins) {
				this.getRenderContext().swapBins(this, this.zIndex, zIndex);
			}
			this.zIndex = zIndex;
			if (this.getRenderContext()) {
				this.getRenderContext().sort();
			}
			this.markDirty();
		},
		
		/**
		 * Get the depth at which this object will render to
		 * the context.
		 *
		 * @return {Number}
		 */
		getZIndex: function(){
			return this.zIndex;
		},
		
		/**
		 * When editing objects, this method returns an object which
		 * contains the properties with their getter and setter methods.
		 * @return {Object} The properties object
		 */
		getProperties: function(){
			var self = this;
			var prop = this.base(self);
			return $.extend(prop, {
				"ZIndex": [function(){
					return self.getZIndex();
				}, function(i){
					self.setZIndex(i);
				}, true],
				"BoundingBox": [function(){
					return self.getBoundingBox().toString();
				}, null, false],
				"WorldBox": [function(){
					return self.getWorldBox().toString();
				}, null, false],
				"Position": [function(){
					return self.getPosition().toString();
				}, function(i){
					var p = i.split(",");
					self.setPosition(R.math.Point2D.create(p[0], p[1]));
				}, true],
				"Origin": [function(){
					return self.getOrigin().toString();
				}, function(i){
					var p = i.split(",");
					self.setOrigin(p[0], p[1]);
				}, true],
				"RenderPos": [function(){
					return self.getRenderPosition().toString()
				}, null, false],
				"Rotation": [function(){
					return self.getRotation();
				}, function(i){
					self.setRotation(i);
				}, true],
				"ScaleX": [function(){
					return self.getScaleX();
				}, function(i){
					self.setScale(i, self.getScaleY());
				}, true],
				"ScaleY": [function(){
					return self.getScaleY();
				}, function(i){
					self.setScale(self.getScaleX(), i);
				}, true]
			});
		}
				
	}, /** @scope R.engine.Object2D.prototype */ {
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.engine.Object2D"
		 */
		getClassName: function(){
			return "R.engine.Object2D";
		},
		
		/**
		 * The axis of rotation
		 * @private
		 */
		ROTATION_AXIS: $V([0, 0, 1])
	});
	
}
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

// Includes
Engine.include("/engine.hostobject.js");
Engine.include("/collision/collision.convexhull.js");

Engine.initObject("Object2D", "HostObject", function() {

/**
 * @class An object for use in a 2d environment.  Methods for getting the position, rotation
 * and scale should be implemented within the extended class.
 * 
 * @param name {String} The name of the object
 * @extends HostObject
 * @constructor
 * @description Create a 2d host object
 */
var Object2D = HostObject.extend(/** @scope Object2D.prototype */{

   /** @private */
   zIndex: 1,

   /** @private */
   bBox: null,
	wBox: null,
	lastPosition: null,
	origin: null,
	collisionHull: null,
	
	// Current transformation matrix and the individual matrices for
	// tranlate, rotate, scale, and origin/negative-origin
	txfm: null,
	tMtx: null,
	rMtx: null,
	sMtx: null,
	oMtx: null,
	oMtxN: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name);
      this.lastPosition = Point2D.create(5,5);
		this.bBox = Rectangle2D.create(0,0,1,1);
		this.wBox = Rectangle2D.create(0,0,1,1);
      this.zIndex = 1;
		this.origin = Point2D.create(0,0);
		this.collisionHull = null;
		
		// Initialize the matrices
		this.txfm = Object2D.IDENTITY.dup();
		this.tMtx = Object2D.IDENTITY.dup();
		this.rMtx = Object2D.IDENTITY.dup();
		this.sMtx = Object2D.IDENTITY.dup();
		this.oMtx = Object2D.IDENTITY.dup();
		this.oMtxN = Object2D.IDENTITY.dup();
   },
	
	/**
	 * Destroy the object.
	 */
	destroy: function() {
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
   release: function() {
      this.base();
      this.zIndex = 1;
      this.bBox = null;
		this.lastPosition = null;
		this.collisionHull = null;
		
		// Free the matrices
		this.txfm = null;
		this.tMtx = null;
		this.rMtx = null;
		this.sMtx = null;
		this.oMtx = null;
		this.oMtxN = null;
   },

	/**
	 * Update the transformation matrix which is 
	 * used to transform the collision hull.
	 * @private
	 */
	updateTransform: function() {
		// We only need to update when we have a collision hull (at the moment)
		if (this.collisionHull) {
			// Update the current transformation matrix
			this.txfm = this.tMtx.multiply(this.rMtx).multiply(this.sMtx);
			this.collisionHull.transform(this.txfm);
		}
	},

	/**
	 * Set the render origin of the object.  The render origin is where the object will be
	 * centered around when drawing position and rotation.
	 *  
	 * @param x {Number|Point2D} The X coordinate or the render origin (default: 0,0 - top left corner)
	 * @param y {Number} The Y coordinate or <code>null</code> if X is a <code>Point2D</code>
	 */
	setOrigin: function(x, y) {
		this.origin.set(x, y);
		this.oMtx.setElements([
			[0,0,x],
			[0,1,y],
			[0,0,1]
		]);
		this.oMtxN.setElements([
			[0,0,-x],
			[0,1,-y],
			[0,0,1]
		]);
	},
	
	/**
	 * Get the render origin of the object.
	 * @return {Point2D}
	 */
	getOrigin: function() {
		return this.origin;
	},

   /**
    * Set the bounding box of this object
    *
    * @param width {Number|Rectangle2D} The width, or the rectangle that completely encompasses
    *                           		this object.
    * @param height {Number} If width is a number, this is the height
    */
   setBoundingBox: function(width, height) {
		if (width instanceof Rectangle2D) {
			this.bBox.set(width);
		} else {
			this.bBox.set(0,0,width,height);
		}
   },

   /**
    * Get the bounding box of this object
    * @return {Rectangle2D} The object bounding rectangle
    */
   getBoundingBox: function() {
      return this.bBox;
   },

   /**
    * Get the bounding box in world coordinates.
    * @return {Rectangle2D} The world bounding rectangle
    */
   getWorldBox: function() {
		this.wBox.set(this.getBoundingBox());
		var rPos = Point2D.create(this.getRenderPosition());
		rPos.sub(this.origin);
		this.wBox.offset(rPos);
		rPos.destroy();
      return this.wBox;
   },
   
   /**
    * [ABSTRACT] Get the world bounding circle.
    * @return {Circle2D}
    */
   getCircle: function() {
      // ABSTRACT METHOD
   },
   
	/**
	 * Set the convex hull used for collision.
	 * @param convexHull {ConvexHull} The convex hull object
	 */
	setCollisionHull: function(convexHull) {
		Assert(convexHull instanceof ConvexHull, "setCollisionHull() failed!");
		this.collisionHull = convexHull;	
	},
	
	/**
	 * Get the convex hull used for collision.
	 * @return {ConvexHull}
	 */
	getCollisionHull: function() {
		return this.collisionHull;
	},
	
   /**
    * [ABSTRACT] Get the velocity of the object.
    * @return {Vector2D}
    */
   getVelocity: function() {
      // ABSTRACT METHOD
   },

   /**
    * Store the position of the object in the translation matrix
    * @param point {Point2D} The position of the object
    */
   setPosition: function(point) {
		this.tMtx.setElements([
			[0,0,point.x],
			[0,1,point.y],
			[0,0,1]
		]);
		this.updateTransform();
   },

   /**
    * Get the position of the object.
    * @return {Point2D} The position
    */
   getPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * Get the render position of the object.
    * @return {Point2D}
    */
   getRenderPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * Get the last position the object was rendered at.
    * @return {Point2D}
    */
   getLastPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * Store the rotation of the object in the rotation matrix, accounting for origin
    * @param angle {Number} The rotation angle
    */
   setRotation: function(angle) {
		if (angle != 0) {
			// Move the origin
			this.rMtx = this.oMtx.dup(); 
			// Rotate
			this.rMtx = this.rMtx.multiply(Matrix.Rotation(Math2D.degToRad(angle), Object2D.ROTATION_AXIS));
			// Move the origin back
			this.rMtx = this.rMtx.multiply(this.oMtxN);
		} else {
			// Set to identity
			this.rMtx.setElements([
				[1,0,0],
				[0,1,0],
				[0,0,1]
			]);
		}
		this.updateTransform();
   },

   /**
    * Get the rotation of the object
    * @return {Number}
    */
   getRotation: function() {
      return 0;
   },

   /**
    * Store the scale of the object along the X and Y axis in the scaling matrix
    * @param scaleX {Number} The scale along the X axis
    * @param scaleY {Number} The scale along the Y axis
    */
   setScale: function(scaleX, scaleY) {
		this.sMtx.setElements([
			[scaleX,0,0],
			[0,scaleY,0],
			[0,0,1]
		]);
		this.updateTransform();
   },

   /**
    * Get the uniform scale of the object.
    * @return {Number}
    */
   getScale: function() {
      return 1;
   },

   /**
    * Get the scale of the object along the X axis
    * @return {Number}
    */
   getScaleX: function() {
      return 1;
   },

   /**
    * Get the scale of the object along the Y axis.
    * @return {Number}
    */
   getScaleY: function() {
      return 1;
   },

   /**
    * Set the depth at which this object will render to
    * the context.  The lower the z-index, the further
    * away from the front the object will draw.
    *
    * @param zIndex {Number} The z-index of this object
    */
   setZIndex: function(zIndex) {
      this.zIndex = zIndex;
      if (this.getRenderContext()) {
         this.getRenderContext().sort();
      }
   },

   /**
    * Get the depth at which this object will render to
    * the context.
    *
    * @return {Number}
    */
   getZIndex: function() {
      return this.zIndex;
   },

   /**
    * When editing objects, this method returns an object which
    * contains the properties with their getter and setter methods.
    * @return {Object} The properties object
    */
   getProperties: function() {
      var self = this;
      var prop = this.base(self);
      return $.extend(prop, {
         "ZIndex"       : [function() { return self.getZIndex(); },
                           function(i){   self.setZIndex(i); }, true],
         "BoundingBox"  : [function() { return self.getBoundingBox().toString(); },
                           null, false],
         "WorldBox"     : [function() { return self.getWorldBox().toString(); },
                           null, false],
         "Position"     : [function() { return self.getPosition(); },
                           function(i) { var p = i.split(","); self.setPosition(Point2D.create(p[0],p[1])); }, true],
         "RenderPos"    : [function() { return self.getRenderPosition() },
                           null, false],
         "Rotation"     : [function() { return self.getRotation(); },
                           function(i) { self.setRotation(i); }, true],
         "Scale"        : [function() { return self.getScale(); },
                           function(i) {self.setScale(i,i); }, true]
      });
   }

}, /** @scope Object2D.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "Object2D"
    */
   getClassName: function() {
      return "Object2D";
   },
   
   /**
    * The axis of rotation
    * @private
    */
   ROTATION_AXIS: $V([0,0,1]),
   
   /**
    * The identity matrix
    */
   IDENTITY: $M([
		[1,0,0],
		[0,1,0],
		[0,0,1]
	])
});

return Object2D;

});
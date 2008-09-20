/**
 * The Render Engine
 * Object2D
 *
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

// Includes
Engine.include("/engine/engine.hostobject.js");

Engine.initObject("Object2D", "HostObject", function() {

/**
 * @class An object for use in a 2D environment.  Methods for getting position, rotation
 * and scale should be implemented within the extended class.
 * @extends HostObject
 */
var Object2D = HostObject.extend(/** @scope Object2D.prototype */{

   /** @private */
   zIndex: 1,

   /** @private */
   bBox: null,

   constructor: function(name) {
      this.base(name);
      this.lastPosition = new Point2D(5,5);
      this.zIndex = 1;
   },

   release: function() {
      this.base();
      this.zIndex = 1;
      this.bBox = null;
   },

   /**
    * Set the bounding box of this object
    *
    * @param rect {Rectangle2D} The rectangle that completely encompasses
    *                           this object.
    * @memberOf HostObject
    */
   setBoundingBox: function(rect) {
      this.bBox = rect;
   },

   /**
    * Get the bounding box of this object
    *
    * @type Rectangle2D
    * @memberOf HostObject
    */
   getBoundingBox: function() {
      return this.bBox;
   },

   getWorldBox: function() {
      return new Rectangle2D(this.getBoundingBox()).offset(this.getRenderPosition());
   },

   setPosition: function(point) {
   },

   getPosition: function() {
      return Point2D.ZERO;
   },

   getRenderPosition: function() {
      return Point2D.ZERO;
   },

   getLastPosition: function() {
      return Point2D.ZERO;
   },

   setRotation: function(angle) {
   },

   getRotation: function() {
      return 0;
   },

   setScale: function(scaleX, scaleY) {
   },
	
	getScale: function() {
		return 1;
	},

   getScaleX: function() {
      return 1;
   },

   getScaleY: function() {
      return 1;
   },

   /**
    * Set the depth at which this object will render to
    * the context.  The lower the z-index, the further
    * away from the front the object will draw.
    *
    * @param zIndex {Number} The z-index of this object
    * @memberOf HostObject
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
    * @type Number
    * @memberOf HostObject
    */
   getZIndex: function() {
      return this.zIndex;
   },
	
	getProperties: function() {
		var self = this;
		var prop = this.base(self);
		return $.extend(prop, {
			"ZIndex" 		: [function() { return self.getZIndex(); },
						 			function(i){	self.setZIndex(i); }],
			"BoundingBox" 	: [function() { return self.getBoundingBox().toString(); },
								  	null],
			"WorldBox" 		: [function() { return self.getWorldBox().toString(); }, 
							  		null],
			"Position" 		: [function() { return self.getPosition(); },
							  		function(i) { var p = i.split(","); self.setPosition(Point2D.create(p[0],p[1])); }],
			"RenderPos" 	: [function() { return self.getRenderPosition() }, 
									null],
			"Rotation" 		: [function() { return self.getRotation(); }, 
							  		function(i) { self.setRotation(i); }],
			"Scale" 			: [function() { return self.getScale(); }, 
						  			function(i) {self.setScale(i,i); }]
		});
	}

}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf HostObject
    */
   getClassName: function() {
      return "Object2D";
   }
});

return Object2D;

});
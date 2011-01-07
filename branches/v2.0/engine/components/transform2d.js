/**
 * The Render Engine
 * Transform2DComponent
 *
 * @fileoverview The base 2d transformation component.
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
	"class": "R.components.Transform2D",
	"requires": [
		"R.components.Base",
		"R.math.Math2D",
		"R.math.Point2D",
		"R.math.Vector2D"
	]
});

/**
 * @class A simple component that maintains position, rotation, and scale.
 *
 * @param name {String} The name of the component
 * @param [priority=1.0] {Number} The priority of the component
 * @extends R.components.Base
 * @constructor
 * @description Create a 2d transformation component
 */
R.components.Transform2D = function() {
	return R.components.Base.extend(/** @scope R.components.Transform2D.prototype */{

   position: null,
   rotation: 0,
   scale: null,
   lastPosition: null,
   lastRenderPosition: null,
	worldPos: null,

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, R.components.Base.TYPE_TRANSFORM, priority || 1.0);
      this.position = R.math.Point2D.create(0,0);
		this.worldPos = R.math.Point2D.create(0,0);
      this.lastPosition = R.math.Point2D.create(0,0);
      this.lastRenderPosition = R.math.Point2D.create(0,0);
      this.rotation = 0;
      this.scale = [1.0,1.0];
   },
	
	destroy: function() {
		this.position.destroy();
		this.worldPos.destroy();
		this.lastPosition.destroy();
		this.lastRenderPosition.destroy();
		this.base();
	},

   /**
    * Releases the component back into the object pool. See {@link PooledObject#release} for
    * more information.
    */
   release: function() {
      this.base();
      this.position = null;
      this.rotation = 0;
      this.scale = null;
      this.lastPosition = null;
      this.lastRenderPosition = null;
		this.worldPos = null;
   },

   /**
    * Set the position of the transform.
    *
    * @param point {Point2D} The position
    */
   setPosition: function(point) {
      this.setLastPosition(this.getPosition());
      this.position.set(point);
		this.getHostObject().markDirty();
   },

   /**
    * Returns the position of the transformation relative to the world.
    * @return {Point2D}
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * Returns the position of the transformation relative to the viewport.  If the world is
    * comprised of multiple viewports (wide and/or tall) the render position
    * is relative to the current viewport's position.
    * @return {Point2D}
    */
   getRenderPosition: function() {
		this.worldPos.set(this.getPosition());
		this.worldPos.sub(this.getHostObject().getRenderContext().getWorldPosition());
      return this.worldPos;
   },

   /**
    * Set the last position that the transformation was at.
    *
    * @param point {Point2D} The last position
    */
   setLastPosition: function(point) {
      this.lastPosition.set(point);
   },

   /**
    * Get the last position of the transformation relative to the world.
    * @return {Point2D}
    */
   getLastPosition: function() {
      return this.lastPosition;
   },

   /**
    * Get the last position of the transformation relative to the viewport.
    * @return {Point2D}
    */
   getLastRenderPosition: function() {
      return this.lastRenderPosition;
   },

   /**
    * Set the rotation of the transformation.
    *
    * @param rotation {Number} The rotation
    */
   setRotation: function(rotation) {
      this.rotation = rotation;
		this.getHostObject().markDirty();
   },

   /**
    * Get the rotation of the transformation.
    * @return {Number}
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * Get the rotation of the transformation relative to the viewport.
    * @return {Number}
    */
   getRenderRotation: function() {
      var wR = this.getHostObject().getRenderContext().getWorldRotation();
      return wR + this.getRotation();
   },

   /**
    * Set the scale of the transform.  You can apply a uniform scale by
    * assigning only the first argument a value.  To use a non-uniform scale,
    * use both the X and Y arguments.
    *
    * @param scaleX {Number} The scale of the transformation along the X-axis with 1.0 being 100%
    * @param [scaleY] {Number} The scale of the transformation along the Y-axis. If provided, a 
    *			non-uniform scale can be achieved by using a number which differs from the X-axis.
    */
   setScale: function(scaleX, scaleY) {
   	scaleX = scaleX || 1.0;
      this.scale = [scaleX, scaleY || scaleX];
		this.getHostObject().markDirty();
   },

   /**
    * Get the uniform scale of the transformation.
    * @return {Number}
    */
   getScale: function() {
      return this.getScaleX();
   },

	/**
	 * Get the non-uniform scale along the X-axis of the transformation.
	 * @return {Number}
	 */
	getScaleX: function() {
		return this.scale[0];
	},
	
	/**
	 * Get the non-uniform scale along the Y-axis of the transformation.
	 * @return {Number}
	 */
	getScaleY: function() {
		return this.scale[1];
	},

   /**
    * Get the uniform scale of the transformation relative to the viewport.
    * @return {Number}
    */
   getRenderScale: function() {
//    var wS = this.getHostObject().getRenderContext().getWorldScale();
//      return wS * this.scale;
      return this.scale[0];
   },

   /**
    * Get the uniform scale of the transformation relative to the viewport along the X-axis.
    * @return {Number}
    */
   getRenderScaleX: function() {
//    var wS = this.getHostObject().getRenderContext().getWorldScale();
//      return wS * this.scale;
      return this.scale[0];
   },

   /**
    * Get the uniform scale of the transformation relative to the viewport along the Y-axis.
    * @return {Number}
    */
   getRenderScaleY: function() {
//    var wS = this.getHostObject().getRenderContext().getWorldScale();
//      return wS * this.scale;
      return this.scale[1];
   },

   /**
    * Set the components of a transformation: position, rotation,
    * and scale, within the rendering context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    * @param rendering {Boolean} <tt>true</tt> during the rendering phase
    */
   execute: function(renderContext, time) {
      renderContext.setPosition(this.getRenderPosition());
      renderContext.setRotation(this.getRenderRotation());
      renderContext.setScale(this.getRenderScaleX(), this.getRenderScaleY());
		
      /* pragma:DEBUG_START */
      // Debug the origin
      if (R.Engine.getDebugMode())
      {
			renderContext.setLineWidth(1);
			var up = R.math.Vector2D.create(R.math.Vector2D.UP).mul(10);
			var left = R.math.Vector2D.create(R.math.Vector2D.LEFT).mul(10);
         renderContext.setLineStyle("red");
         renderContext.drawLine(R.math.Point2D.ZERO, up);
         renderContext.setLineStyle("blue");
         renderContext.drawLine(R.math.Point2D.ZERO, left);
			up.destroy();
			left.destroy();
      }
      /* pragma:DEBUG_END */
   }
   
}, /** @scope R.components.Transform2D.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "R.components.Transform2D"
    */
   getClassName: function() {
      return "R.components.Transform2D";
   }
});
}
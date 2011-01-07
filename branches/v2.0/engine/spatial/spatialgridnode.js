/**
 * The Render Engine
 * SpatialGridNode
 *
 * @fileoverview A simple collision model which divides a finite space up into 
 *               a coarse grid to assist in quickly finding objects within that
 *               space.
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.spatial.SpatialGridNode",
	"requires": [
		"R.spatial.AbstractSpatialNode"
	]
});

/**
 * @class A single node within a SpatialGrid.  When the collision model is
 *        updated, the nodes within the grid will be updated to reflect the
 *        objects within them.  A node defines a single rectangle within the
 *        entire {@link SpatialGrid}
 *
 * @extends SpatialNode
 * @constructor
 * @description Create an instance of a SpatialNode for use within a {@link SpatialGrid}
 * @param rect {Rectangle2D} The rectangle which defines this node.
 */
R.spatial.SpatialGridNode = function(){
	return R.spatial.AbstractSpatialNode.extend(/** @scope R.spatial.SpatialGridNode.prototype */{
	
		rect: null,
		
		/**
		 * @private
		 */
		constructor: function(rect){
			this.base();
			this.rect = rect;
		},
		
		/**
		 * Get the rectangle which defines this node.
		 * @return {Rectangle2D}
		 */
		getRect: function(){
			return this.rect
		},
		
		/**
		 * Returns true if the spatial node contains the point specified.
		 * @param point {Point2D} The point to check
		 * @return {Boolean}
		 */
		contains: function(point){
			return this.getRect().containsPoint(point);
		}
		
	}, /** @scope R.spatial.SpatialGridNode.prototype */ {
	
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.spatial.SpatialGridNode"
		 */
		getClassName: function(){
			return "R.spatial.SpatialGridNode";
		}
		
	});
	
}
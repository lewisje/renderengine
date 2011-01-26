/**
 * The Render Engine
 * AbstractSpatialNode
 *
 * @fileoverview Spatial containers maintain a collection of objects and can report
 *               on potential objects within a defined space of that container.
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
	"class": "R.spatial.AbstractSpatialNode",
	"requires": [
		"R.struct.Container"
	]
});

/**
 * @class A single node within a spatial container.  Has an index for fast node
 *        comparisons, and a list of objects contained within the node.
 *
 * @constructor
 * @description Creates a spatial node
 */
R.spatial.AbstractSpatialNode = function(){
	return Base.extend(/** @scope R.spatial.AbstractSpatialNode.prototype */{
	
		idx: 0,
		objects: null,
		dirty: null,
		
		/** @private */
		constructor: function(){
			this.idx = R.spatial.AbstractSpatialNode.NODE_INDEX++;
			this.objects = R.struct.Container.create();
			this.dirty = true;
		},
		
		/**
		 * Get the unique index of this node.
		 * @return {Number} The index of this node
		 */
		getIndex: function(){
			return this.idx;
		},
		
		/**
		 * Returns <code>true</code> if the node is dirty (has been modified)
		 * @return {Boolean}
		 */
		isDirty: function() {
			return this.dirty;
		},
		
		/**
		 * Clear the dirty flag after the node has been processed.
		 */
		clearDirty: function() {
			this.dirty = false;
		},
		
		/**
		 * Get a Container which is all objects within this node.
		 * @return {R.struct.Container} Objects in the node
		 */
		getObjects: function(){
			return this.objects.clone();
		},
		
		/**
		 * Get the count of objects within the node.
		 * @return {Number}
		 */
		getCount: function(){
			return this.objects.size();
		},
		
		/**
		 * Add an object to this node.
		 *
		 * @param obj {R.engine.BaseObject} The object to add to this node.
		 */
		addObject: function(obj){
			this.objects.add(obj);
			this.dirty = true;
		},
		
		/**
		 * Remove an object from this node
		 *
		 * @param obj {R.object.BaseObject} The object to remove from this node
		 */
		removeObject: function(obj){
			this.objects.remove(obj);
			this.dirty = true;
		},
		
		/**
		 * Returns true if the spatial node contains the point specified.
		 * @param point {R.math.Point2D} The point to check
		 * @return {Boolean}
		 */
		contains: function(point){
			return false;
		}
		
	}, /** @scope R.spatial.AbstractSpatialNode.prototype */ {
	
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.spatial.AbstractSpatialNode"
		 */
		getClassName: function(){
			return "R.spatial.AbstractSpatialNode";
		},
		
		/** @private */
		resolved: function() {
			R.spatial.AbstractSpatialNode.NODE_INDEX = 1;	
		},
		
		/** @private */
		NODE_INDEX: null
	});
}
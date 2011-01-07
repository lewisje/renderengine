/**
 * The Render Engine
 * AbstractSpatialContainer
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
	"class": "R.spatial.AbstractSpatialContainer",
	"requires": [
		"R.engine.BaseObject",
		"R.struct.Container"
	]
});

/**
 * @class An abstract class to represent spatial containers.  Spatial containers
 *        contain game-world objects and can report on potential objects within a defined
 *        space of that container.
 *
 * @param name {String} The name of the container
 * @param width {Number} The width of the container
 * @param height {Number} The height of the container
 * @extends BaseObject
 * @constructor
 * @description Create a spatial container
 */
R.spatial.AbstractSpatialContainer = function(){
	return R.engine.BaseObject.extend(/** @scope R.spatial.AbstractSpatialContainer.prototype */{
	
		root: null,
		width: 0,
		height: 0,
		pcl: null,
		
		/**
		 * @private
		 */
		constructor: function(name, width, height){
			this.base(name || "SpatialContainer");
			this.width = width;
			this.height = height;
			this.pcl = R.struct.Container.create();
		},
		
		/**
		 * @private
		 */
		release: function(){
			this.base();
			this.root = null;
			this.width = 0;
			this.height = 0;
			this.pcl = null;
		},
		
		/**
		 * Get the width of the container.
		 * @return {Number} The width
		 */
		getWidth: function(){
			return this.width;
		},
		
		/**
		 * Get the height of the container.
		 * @return {Number} The height
		 */
		getHeight: function(){
			return this.height;
		},
		
		/**
		 * Get the root of the container.
		 * @return {Object} The root
		 */
		getRoot: function(){
			return this.root;
		},
		
		/**
		 * Set the root of the container.
		 *
		 * @param root {Object} The root object of this container
		 */
		setRoot: function(root){
			this.root = root;
		},
		
		/**
		 * [ABSTRACT] Find the node that contains the specified point.
		 *
		 * @param point {Point2D} The point to locate the node for
		 * @return {SpatialNode}
		 */
		findNodePoint: function(point){
			return null;
		},
		
		/**
		 * Add an object to the node which corresponds to the position
		 * provided.  Adding an object at a specific point will remove it from whatever
		 * node it was last in.
		 *
		 * @param obj {BaseObject} The object to add to the collision model
		 * @param point {Point2D} The world position where the object is
		 */
		addObject: function(obj, point){
			// See if the object is already in a node and remove it
			var oldNode = this.getObjectSpatialData(obj, "lastNode");
			if (oldNode != null) {
				if (!oldNode.contains(point)) {
					// The node is no longer in the same node
					oldNode.removeObject(obj);
				}
				else {
					// The object hasn't left the node
					return;
				}
			}
			
			// Find the node by position and add the object to it
			var node = this.findNodePoint(point);
			if (node != null) {
				node.addObject(obj);
				
				// Update the collision data on the object
				this.setObjectSpatialData(obj, "lastNode", node);
			}
		},
		
		/**
		 * Get the spatial model data for the object.  If <tt>key</tt> is provided, only the
		 * data for <tt>key</tt> will be returned.  If the data has not yet been assigned,
		 * an empty object will be created to contain the data.
		 *
		 * @param obj {BaseObject} The object which has the data
		 * @param [key] {String} Optional key which contains the data, or <tt>null</tt> for the
		 * 	entire data model.
		 */
		getObjectSpatialData: function(obj, key){
			var mData = obj.getObjectDataModel(R.spatial.AbstractSpatialContainer.DATA_MODEL);
			if (mData == null) {
				obj.setObjectDataModel(R.spatial.AbstractSpatialContainer.DATA_MODEL, {});
				mData = obj.getObjectDataModel(R.spatial.AbstractSpatialContainer.DATA_MODEL);
			}
			return key ? mData[key] : mData;
		},
		
		/**
		 * Set a key, within the object's spatial data model, to a specific value.
		 *
		 * @param obj {BaseObject} The object to receive the data
		 * @param key {String} The key to set the data for
		 * @param value {Object} The value to assign to the key
		 */
		setObjectSpatialData: function(obj, key, value){
			var mData = this.getObjectSpatialData(obj);
			mData[key] = value;
		},
		
		/**
		 * Clear all of the spatial container model data.
		 *
		 * @param obj {BaseObject} The object which has the data model
		 */
		clearObjectSpatialData: function(obj){
			obj.setObjectDataMode(R.spatial.AbstractSpatialContainer.DATA_MODEL, null);
		},
		
		/**
		 * Remove an object from the collision model.  This is done so collisions are
		 * no longer checked against this object.
		 *
		 * @param obj {BaseObject} The object to remove
		 */
		removeObject: function(obj){
			var oldNode = this.getObjectSpatialData(obj, "lastNode");
			if (oldNode != null) {
				oldNode.removeObject(obj);
			}
			obj[R.spatial.AbstractSpatialContainer.DATA_MODEL] = null;
		},
		
		/**
		 * Returns a potential collision list of objects that are contained
		 * within the defined sub-space of the container.
		 *
		 * @param point {Point2D} The point to build with
		 * @return {Container} The PCL
		 */
		getPCL: function(point){
			return this.pcl;
		},
		
		/**
		 * Returns all objects within the spatial container.
		 * @return {Container} A container of all objects in the container
		 */
		getObjects: function(){
			return Container.create();
		},
		
		/**
		 * Returns all objects within the spatial container of a particular
		 * class type.
		 * @return {Array} An array of objects in the container, filtered by class
		 */
		getObjectsOfType: function(clazz){
			return this.getObjects().filter(function(obj){
				return clazz.isInstance(obj);
			}, this);
		}
		
	}, /** @scope R.spatial.AbstractSpatialContainer.prototype */ {
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.spatial.AbstractSpatialContainer"
		 */
		getClassName: function(){
			return "R.spatial.AbstractSpatialContainer";
		},
		
		/**
		 * @private
		 */
		DATA_MODEL: "SpatialContainer"
	
	});
	
}
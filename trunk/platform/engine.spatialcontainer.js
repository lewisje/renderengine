/**
 * The Render Engine
 * SpatialContainer
 *
 * @fileoverview Spatial containers maintain a collection objects and can report
 *               on potential objects within a defined space of that container.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

/**
 * An index assigned to a node.
 * @private
 */
Engine.NodeIndex = 1;

/**
 * @class A single node within a spatial container.  Has an index for fast node
 *        comparisons, and a list of objects contained within the node.
 */
var SpatialNode = Base.extend(/** @scope SpatialNode.prototype */{

   idx: 0,

   objects: null,

   constructor: function() {
      this.idx = Engine.NodeIndex++;
      this.objects = [];
   },

   /**
    * Get the unique index of this node.
    * @type Number
    */
   getIndex: function() {
      return this.idx;
   },

   /**
    * Get an array of objects within this node.
    * @type Array
    */
   getObjects: function() {
      return this.objects;
   },

   /**
    * Add an object to this node.
    *
    * @param obj {BaseObject} The object to add to this node.
    */
   addObject: function(objId) {
      this.objects.push(objId);
   },

   /**
    * Remove an object from this node
    *
    * @param obj {BaseObject} The object to remove from this node
    */
   removeObject: function(obj) {
      EngineSupport.arrayRemove(this.objects, obj);
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Container
    */
   getClassName: function() {
      return "SpatialNode";
   }

});

/**
 * @class An abstract class to represent spatial containers.  Spatial containers
 *        contain objects and can report on potential objects within a defined
 *        space of that container.
 *
 * @param name {String} The name of the container
 * @param width {Number} The width of the container
 * @param height {Number} The height of the container
 * @extends BaseObject
 */
var SpatialContainer = BaseObject.extend(/** @scope SpatialContainer.prototype */{

   root: null,

   width: 0,

   height: 0,

   constructor: function(name, width, height) {
      this.base(name || "SpatialContainer");
      this.width = width;
      this.height = height;
   },

   release: function() {
      this.base();
      this.root = null;
      this.width = 0;
      this.height = 0;
   },

   /**
    * Get the width of the container.
    * @type Number
    */
   getWidth: function() {
      return this.width;
   },

   /**
    * Get the height of the container.
    * @type Number
    */
   getHeight: function() {
      return this.height;
   },

   /**
    * Get the root of the container.
    * @type Object
    */
   getRoot: function() {
      return this.root;
   },

   /**
    * Set the root of the container.
    *
    * @param root {Object} The root object of this container
    */
   setRoot: function(root) {
      this.root = root;
   },

   /**
    * Returns a potential collision list of objects that are contained
    * within the defined sub-space of the container.
    *
    * @param point {Point2D} The point to build with
    * @type HashContainer
    */
   getPCL: function(point) {
      return new HashContainer();
   }

}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Container
    */
   getClassName: function() {
      return "SpatialContainer";
   }

});
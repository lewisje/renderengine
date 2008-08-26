/**
 * The Render Engine
 *
 * @fileoverview A set of objects which can be used to create a collection
 *               of objects, and to iterate over a container.
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
Engine.include("/platform/engine.pooledobject.js");
Engine.include("/platform/engine.baseobject.js");

Engine.initObject("Iterator", "PooledObject", function() {

/**
 * @class Create an iterator over a {@link Container} instance.
 *
 * @param container {Container} The container to iterate over.
 */
var Iterator = PooledObject.extend(/** @scope Iterator.prototype */{

   idx: 0,

   c: null,

   objs: null,

   constructor: function(container) {
      this.base("Iterator");
      this.idx = 0;
      this.c = container;

      // Duplicate the elements in the container
      this.objs = new Array().concat(container.getObjects());
   },

   release: function() {
      this.base();
      this.idx = 0;
      this.c = null;
      this.objs = null;
   },

   /**
    * Reverse the order of the elements in the container (non-destructive) before
    * iterating over them.  You cannot call this method after you have called {@link #next}.
    */
   reverse: function() {
      if (this.idx != 0) {
         throw new Error("Cannot reverse Iterator after calling next()");
      }
      this.objs.reverse();
   },

   /**
    * Get the next element from the iterator.
    * @type Object
    */
   next: function() {
      if (this.idx < this.c.size())
      {
         return this.objs[this.idx++];
      }
      throw new Error("Index out of range");
   },

   /**
    * Returns <tt>true</tt> if the iterator has more elements.
    * @type Boolean
    */
   hasNext: function() {
      return (this.idx < this.c.size());
   }

}, /** @scope Iterator */{
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Iterator";
   }
});

return Iterator;

});

Engine.initObject("Container", "BaseObject", function() {

/**
 * @class A container is a logical collection of objects.  A container
 * is responsible for maintaining the list of objects within it.
 * When a container is destroyed, all objects within the container
 * are destroyed with it.
 *
 * @param {String} The name of the container. Default: Container
 * @extends BaseObject
 */
var Container = BaseObject.extend(/** @scope Container.prototype */{

   objects: null,

   constructor: function(containerName) {
      this.base(containerName || "Container");
      this.objects = [];
   },

   release: function() {
      this.base();
      this.objects = null;
   },

   /**
    * Destroy all objects contained within this object.  Calls the
    * <tt>destroy()</tt> method on each object, giving them a chance
    * to perform clean up operations.
    */
   destroy: function() {
      this.cleanUp();
      this.base();
   },

   /**
    * Returns the count of the number of objects within the
    * container.
    *
    * @type Number
    */
   size: function() {
      return this.objects.length;
   },

   /**
    * Add an object to the container.
    *
    * @param obj {BaseObject} The object to add to the container.
    */
   add: function(obj) {
      this.objects.push(obj);
      Console.log("Added ", obj.getId(), "[", obj, "] to ", this.getId(), "[", this, "]");
   },

   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {BaseObject} The object to remove from the container.
    */
   remove: function(obj) {
      Console.log("Removed ", obj.getId(), "[", obj, "] from ", this.getId(), "[", this, "]");
      EngineSupport.arrayRemove(this.objects, obj);
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return The object removed from the container.
    * @type BaseObject
    */
   removeAtIndex: function(idx) {
      Assert((idx >= 0 && idx < this.size()), "Index of out range in Container");

      var obj = this.objects[idx];

      Console.log("Removed ", obj.getId(), "[", obj, "] from ", this.getId(), "[", this, "]");
      this.objects.splice(idx, 1);

      return obj;
   },

   /**
    * Get the object at the index specified. If the container has been
    * sorted, objects might not be in the position you'd expect.
    *
    * @param idx {Number} The index of the object to get
    * @type BaseObject
    */
   get: function(idx) {
      return this.objects[idx];
   },

   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed, only removed from this container.
    */
   clear: function() {
      this.objects.length = 0;
   },

   /**
    * Remove and destroy all objects from the container.
    */
   cleanUp: function() {
      while(this.objects.length > 0)
      {
         var o = this.objects.shift();
         o.destroy();
      }
      this.clear();
   },

   /**
    * Get the array of objects within this container.
    *
    * @type Array
    */
   getObjects: function() {
      return this.objects;
   },

   /**
    * Sort the objects within the container, using the provided function.
    * The function will be provided object A and B.  If the result of the
    * function is less than zero, A will be sorted before B.  If the result is zero,
    * A and B retain their order.  If the result is greater than zero, A will
    * be sorted after B.
    *
    * @param fn {Function} The function to sort with.
    */
   sort: function(fn) {
      Assert((fn != null), "A function must be provided to sort the Container");
      Console.log("Sorting ", this.getName(), "[" + this.getId() + "]");
      this.objects.sort(fn);
   }

}, /** @scope Container */{
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Container";
   }
});

return Container;

});

Engine.initObject("HashContainer", "Container", function() {

/**
 * @class A hash container is a logical collection of objects.  A hash container
 * is a container with a backing object for faster lookups.  Objects within
 * the container must have unique names. When a container is destroyed, all
 * objects within the container are destroyed with it.
 * @extends BaseObject
 */
var HashContainer = Container.extend(/** @scope HashContainer.prototype */{

   objHash: null,

   /**
    * Create an instance of a container object.
    *
    * @param {String} The name of the container. Default: Container
    * @constructor
    */
   constructor: function(containerName) {
      this.base(containerName || "HashContainer");
      this.objHash = {};
   },

   release: function() {
      this.base();
      this.objHash = null;
   },

   /**
    * Returns <tt>true</tt> if the object name is already in
    * the hash.
    *
    * @param name {String} The name of the hash to check
    * @type Boolean
    */
   isInHash: function(key) {
      return (this.objHash["_" + String(key)] != null);
   },

   /**
    * Add an object to the container.
    *
    * @param key {String} The name of the object to store.  Names must be unique
    *                      or the object with that name will be overwritten.
    * @param obj {BaseObject} The object to add to the container.
    */
   add: function(key, obj) {
      AssertWarn(!this.isInHash(key), "Object already exists within hash!");

      // Some keys weren't being accepted (like "MOVE") so added
      // an underscore to prevent keyword collisions
      this.objHash["_" + String(key)] = obj;
      this.base(obj);
   },

   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {BaseObject} The object to remove from the container.
    */
   remove: function(obj) {
      for (var o in this.objHash)
      {
         if (this.objHash[o] === obj)
         {
            this.removeHash(o);
            break;
         }
      }

      this.base(obj);
   },

   /**
    * Remove the object with the given name from the hash.
    *
    * @param name {String} The object to remove
    * @return the object removed from the hash
    * @type BaseObject
    */
   removeHash: function(key) {
      var obj = this.objHash["_" + String(key)];
      delete this.objHash["_" + String(key)];

      return obj;
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return The object removed from the container.
    * @type BaseObject
    */
   removeAtIndex: function(idx) {
      var obj = this.base(idx);
      for (var o in this.objHash) {
         if (this.objHash[o] === obj) {
            this.removeHash(o);
            break;
         }
      }

      return obj;
   },

   /**
    * If a number is provided, the request will be passed to the
    * base object, otherwise a name is assumed and the hash will
    * be retrieved.
    *
    * @param idx {Number/String} The index or hash of the object to get
    * @type BaseObject
    */
   get: function(idx) {
      if (typeof idx == 'string')
      {
         return this.objHash["_" + String(idx)];
      }
      else
      {
         return this.base(idx);
      }
   },

   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed.
    * @memberOf Container
    */
   clear: function() {
      this.base();
      this.objHash = {};
   },

   /**
    * Cleans up the references to the objects (destroys them) within
    * the container.
    */
   cleanUp: function() {
      this.base();
      this.clear();
   }

}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Container
    */
   getClassName: function() {
      return "HashContainer";
   }
});

return HashContainer;

});
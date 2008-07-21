/**
 * The Render Engine
 * HashContainer
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

   cleanUp: function() {
		this.base();
		this.clear();
	},

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
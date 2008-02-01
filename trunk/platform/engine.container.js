/**
 * The Render Engine
 * Container
 *
 * A container is a logical collection of objects.  A container
 * is responsible for maintaining the list of objects within it.
 * When a container is destroyed, all objects within the container
 * are destroyed with it.
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

var Container = BaseObject.extend({

   objects: null,

   /**
    * Create an instance of a container object.
    *
    * @param {String} The name of the container. Default: Container
    */
   constructor: function(containerName) {
      this.base(containerName || "Container");
      this.objects = [];
   },

   /**
    * Destroy all objects contained within this object.
    */
   destroy: function() {
      while(this.objects.length > 0)
      {
         var o = this.objects.shift();
         o.destroy();
      }
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
      Console.log("Added " + obj.getId() + " to " + this.getId());
   },

   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {BaseObject} The object to remove from the container.
    */
   remove: function(obj) {
      Console.log("Removed " + obj.getId() + " from " + this.getId());
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

      Console.log("Removed " + obj.getId() + " from " + this.getId());
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
    * destroyed.
    */
   clear: function() {
      this.objects.length = 0;
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
      Console.log("Sorting " + this.getClassName() + " [" + this.getId() + "]");
      this.objects.sort(fn);
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Container";
   },

   toString: function() {
      var s = this.base() + " (\n";
      for (var o in this.objects) {
         s += this.objects[o].toString() + "\n";
      }
      return s + ")";
   }
});
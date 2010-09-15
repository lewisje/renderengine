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
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("Iterator", "PooledObject", function() {

/**
 * @class Create an iterator over a {@link Container} instance. An
 * iterator is a convenient object to traverse the list of objects
 * within the container.  If the backing <code>Container</code> is
 * modified, the <code>Iterator</code> will reflect these changes.
 * <p/>
 * The simplest way to traverse the list is as follows:
 * <pre>
 * for (var itr = Iterator.create(containerObj); itr.hasNext(); ) {
 *    // Get the next object in the container
 *    var o = itr.next();
 *    
 *    // Do something with the object
 *    o.doSomething();
 * }
 * 
 * // Destroy the iterator when done
 * itr.destroy();
 * </pre>
 * The last step is important so that you're not creating a lot
 * of objects, especially if the iterator is used repeatedly.
 * Since the iterator is a pooled object, it will be reused.
 *
 * @param container {Container} The container to iterate over.
 * @constructor
 * @extends PooledObject
 * @description Create an iterator over a collection
 */
var Iterator = PooledObject.extend(/** @scope Iterator.prototype */{

   c: null,
	p: null,
	r: false,

   /**
    * @private
    */
   constructor: function(container) {
      this.base("Iterator");
      this.idx = 0;
      this.c = container;
		this.p = container._head;
		this.r = false;
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.c = null;
		this.p = null;
		this.r = false;
   },

   /**
    * Reverse the order of the elements in the container (non-destructive) before
    * iterating over them.  You cannot call this method after you have called {@link #next}.
    */
   reverse: function() {
      Assert(this.p === this.c.head, "Cannot reverse Iterator after calling next()");
      this.r = true;
		this.p = this.c._tail;
   },

   /**
    * Get the next element from the iterator.
    * @return {Object} The next element in the iterator
    * @throws {Error} An error if called when no more elements are available
    */
   next: function() {
		var o = this.p.ptr;
		while (this.p != null && this.p.ptr.isDestroyed()) {
			// Skip destroyed objects
			this.p = (this.r ? this.p.prev : this.p.next);
			o = this.p.ptr; 
		}

		this.p = (this.r ? this.p.prev : this.p.next);
		if (o != null) {
         return o;
      } else {
	      throw new Error("Index out of range");
		}
   },

   /**
    * Returns <tt>true</tt> if the iterator has more elements.
    * @return {Boolean}
    */
   hasNext: function() {
		var o = null;
		if (this.c && !this.c.isDestroyed()) {
			o = this.p;
			while (o != null && o.ptr != null && o.ptr.isDestroyed()) {
				o = (this.r ? this.p.prev : this.p.next);
			}
		}
      return o != null;
   }

}, /** @scope Iterator.prototype */{ 
   /**
    * Get the class name of this object
    *
    * @return {String} "Iterator"
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
 *        is responsible for maintaining the list of objects within it.
 *        When a container is destroyed, none of the objects within the container
 *        are destroyed with it.  If the objects must be destroyed, call
 *        {@link #cleanUp}.  A container is a doubly linked list of objects
 *        to all for objects to be added and removed without disrupting the
 *        structure of the list.
 *
 * @param containerName {String} The name of the container
 * @extends BaseObject
 * @constructor
 * @description Create a container.
 */
var Container = BaseObject.extend(/** @scope Container.prototype */{

   _head: null,
	_tail: null,
	sz: 0,

   /**
    * @private
    */
   constructor: function(containerName) {
      this.base(containerName || "Container");
      this._head = null;
		this._tail = null;
		this.sz = null;
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this._head = null;
		this._tail = null;
		this.sz = 0;
   },

   /**
    * Clears the container, however, all of the objects within the container
    * are not destroyed automatically.  This is to prevent the early clean up of
    * objects which are being used by a transient container.
    */
   destroy: function() {
      this.clear();
      this.base();
   },

   /**
    * Returns the count of the number of objects within the
    * container.
    *
    * @return {Number} The number of objects in the container
    */
   size: function() {
      return this.sz;
   },

	/**
	 * Create a new node for the list
	 * @param obj {Object} The object
	 * @private
	 */
	_new: function(obj) {
		var o = {
			prev: null,
			next: null,
			ptr: obj
		};
		return o;
	},
	
	/**
	 * Find the list node at the given index.  No bounds checking
	 * is performed with this function.
	 * @param idx {Number} The index where the item exists
	 * @param offset {Object} The object to start at, "head" if null
	 * @private
	 */
	_find: function(idx, offset) {
		var n = offset || this._head, c = idx;
		while ( n != null && c-- > 0) {
			n = n.next;
		}
		return (c > 0 ? null : n);
	},
	
	/**
	 * Look through the list to find the given object.  If the object is
	 * found, the  list node is returned.  If no object is found, the method
	 * returns <code>null</code>.
	 * 
	 * @param obj {Object} The object to find
	 * @private
	 */
	_peek: function(obj) {
		var n = this._head;
		while (n != null) {
			if (n.ptr === obj) {
				return n;
			}
			n = n.next;
		}
		return null;
	},

   /**
    * Add an object to the container.
    *
    * @param obj {Object} The object to add to the container.
    */
   add: function(obj) {
		var n = this._new(obj);
		if (this._head == null && this._tail == null) {
			this._head = n;
			this._tail = n;
		} else {
			this._tail.next = n;
			n.prev = this._tail;
			this._tail = n;
		}

      if (obj.getId) {
         Console.log("Added ", obj.getId(), "[", obj, "] to ", this.getId(), "[", this, "]");
      }
		this.sz++;
   },
	
	/**
	 * Add all of the objects in the container or array to this container, at the end
	 * of this container.  If "arr" is a container, the head of "arr" is joined to the
	 * tail of this, resulting in a very fast operation.  Because this method, when
	 * performed on a container, is just joining the two lists, no duplication of
	 * elements from the container is performed.  As such, removing elements from the
	 * new container will affect this container as well.
	 * 
	 * @param arr {Container|Array} A container or array of objects
	 */
	addAll: function(arr) {
		if (Container.isInstance(arr)) {
			if (this._head == null && this._tail == null) {
				// This container is empty
				var nh = this._new(arr._head.ptr);
				nh.next = arr._head.next;
				var nt = this._new(arr._tail.ptr);
				nt.prev = arr._tail.prev;
				this._head = nh;
				this._tail = nt;
				this.sz = arr.size();
			} else {
				var nn = this._new(arr._head.ptr);
				nn.prev = this._tail;
				nn.next = arr._head.next;
				
				var nt = this._new(arr._tail.ptr);
				nt.prev = arr._tail.prev;
				
				this._tail.next = nn;
				this._tail = nt;
				this.sz += arr.size();	
			}
		} else {
			for (var i in arr) {
				this.add(arr[i]);
			}
			this.sz += arr.length;
		}
	},

   /**
    * Insert an object into the container at the given index. Asserts if the
    * index is out of bounds for the container.  The index must be greater than
    * or equal to zero, and less than or equal to the size of the container minus one.
    * The effect is to extend the length of the container by one.
    * 
    * @param index {Number} The index to insert the object at.
    * @param obj {Object} The object to insert into the container
    */
   insert: function(index, obj) {
      Assert(!(index < 0 || index > this.size()), "Index out of range when inserting object!");
		var o = this._find(index);
		var n = this._new(obj);
		
		n.prev = o.prev;
		n.prev.next = n;
		n.next = o;
		o.prev = n;
		this.sz++;
   },
   
   /**
    * Replaces the given object with the new object.  If the old object is
    * not found, no action is performed.
    * 
    * @param oldObj {Object} The object to replace
    * @param newObj {Object} The object to put in place
    * @return {Object} The object which was replaced
    */
   replace: function(oldObj, newObj) {
		var o = this._peek(oldObj), r = null;
		if (o.ptr != null) {
			r = o.ptr;
			o.ptr = newObj;		
		}
      return r;      
   },
   
   /**
    * Replaces the object at the given index, returning the object that was there
    * previously. Asserts if the index is out of bounds for the container.  The index 
    * must be greater than or equal to zero, and less than or equal to the size of the 
    * container minus one.
    * 
    * @param index {Number} The index at which to replace the object
    * @param obj {Object} The object to put in place
    * @return {Object} The object which was replaced
    */
   replaceAt: function(index, obj) {
      Assert(!(index < 0 || index > this.size()), "Index out of range when inserting object!");
		var o = this._find(index);
		var r = o.ptr;
		o.ptr = obj;
      return r;      
   },
   
   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {Object} The object to remove from the container.
    * @return {Object} The object that was removed
    */
   remove: function(obj) {
		var o = this._peek(obj);
		//AssertWarn(o != null, "Removing object from collection which is not in collection");
		
		if (o != null) {
			if (o === this._head && o === this._tail) {
				this.clear();
				this.sz = 0;
				return;	
			}

			if (o === this._head) {
				this._head = o.next;
				if (this._head == null) {
					this.clear();
					this.sz = 0;
					return;
				}
			}
			
			if (o === this._tail) {
				this._tail = o.prev;
			}

			if (o.next) o.next.prev = o.prev;
			if (o.prev) o.prev.next = o.next;
			o.prev = o.next = null;
			this.sz--;

	      if (obj.getId) {
	         Console.log("Removed ", obj.getId(), "[", obj, "] from ", this.getId(), "[", this, "]");
	      }

			return o.ptr;		
		}
		return null;
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return {Object} The object removed from the container.
    */
   removeAtIndex: function(idx) {
      Assert((idx >= 0 && idx < this.size()), "Index of out range in Container");

		var o = this._find(idx);
		if (o === this._head) {
			this._head = o.next;
		}
		if (o === this.tail) {
			this._tail = o.prev;
		}
		if (o.next) o.next.prev = o.prev;
		if (o.prev) o.prev.next = o.next;
		o.prev = o.next = null;
		var r = o.ptr;
		
      Console.log("Removed ", r.getId(), "[", r, "] from ", this.getId(), "[", this, "]");
		this.sz--;
      return r;
   },

	/**
	 * Reduce the container so that it's length is the specified length.  If <code>length</code>
	 * is larger than the size of this container, no operation is performed.  Setting <code>length</code>
	 * to zero is effectively the same as calling {@link #clear}.  Objects which would logically
	 * fall after <code>length</code> are not automatically destroyed.
	 * 
	 * @param length {Number} The maximum number of elements
	 * @return {Container} The subset of elements being removed
	 */
	reduce: function(length) {
		var sz = this.size();
		if (length >= sz) {
			return Container.create();
		}	
		
		var subset = this.subset(sz - length, sz);
		if (length == 0) {
			// Dump everything
			this.clear();
		} else {
			var o = this._find(length - 1);
			o.next = null;
			this._tail = o;
		}
		this.sz = length;
		return subset;		
	},

	/**
	 * A new <code>Container</code> which is a subset of the current container
	 * from the starting index (inclusive) to the ending index (exclusive).  Modifications
	 * made to the objects in the subset will affect this container's objects.
	 *  
	 * @param start {Number} The starting index in the container
	 * @param end {Number} The engine index in the container
	 * @return {Container} A subset of the container.
	 */
	subset: function(start, end) {
		var c = Container.create();
		var s = this._find(start);
		var e = this._find((end - start) - 1, s);
		c._head = this._new(s.ptr);
		c._head.next = s.next;
		c._tail = this._new(e.ptr);
		c._tail.prev = e.prev;
		return c;
	},

   /**
    * Get the object at the index specified. If the container has been
    * sorted, objects might not be in the position you'd expect.
    *
    * @param idx {Number} The index of the object to get
    * @return {Object} The object at the index within the container
    * @throws {Error} Index out of bounds if the index is out of the list of objects
    */
   get: function(idx) {
      if (idx < 0 || idx > this.size()) {
         throw new Error("Index out of bounds");
      }
		return this._find(idx).ptr;
   },
	
	/**
	 * Get an array of all of the objects in this container.
	 * @return {Array} An array of all of the objects in the container
	 */
	getAll: function() {
		var a = [], i = this.iterator();
		while (i.hasNext()) {
			a.push(i.next());
		}
		i.destroy();
		return a;
	},

	/**
	 * For each object in the container, the function will be executed.
	 * The function takes one argument: the object being processed.
	 * Unless otherwise specified, <code>this</code> refers to the container.
	 * 
	 * @param fn {Function} The function to execute for each object
	 * @param [thisp] {Object} The object to use as <code>this</code> inside the function
	 */
	forEach: function(fn, thisp) {
		var itr = this.iterator();
		while (itr.hasNext()) {
			fn.call(thisp || this, itr.next());
		}
		itr.destroy();
	},
	
	/**
	 * Filters the container with the function, returning a new <code>Container</code>
	 * with the objects that pass the test in the function.  If the object should be
	 * included in the new <code>Container</code>, the function should return <code>true</code>.
	 * The function takes one argument: the object being processed.
	 * Unless otherwise specified, <code>this</code> refers to the container.
	 * 
	 * @param fn {Function} The function to execute for each object
	 * @param [thisp] {Object} The object to use as <code>this</code> inside the function
	 * @return {Container}
	 */
	filter: function(fn, thisp) {
		var arr = EngineSupport.filter(this.getAll(), fn, thisp || this);
		var c = Container.create();
		c.addAll(arr);
		return c;		
	},
	
   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed, only removed from this container.
    */
   clear: function() {
		this._head = null;
		this._tail = null;
		this.sz = 0;
   },

   /**
    * Remove and destroy all objects from the container.
    */
   cleanUp: function() {
		var a = this.getAll(), h = a.shift();
		while ((h = a.shift()) != null) {
			if (h.destroy) {
				h.destroy();
			}
		}
      this.clear();
   },

   /**
    * Get the array of all objects within this container.  If a filtering
    * function is provided, only objects matching the filter will be
    * returned from the object collection.
    * <p/>
    * The filter function needs to return <tt>true</tt> for each element
    * that should be contained in the filtered set.  The function will be
    * passed the following arguments:
    * <ul>
    * <li>element - The array element being operated upon</li>
    * <li>index - The index of the element in the array</li>
    * <li>array - The entire array of elements in the container</li>
    * </ul>
    * Say you wanted to filter a host objects components based on a
    * particular type.  You might do something like the following:
    * <pre>
    * var logicComponents = host.getObjects(function(el, idx) {
    *    if (el.getType() == BaseComponent.TYPE_LOGIC) {
    *       return true;
    *    }
    * });
    * </pre>
    *
    * @param filterFn {Function} A function to filter the set of
    *                 elements with.  If you pass <tt>null</tt> the
    *                 entire set of objects will be returned.
    * @return {Array} The array of filtered objects
    */
   getObjects: function(filterFn) {
		var a = this.getAll();
      if (filterFn) {
         return EngineSupport.filter(a, filterFn);
      } else {
         return a;
      }
   },

   /**
    * Sort the objects within the container, using the provided function.
    * The function will be provided object A and B.  If the result of the
    * function is less than zero, A will be sorted before B.  If the result is zero,
    * A and B retain their order.  If the result is greater than zero, A will
    * be sorted after B.
    *
    * @param [fn] {Function} The function to sort with. If <tt>null</tt> the objects
    *          will be sorted in "natural" order.
    */
   sort: function(fn) {
      Console.log("Sorting ", this.getName(), "[" + this.getId() + "]");
		var a = this.getAll().sort(fn);
		
		// Relink
		this._head = this._new(a[0]);
		var p=this._head;
		for (var i = 1; i < a.length; i++) {
			var n = this._new(a[i]);
			p.next = n;
			n.prev = p;
			p = n;
		}
		this._tail = p;
		this.sz = a.length;
   },

   /**
    * Returns a property object with accessor methods to modify the property.
    * @return {Object} The properties object
    */
   getProperties: function() {
      var self = this;
      var prop = this.base(self);
      return $.extend(prop, {
         "Contains"  : [function() { return self.size(); },
                        null, false]
      });
   },

   /**
    * Serializes a container to XML.
    * @return {String} The XML string
    */
   toXML: function(indent) {
      indent = indent ? indent : "";
      var props = this.getProperties();
      var xml = indent + "<" + this.constructor.getClassName();
      for (var p in props) {
         // If the value should be serialized, call it's getter
         if (props[p][2]) {
            xml += " " + p + "=\"" + props[p][0]().toString() + "\"";
         }
      }
      xml += ">\n";

      // Dump children
      for (var o in this.getAll()) {
         xml += this.objects[o].toString(indent + "   ");
      }

      // Closing tag
      xml += indent + "</" + this.constructor.getClassName() + ">\n";
      return xml;
   },
   
   /**
    * Returns an iterator over the collection.
    * @return {Iterator} An iterator
    */
   iterator: function() {
      return Iterator.create(this);   
   }

}, /** @scope Container.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "Container"
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
 *        is a container with a backing object for faster lookups.  Objects within
 *        the container must have unique names. When a container is destroyed, all
 *        objects within the container are destroyed with it.
 *
 * @param containerName {String} The name of the container. Default: Container
 * @extends Container
 * @constructor
 * @description Create a hashed container object.
 */
var HashContainer = Container.extend(/** @scope HashContainer.prototype */{

   objHash: null,

   /**
    * @private
    */
   constructor: function(containerName) {
      this.base(containerName || "HashContainer");
      this.objHash = {};
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.objHash = null;
   },

   /**
    * Returns <tt>true</tt> if the object name is already in
    * the hash.
    *
    * @param name {String} The name of the hash to check
    * @return {Boolean}
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

      if (this.isInHash(key)) {
         // Remove the old one first
         this.removeHash(key);
      }

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
    * Remove the object with the given key name from the container.
    *
    * @param name {String} The object to remove
    * @return {Object} The object removed
    */
   removeHash: function(key) {
      var obj = this.objHash["_" + String(key)];
      EngineSupport.arrayRemove(this.objects, this.objHash["_" + String(key)]);
      delete this.objHash["_" + String(key)];
      return obj;
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return {Object} The object removed from the container.
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
    * @param idx {Number|String} The index or hash of the object to get
    * @return {Object}
    */
   get: function(idx) {
      if (typeof idx == 'string') {
         return this.objHash["_" + String(idx)];
      } else {
         return this.base(idx);
      }
   },

   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed.
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
   }

}, /** @scope HashContainer.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "HashContainer"
    */
   getClassName: function() {
      return "HashContainer";
   }
});

return HashContainer;

});

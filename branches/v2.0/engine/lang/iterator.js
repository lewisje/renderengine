/**
 * The Render Engine
 * Iterator
 *
 * @fileoverview A set of objects which can be used to create a collection
 *               of objects, and to iterate over a container.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2011 Brett Fattori (brettf@renderengine.com)
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
	"class": "R.lang.Iterator",
	"requires": [
		"R.engine.PooledObject"
	]
});

/**
 * @class Create an iterator over a {@link R.struct.Container} or <code>Array</code> instance. An
 * iterator is a convenient object to traverse the list of objects
 * within the container.  The benefit of using an iterator with a <code>R.struct.Container</code> is
 * that if the container is modified, the <code>R.lang.Iterator</code> will reflect these changes.
 * <p/>
 * The simplest way to traverse the list is as follows:
 * <pre>
 * for (var itr = R.lang.Iterator.create(containerObj); itr.hasNext(); ) {
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
 * @param container {R.struct.Container} The container to iterate over.
 * @constructor
 * @extends R.engine.PooledObject
 * @description Create an iterator over a collection
 */
R.lang.Iterator = function() {
	return R.engine.PooledObject.extend(/** @scope R.lang.Iterator.prototype */{

   c: null,
	p: null,
	r: false,
	arr: false,

   /**
    * @private
    */
   constructor: function(container) {
      this.base("Iterator");
      this.c = container;
		this.arr = !(container instanceof R.struct.Container);
		this.p = this.arr ? 0 : container._head;
		this.r = false;
   },

   /**
    * Release the iterator back into the object pool.
    */
   release: function() {
      this.base();
      this.c = null;
		this.arr = false;
		this.p = null;
		this.r = false;
   },

	/**
	 * Reset the iterator to the start of the collection.
	 */
	reset: function() {
		this.p = this.arr ? (this.r ? this.c.length - 1 : 0) : (this.r ? this.c._tail : this.c._head);
	},

   /**
    * Reverse the order of the elements in the container (non-destructive) before
    * iterating over them.  You cannot call this method after you have called {@link #next},
    * otherwise, use {@link #reset} before calling this method.
    */
   reverse: function() {
      Assert((this.arr ? this.p == 0 : this.p === this.c._head), "Cannot reverse Iterator after calling next()");
      this.r = true;
		this.p = this.arr ? this.c.length - 1 : this.c._tail;
   },

   /**
    * Get the next element from the iterator.
    * @return {Object} The next element in the iterator
    * @throws {Error} An error if called when no more elements are available
    */
   next: function() {
		if (this.arr) {
			// For arrays
			this.p = (this.r ? this.p-- : this.p++);	
		} else {
			// For containers
			if (this.c.isDestroyed()) {
				throw new Error("Invalid iterator over destroyed container!");
			}
	
			// Get the next and move the pointer
			var o = this.p.ptr;
			this.p = (this.r ? this.p.prev : this.p.next);
	
			if (o != null) {
				return o;
			} else {
				throw new Error("Index out of range");
			}
		}
   },

   /**
    * Returns <tt>true</tt> if the iterator has more elements.
    * @return {Boolean}
    */
   hasNext: function() {
		if (this.arr) {
			// For arrays
			return (this.r ? this.p > 0 : this.p < this.c.length);			
		} else {
			// If the container hasn't been destroyed
			if (this.c && !this.c.isDestroyed()) {
				while (this.p != null && this.p.ptr != null && this.p.ptr.isDestroyed()) {
					// Skip destroyed objects
					this.p = (this.r ? this.p.prev : this.p.next);
				}
				return this.p != null;
			}
	      return false;
		}
   }

}, /** @scope R.lang.Iterator.prototype */{ 
   /**
    * Get the class name of this object
    *
    * @return {String} "R.lang.Iterator"
    */
   getClassName: function() {
      return "R.lang.Iterator";
   },
	
	/**
	 * Create an instance of an iterator over the given container.
	 * @param container {R.struct.container|Array} An <code>Array</code> or {@link R.struct.Container}
	 * @return {R.lang.Iterator} An iterator over the container
	 * @static
	 */
	over: function(container) {
		return R.lang.Iterator.create(container);	
	}
	
});

}
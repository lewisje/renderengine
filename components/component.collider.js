/**
 * The Render Engine
 * ColliderComponent
 *
 * A component which handles collisions.
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

var ColliderComponent = NotifierComponent.extend({

   potentialColliders: null,

   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_COLLIDER, priority || 1.0);
      this.potentialColliders = {};
   },

   /**
    * Determine the list of objects that could be colliding
    * with us.  The list contains the id's of all of the
    * objects that occupy the same quad that the host object
    * does.
    */
   buildPCL: function() {

      // Get the visible area of the render context
      var rc = this.getHost().getRenderContext();

      // Divide the context into four parts (quads)

   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ColliderComponent";
   }

});
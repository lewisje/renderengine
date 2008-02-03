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

var QuadNode = Base.extend({

   nodes: null,

   constructor: function() {
      nodes = [null, null, null, null];
   }

});

var ColliderComponent = NotifierComponent.extend({

   potentialColliders: null,

   quadTree: null,

   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_COLLIDER, priority || 1.0);
      this.potentialColliders = {};
   },

   genQuadTree: function() {

      quadTree = [];

      // Get our bounding box size
      var oBox = new Rectangle2D(this.getHostObject().getBoundingBox());

      // Get the render context's dimensions
      var rc = this.getHostObject().getRenderContext();
      var wBox = new Rectangle2D(0, 0, rc.getWidth(), rc.getHeight());

      // If the size of the object box is too small, adjust it
      // to the limit
      if (oBox.len_x() < ColliderComponent.LOWER_LIMIT)
      {
         oBox.setWidth(ColliderComponent.LOWER_LIMIT);
      }

      if (oBox.len_y() < ColliderComponent.LOWER_LIMIT)
      {
         oBox.setHeight(ColliderComponent.LOWER_LIMIT);
      }

      // There is also an upper limit that we want to work within
      if (oBox.len_x() > ColliderComponent.UPPER_LIMIT)
      {
         oBox.setWidth(ColliderComponent.UPPER_LIMIT);
      }

      if (oBox.len_y() > ColliderComponent.UPPER_LIMIT)
      {
         oBox.setHeight(ColliderComponent.UPPER_LIMIT);
      }

      // Now we can divide the playfield into a mesh, with each
      // sub area being that of the object's box
      for (var mX = 0; mX < wBox.width; mX += oBox.width)
      {
         for (var mY = 0; mY < wBox.height; mY += oBox.height)
         {

         }
      }
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

      // Using a quadtree to eliminate collisions that don't matter
      // We're going to subdivide the quadtree up just enough to enclose
      // our object.  This way, we're not creating a quadtree that is too
      // dense to be quick.  Additionally, we'll only subdivide to a certain
      // extent.  But the usage of the bounding box of the object will assist
      // us in creating a quadtree that can be updated without further divisions.


   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ColliderComponent";
   }

}, {  // Static

   LOWER_LIMIT: 50,
   UPPER_LIMIT: 400

});
/**
 * The Render Engine
 * HostComponent
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
 * @class A component that can execute host objects.  Allows embedding
 *        of multiple objects into one object.
 * @extends BaseComponent
 */
var HostComponent = BaseComponent.extend(/** @scope HostComponent.prototype */{

   objects: null,

   /**
    * @constructor
    * @memberOf Transform2DComponent
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 1.0);
      this.objects = new HashContainer();
   },

   destroy: function() {
      this.objects.destroy();
      this.base();
   },

   add: function(name, obj) {
      this.objects.add(name, obj);
   },

   get: function(obj) {
		this.objects.get(obj);
	},

   remove: function(obj) {
      this.objects.remove(obj);
   },

   /**
    * Update each of the host objects hosted in this component.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
      for (var c in this.objects) {
         this.objects[c].update(renderContext, time);
      }
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Transform2DComponent
    */
   getClassName: function() {
      return "HostComponent";
   }



});
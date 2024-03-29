/**
 * The Render Engine
 * HostComponent
 *
 * @fileoverview A component which allows chaining of {@link HostObject HostObjects} for 
 *               complex object creation.
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
Engine.include("/engine/engine.container.js");
Engine.include("/components/component.logic.js");

Engine.initObject("HostComponent", "LogicComponent", function() {

/**
 * @class A component that can execute host objects.  Allows embedding
 *        of multiple objects into one object.  This is logically
 *        a method to embed further {@link HostObject HostObjects} within
 *        an existing <tt>HostObject</tt>.
 *
 * @param name {String} The name of the component
 * @param [priority=1.0] {Number} The priority of this component
 * @extends LogicComponent
 * @constructor
 * @description Creates a <tt>HostComponent</tt> which can contain {@link HostObject HostObjects}.
 *              This allows a component to embed other hosts within it.  Each time the
 *              component is executed, each host will be given a chance to update as well.
 */
var HostComponent = LogicComponent.extend(/** @scope HostComponent.prototype */{

   objects: null,

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, priority || 1.0);
      this.objects = new HashContainer();
   },

   /**
    * Releases the component back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.objects = null;
   },

   /**
    * Destroys all of the hosts contained within this component.
    * @private
    */
   destroy: function() {
      this.objects.destroy();
      this.base();
   },

   /**
    * Add a {@link HostObject} to the component to be processed when
    * this component is executed.  Objects will be updated in the order in
    * which they are added.
    *
    * @param name {String} A unique name to refer to the object by
    * @param obj {HostObject} The host object reference
    */
   add: function(name, obj) {
      Assert((obj instanceof HostObject), "You can only add HostObjects to a HostComponent");
      this.objects.add(name.toUpperCase(), obj);
   },

   /**
    * Retrieve the {@link HostObject} that is associated with the
    * given name from the component.
    *
    * @param name {String} The unique name of the object
    * @return {HostObject}
    */
   get: function(name) {
      return this.objects.get(name.toUpperCase());
   },

   /**
    * Remove the host object from the component.
    *
    * @param obj {HostObject} The host object reference
    * @return {HostObject} The object which was removed
    */
   remove: function(obj) {
      return this.objects.remove(obj);
   },

   /**
    * Update each of the host objects within this component.  The order
    * in which hosts are updated is equivalent to the order in which
    * the objects were added.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
      var objs = this.objects.getObjects();
      for (var c in objs) {

         // Make sure the host object's render context matches 
         // this component's host object's context
         if (objs[c].getRenderContext() == null) {
            objs[c].setRenderContext(renderContext);
            Console.info(this.getHostObject().getId() + "[" + this.getName() + "]: SetRenderContext '" + renderContext.getId() + "'");
         }

         objs[c].update(renderContext, time);
      }
   }
}, /** @scope HostComponent.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "HostComponent"
    */
   getClassName: function() {
      return "HostComponent";
   }
});

return HostComponent;

});
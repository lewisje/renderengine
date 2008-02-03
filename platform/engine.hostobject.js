/**
 * The Render Engine
 * HostObject
 *
 * A host object is a container of components which provide some sort
 * of action, be it rendering, collision detection, effects, or whatever.
 * This way, an object can be anything, depending on it's components.
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

var HostObject = Container.extend({

   zIndex: 1,

   renderContext: null,

   bBox: null,

   /**
    * Destroy all of the components within this object and
    * remove this object from it's render context.
    */
   destroy: function() {
      this.getRenderContext().remove(this);
      this.base();
   },

   /**
    * Set the bounding box of this object
    *
    * @param rect {Rectangle2D} The rectangle that completely encompasses
    *                           this object.
    */
   setBoundingBox: function(rect) {
      this.bBox = rect;
   },

   /**
    * Get the bounding box of this object
    *
    * @type Rectangle2D
    */
   getBoundingBox: function() {
      return this.bBox;
   },


   /**
    * Set the depth at which this object will render to
    * the context.  The lower the z-index, the further
    * away from the front the object will draw.
    *
    * @param zIndex {Number} The z-index of this object
    */
   setZIndex: function(zIndex) {
      this.zIndex = zIndex;
   },

   /**
    * Get the depth at which this object will render to
    * the context.
    *
    * @type Number
    */
   getZIndex: function() {
      return this.zIndex;
   },

   /**
    * Set the rendering context this object will be drawn upon.
    *
    * @param renderContext {RenderContext} The context
    */
   setRenderContext: function(renderContext) {
      this.renderContext = renderContext;
   },

   /**
    * Get the rendering context this object will be drawn upon.
    *
    * @type RenderContext
    */
   getRenderContext: function() {
      return this.renderContext;
   },

   /**
    * Allows the object a chance to perform setup before all of
    * its components are executed.  Usually used to push the
    * render context's transform.
    *
    * @param renderContext {RenderContext} The context the object will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   preUpdate: function(renderContext, time) {
   },

   /**
    * Update this object within the render context, and for the specified time.
    *
    * @param renderContext {RenderContext} The context the object will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      var components = this.getObjects();

      this.preUpdate(renderContext, time);

      for (var c in components) {
         components[c].execute(renderContext, time);
      }

      this.postUpdate(renderContext, time);
   },

   /**
    * Allows the object a chance to perform actions after all of
    * its components have been executed.  Usually used to pop the
    * transformations this object performed.
    *
    * @param renderContext {RenderContext} The context the object will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   postUpdate: function(renderContext, time) {
   },

   /**
    * Add a component to the host object.  The components will be
    * sorted based on their type, and priority within that type.
    * Components with a higher priority will be sorted before components
    * with a lower priority.  The sorting order for type is:
    * <ul>
    * <li>Input</li>
    * <li>Logic</li>
    * <li>Collision</li>
    * <li>Rendering</li>
    * </ul>
    *
    * @param component {BaseComponent} A component to add to the host
    */
   add: function(component) {

      Assert((component instanceof BaseComponent), "Cannot add a non-component to a HostObject");

      // Make sure that the component name is unique within the host
      var objs = this.getObjects();
      for (var o in objs) {
         Assert((component.getName() != objs[o].getName()), "Components must have a unique name within the host");
      }

      component.setHostObject(this);
      this.base(component);
      if (this.getObjects().length > 1)
      {
         this.sort(HostObject.componentSort);
      }
   },

   /**
    * Get the component with the specified name from this object.
    *
    * @param name {String} The unique name of the component to get
    * @type BaseComponent
    */
   getComponent: function(name) {
      name = name.toUpperCase();
      var objs = this.getObjects();
      for (var o in objs)
      {
         if (objs[o].getName() == name) {
            return objs[o];
         }
      }
   },

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "HostObject";
   }


}, {  // Interface

   /**
    * Sort components within this object based upon their component
    * type, and the priority within that type.  Components with a higher
    * priority will be sorted before components with a lower priority.
    */
   componentSort: function(component1, component2) {
      return ((component1.getType() - component2.getType()) +
              ((1 / component1.getPriority()) - (1 / component2.getPriority())));
   }

});


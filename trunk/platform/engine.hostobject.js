/**
 * The Render Engine
 * HostObject
 * 
 * A host object is a container of components which provide some sort
 * of action, be it rendering, collision detection, effects, or whatever.
 * This way, an object can be anything, depending on it's components.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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

   /**
    * Update this object within the render context, and for the specified time.
    * 
    * @param renderContext {RenderContext} The context the object will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      var components = this.getObjects();
      
      for (var c in components) {
         components[c].execute(renderContext, time);
      }
   },
   
   /**
    * Add a component to the host object.
    *
    * @param component {BaseComponent} A component to add to the host
    */
   add: function(component) {
      
      // Make sure that the component name is unique within the host
      var objs = this.getObjects();
      for (var o in objs) {
         Assert((component.getName() != objs[o].getName()), "Components must have a unique name within the host");
      }
      
      component.setHost(this);
      this.base(component);
      this.sort();
   },
   
   /**
    * Get the component with the specified name.
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
    * Sort components within the host by component type and then by priority.
    */
   sort: function() {
      this.base(HostObject.componentSort);
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

   componentSort: function(component1, component2) {
      return ((component1.getType() - component2.getType()) +
              ((1 / component1.getPriority()) - (1 / component2.getPriority())));
   }

});


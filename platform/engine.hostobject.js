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

   update: function(renderContext) {
      var components = this.getObjects();
      
      for (var c in components) {
         components[c].execute(renderContext, time);
      }
   },
   
   add: function(component) {
      component.setHost(this);

      this.base(component);
      this.sort();
   },
   
   sort: function() {
      this.base(HostObject.componentSort);
   },
   
   getClassName: function() {
      return "HostObject";
   }

}, {  // Interface

   componentSort: function(component1, component2) {
      return ((component1.getType() - component2.getType()) +
              ((1 / component1.getPriority()) - (1 / component2.getPriority())
   }

});


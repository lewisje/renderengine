/**
 * The Render Engine
 * BaseComponent
 * 
 * The base component class
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
 
var BaseComponent = Base.extend({

   name: null,

   priority: 0,
   
   type: -1,
   
   host: null,
   
   /**
    * Create a new instance of this component, setting the type and
    * update priority of this component compared to all other components
    * within the host.
    *
    * @param name {String} The name of the component
    * @param type {Number} The type of the component
    * @param priority {Number} A value between 0.0 and 1.0.  Default: 0.5
    */
   constructor: function(name, type, priority) {
      Assert((name      
      this.name = name;

      Assert((type != null && (type >= BaseComponent.TYPE_INPUT && type <= BaseComponent.TYPE_RENDERING)), 
             "You must specify a type for BaseComponent");
             
      this.type = type;
      
      Assert((priority != null && (priority >= 0.0 && priority <= 1.0)),
             "Priority must be between 0.0 and 1.0 for BaseComponent");
      
      this.priority = priority || 0.5;
   },
   
   /**
    * Get the type of this component.
    *
    * @type Number
    */
   getType: function() {
      return this.type;
   }, 
   
   /**
    * Set the execution priority of this component.
    * 
    * @param priority {Number} A value between 0.0 and 1.0
    */
   setPriority: function(priority) {
      this.priority = priority;
      this.getHost().sort();
   },
   
   /**
    * Returns the priority of this component.
    *
    * @type Number
    */
   getPriority: function() {
      return this.priority;
   },
   
   /**
    * Run the component, updating it.
    *
    * @param renderContext {RenderContext} The context the component would render within.
    * @param time {Number} The global engine time
    */
   execute: function(renderContext, time) {
      // Does nothing...
   }

}, {
   // Component types (main host sorting order)
   TYPE_INPUT:          1,
   TYPE_LOGIC:          BaseComponent.TYPE_INPUT + 1,
   TYPE_TRANSFORM:      BaseComponent.TYPE_LOGIC + 1,
   TYPE_RENDERING:      BaseComponent.TYPE_TRANSFORM + 1
});
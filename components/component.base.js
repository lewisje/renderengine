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
 
var BaseComponent = BaseObject.extend({

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
      Assert((name != null), "You must assign a name to every Component.");      
      this.name = name.toUpperCase();

      Assert((type != null && (type >= BaseComponent.TYPE_INPUT && type <= BaseComponent.TYPE_RENDERING)), 
             "You must specify a type for BaseComponent");
             
      this.type = type;
      
      Assert((priority != null && (priority >= 0.0 && priority <= 1.0)),
             "Priority must be between 0.0 and 1.0 for BaseComponent");
      
      this.priority = priority || 0.5;
      this.base(this.name);
   },

   /**
    * Set the host object this component exists within.
    */
   setHostObject: function(hostObject) {
      this.host = hostObject;
   },
   
   /**
    * Get the host object this component exists within.
    */
   getHostObject: function() {
      return this.host;
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
    * Set the execution priority of this component with
    * 1.0 being the highest priority and 0.0 being the lowest.
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
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "BaseComponent";
   }


}, {
   // Component types (main host sorting order)
   TYPE_INPUT:          1,
   TYPE_LOGIC:          2,
   TYPE_RENDERING:      3
});
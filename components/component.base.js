/**
 * The Render Engine
 * BaseComponent
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
 * @class The base component class
 * @extends BaseObject
 */
var BaseComponent = BaseObject.extend(/** @scope BaseComponent.prototype */{

   priority: 0,

   type: -1,

   host: null,

   /**
    * Create a new instance of a component, setting the name, type, and
    * update priority of this component compared to all other components
    * within the host.
    *
    * @param name {String} The name of the component
    * @param type {Number} The type of the component
    * @param priority {Number} A value between 0.0 and 1.0.  Default: 0.5
    */
   constructor: function(name, type, priority) {
      Assert((name != null), "You must assign a name to every Component.");
      name = name.toUpperCase();

      Assert((type != null && (type >= BaseComponent.TYPE_INPUT && type <= BaseComponent.TYPE_RENDERING)),
             "You must specify a type for BaseComponent");

      this.type = type;

      Assert((priority != null && (priority >= 0.0 && priority <= 1.0)),
             "Priority must be between 0.0 and 1.0 for BaseComponent");

      this.priority = priority || 0.5;
      this.base(name);
   },

   /**
    * Set the host object this component exists within.
    *
    * @param hostObject {HostObject} The object which hosts this component
    */
   setHostObject: function(hostObject) {
      this.host = hostObject;
   },

   /**
    * Get the host object this component exists within.
    *
    * @type HostObject
    */
   getHostObject: function() {
      return this.host;
   },

   /**
    * Get the type of this component.  Will be one of:
    * {@link #TYPE_INPUT}, {@link #TYPE_LOGIC}, {@link #TYPE_COLLIDER}, {@link #TYPE_RENDERING}
    *
    * @type Number
    */
   getType: function() {
      return this.type;
   },

   /**
    * Set the execution priority of this component with
    * 1.0 being the highest priority and 0.0 being the lowest.  Components
    * within a host object are sorted by type, and then priority.
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
    * Run the component, updating its state.  Not all components will need an execute
    * method.  However, it is important to include one if you need to run caculations
    * or update the state of the component each engine cycle.
    *
    * @param renderContext {RenderContext} The context the component will render within.
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
   },

   /**
    * Converts the type name to a string.
    *
    * @type String
    */
   getTypeString: function() {
      var ts = "";
      switch (this.getType()) {
         case BaseComponent.TYPE_INPUT: ts = "TYPE_INPUT"; break;
         case BaseComponent.TYPE_LOGIC: ts = "TYPE_LOGIC"; break;
         case BaseComponent.TYPE_COLLIDER: ts = "TYPE_COLLIDER"; break;
         case BaseComponent.TYPE_RENDERING: ts = "TYPE_RENDERING"; break;
         default: ts = "TYPE_UNKNOWN";
      }

      return ts;
   }


}, /** @scope BaseComponent.prototype */{

   /**
    * An input component
    * @type Number
    */
   TYPE_INPUT:          1,

   /**
    * A logic component
    * @type Number
    */
   TYPE_LOGIC:          2,

   /**
    * A collider component
    * @type Number
    */
   TYPE_COLLIDER:       3,

   /**
    * A rendering component
    * @type Number
    */
   TYPE_RENDERING:      4
});
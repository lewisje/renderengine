/**
 * The Render Engine
 * BaseObject
 * 
 * The base object class which represents an object within
 * the engine.  All objects should extend from this class.
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
 
var BaseObject = Base.extend({
   id: -1,
   
   name: "",
   
   element: null,
   
   isRenderEngineObject: function() {
      return true;
   },
   
   constructor: function(name) {
      this.name = name;
      this.id = Engine.create(this);
   },

   destroy: function() {
      // Clean up the reference to this object
      Engine.destroy(this);
      this.element = null;
   },
   
   getId: function() {
      return this.id;
   },
   
   getName: function() {
      return this.name;
   },
   
   setElement: function(element) {
      this.element = element;
   },
   
   getElement: function() {
      return this.element;
   },
   
   getClassName: function() {
      return "BaseObject";
   }

});
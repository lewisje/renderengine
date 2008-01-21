/**
 * The Render Engine
 * Container
 * 
 * A container is a logical collection of objects.  A container
 * is responsible for maintaining the list of objects within it.
 * When a container is destroyed, all objects within the container
 * are destroyed with it.
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
 
var Container = BaseObject.extend({

   objects: [],
   
   constructor: function(containerName) {
      this.base(containerName || "Container");
   },
   
   destroy: function() {
      for (var o in this.objects)
      {
         this.objects[o].destroy();
      }
      this.clear();
      this.base();
   },
   
   add: function(obj) {
      this.objects.push(obj);
      Console.log("Added " + obj.getId() + " to " + this.getId());
   },
   
   remove: function(obj) {
      var idx = -1;
      if (Array.prototype.indexOf)
      {
         idx = this.objects.indexOf(obj);   
      }
      else
      {
         for (var i = 0; i < this.objects.length; i++)
         {
            if (this.objects[i] == obj)
            {
               idx = i;
               break;
            }
         }
      }
      
      Console.log("Removed " + obj.getId() + " from " + this.getId());
      this.objects.splice(idx, 1);
   },
   
   clear: function() {
      this.objects.length = 0;   
   },
   
   getObjects: function() {
      return this.objects;
   },
   
   sort: function(fn) {
      this.objects.sort(fn);
   },
   
   getClassName: function() {
      return "Container";
   }


});
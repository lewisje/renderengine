/**
 * The Render Engine
 * Startup library
 * 
 * The startup library is a collection of methods which will
 * simplify the creation of other class files.  It is the starting
 * point of all libraries in the engine itself.
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
 
 var Engine = Base.extend({
   constructor: null,
   
   idRef: 0,
   
   gameObjects: {},
   
   debugMode: false,
   
   defaultContext: null,
   
   create: function(obj) {
      this.idRef++;
      var objId = obj.getName() + this.idRef;
      this.gameObjects[objId] = obj;
      Console.log("Object " + objId + " created");
   },
   
   destroy: function(obj) {
      var objId = obj.getId();
      this.gameObjects[objId] = null;
      delete this.gameObjects[objId];
      Console.log("Object " + objId + " destroyed");
   },
   
   getObject: function(id) {
      return this.gameObjects[id];
   },
    
   startup: function(debugMode) {
      this.upTime = new Date().getTime();
      this.debugMode = debugMode ? true : false;
      
      // Create the default context (the document)
      this.defaultContext = new DocumentContext();
      
      Console.log("Engine started. " + (this.debugMode ? "[DEBUG]" : ""));
   },
   
   shutdown: function() {
      this.downTime = new Date().getTime();
      for (var o in this.gameObjects)
      {
         this.gameObjects[o].destroy();
      }
      this.gameObjects = null;
      this.defaultContext = null;
      this.downTime = new Date().getTime();

      Console.log("Engine shutdown.  Runtime: " + (this.downTime - this.upTime));
   },
   
   getDefaultContext: function() {
      return this.defaultContext;
   }
    
 };
 
 
 /**
  * A simple 2D point class
  *
  * @param x The X value of the point
  * @param y The Y value of the point
  */
 var Point2D = Base.extend({
 
   x: 0,
   y: 0,
 
   constructor: function(x, y) {
      this.x = x;
      this.y = y;
   },
   
   set: function(x, y) {
      this.x = x;
      this.y = y;
   },
   
   add: function(point) {
      this.x += point.x;
      this.y += point.y;
   },
   
   addScalar: function(scalar) {
      this.add(new Point2D(scalar, scalar));
   },
   
   sub: function(point) {
      this.x -= point.x;
      this.y -= point.y;
   },
   
   convolve: function(point) {
      this.x *= point.x;
      this.y *= point.y;
   },
   
   convolveInverse: function(point) {
      Assert((point.x != 0 && point.y != 0), "Division by zero in Point.convolveInverse");
     
      this.x /= point.x;
      this.y /= point.y;
   },
   
   multScalar: function(scalar) {
      this.convolve(new Point2D(scalar, scalar));
   },
   
   divScalar: function(scalar) {
      Assert((scalar != 0), "Division by zero in Point.divScalar");
      this.convolveInverse(new Point2D(scalar, scalar));
   }
   
 });
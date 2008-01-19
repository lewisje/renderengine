/**
 * The Render Engine
 * Object2D
 * 
 * A 2 dimensional object that represents something that can
 * be rendered within the engine framework.  Game objects have a
 * location in 2D space.  Additionally, a method is provided which
 * will be called to render the object to the game world.
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

var Object2D = BaseObject.extend({

   pos: null,
   
   constructor: function(name, pos) {
      
      pos = name instanceof Point ? name : pos;
      name = name instanceof Point ? "Object2D" : name;
      this.base(name);
      
      this.pos = pos || new Point2D(0,0);
   },
   
   setPosition: function(pos) {
      this.pos = pos;
   },
   
   getPosition: function() {
      return this.pos;
   },
   
   render: function(context) {
   }
});
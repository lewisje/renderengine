/**
 * The Render Engine
 * BaseTransformComponent
 * 
 * Base drawing component.  Simple has position, rotation, and scale.
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
 
var Transform2DComponent = BaseComponent.extend({

   position: null,
   
   rotation: 0,
   
   scale: 1.0,
   
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_RENDERING, priority || 1.0);
      this.position = new Point2D(0,0);
   },
   
   setPosition: function(point) {
      this.position.set(point);
   },
   
   getPosition: function() {
      return this.position;
   },
   
   setRotation: function(rotation) {
      this.rotation = rotation;
   },
   
   getRotation: function() {
      return this.rotation;
   },
   
   setScale: function(scale) {
      this.scale = scale;
   },
   
   getScale: function() {
      return this.scale;
   },
   
   execute: function(renderContext, time) {
      
      renderContext.setPosition(this.position);
      renderContext.setRotation(this.rotation);
      renderContext.setScale(this.scale, this.scale);
      
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Transform2DComponent";
   }

   

});
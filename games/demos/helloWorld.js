/**
 * The Render Engine
 * A simple "Hello World" 2D object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 82 $
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
 * Creates a host object that we can add a couple of
 * components to.  A host object will update its components
 * each time it is updated.  This way an object doesn't
 * have to know how to draw itself, move around, check for
 * collisions, etc.
 *
 * This simple host object will use a transform component,
 * which knows how to position itself in a rendering context,
 * and a vector text renderer.  Although we could just put
 * text into a TextRenderer object, which is a pre-made
 * host object that can position and draw text, we want
 * to control it ourselves.
 *
 * The host object we'll use is specially made to work in a
 * two dimensional context.  It will provide for us some basic
 * structure from which we'll extend it.
 *
 * @constructor
 * @param text {String} The text to render
 * @param weight {Number} The weight (boldness) of the text. Default: 1
 */
var HelloWorld = Object2D.extend({

	size: 1,

   constructor: function(position) {
      this.base("HelloWorld");

      // Add components to move and draw the object
      this.add(new Transform2DComponent("move"));
      this.add(new VectorText("text"));

      this.getComponent("text").setText("Hello World");
      this.getComponent("text").setColor("white");

      if (!position)
      {
			// Set the position
			position = new Point2D( Math.floor(Math.random() * 300),
											Math.floor(Math.random() * 400));
      }
      this.setPosition(position);
   },

   /**
    * Update the host object in the rendering context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

   },

   /**
    * Returns the position of the object
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   /**
    * Set the position of the object.
    *
    * @param point {Point2D} The position of the rock
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Get the rotation of the object.
    * @type Number
    */
   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   /**
    * Set the rotation of the object.
    *
    * @param angle {Number} The rotation of the asteroid
    */
   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("move").setRotation(angle);
   },

	getScale: function() {
		return this.getComponent("move").getScaleX();
	},

	setScale: function(scale) {
		this.base(scale, scale);
		this.getComponent("move").setScale(scale, scale);
	},

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "HelloWorld";
   }

});

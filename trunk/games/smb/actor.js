
/**
 * The Render Engine
 *
 * The actor object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

// Includes
Engine.include("/platform/engine.object2d.js");

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
SpriteTest.Actor = Object2D.extend({

   editing: false,

   sprite: null,

   constructor: function() {
      this.base("Actor");

      this.editing = false;

      // Add components to move and draw the player
      if (window.opera && opera.wiiremote) {
         this.add(WiimoteInputComponent.create("input"));
      } else {
         this.add(KeyboardInputComponent.create("input"));
      }

      this.add(Transform2DComponent.create("move"));
      this.add(SpriteComponent.create("draw"));

      this.setPosition(Point2D.create(100, 100));
   },

   /**
    * Update the player within the rendering context.  This draws
    * the shape to the context, after updating the transform of the
    * object.  If the player is thrusting, draw the thrust flame
    * under the ship.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);

      if (this.editing) {
         renderContext.setLineStyle("white");
         renderContext.setLineWidth(2);
         renderContext.drawRectangle(this.getSprite().getBoundingBox());
      }

      renderContext.popTransform();
   },

   setSprite: function(sprite) {
      this.sprite = sprite;
      this.setBoundingBox(sprite.getBoundingBox());
      this.getComponent("draw").setSprite(sprite);
   },

   getSprite: function() {
      return this.sprite;
   },

   /**
    * Get the position of the ship from the mover component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Set, or initialize, the position of the mover component
    *
    * @param point {Point2D} The position to draw the ship in the playfield
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Set up the player object on the playfield.  The width and
    * heigh of the playfield are used to determine the center point
    * where the player starts.
    *
    * @param pWidth {Number} The width of the playfield in pixels
    * @param pHeight {Number} The height of the playfield in pixels
    */
   setup: function(pWidth, pHeight) {
   },

   setEditing: function(state) {
      this.editing = state;
   },

   isEditable: function() {
      return true;
   }

}, { // Static

   /**
    * Get the class name of this object
    * @return The string <tt>SpriteTest.Actor</tt>
    * @type String
    */
   getClassName: function() {
      return "SpriteTest.Actor";
   }
});

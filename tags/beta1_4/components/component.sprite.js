/**
 * The Render Engine
 * SpriteComponent
 *
 * @fileoverview An extension of the render component which handles sprite
 *               resource rendering.
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

// Includes
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.render.js");

Engine.initObject("SpriteComponent", "RenderComponent", function() {

/**
 * @class A render component that renders its contents from a {@link Sprite}.
 * @extends RenderComponent
 */
var SpriteComponent = RenderComponent.extend(/** @scope SpriteComponent.prototype */{

   currentSprite: null,

   /**
    * @constructor
    */
   constructor: function(name, priority, sprite) {
      this.base(name, priority || 0.1);
      this.currentSprite = sprite;
   },

   release: function() {
      this.base();
      this.currentSprite = null;
   },

   /**
    * Calculate the bounding box from the set of
    * points which comprise the shape to be rendered.
    * @private
    */
   calculateBoundingBox: function() {
      return this.currentSprite.getBoundingBox();
    },

   /**
    * Set the sprite the component will render.
    *
    * @param sprite {Sprite} The sprite to render
    */
   setSprite: function(sprite) {
      this.currentSprite = sprite;
		
		if (this.getHostObject().jQ()) {
			this.getHostObject().jQ().css({
				width: sprite.getBoundingBox().len_x(),
				height: sprite.getBoundingBox().len_y(),
				background: "url('" + sprite.getSourceImage().src + "') no-repeat"
			});
		}
   },

   /**
    * Get the sprite the component is rendering.
    *
    * @return A {@link Sprite} object
    */
   getSprite: function() {
      return this.currentSprite;
   },

   /**
    * Draw the sprite to the render context.  The frame, for animated
    * sprites, will be automatically determined based on the current
    * time passed to the method.
    *
    * @param renderContext {RenderContext} The context to render to
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {

      if (!this.base(renderContext, time))
      {
         return;
      }

      if (this.currentSprite) {
         renderContext.drawSprite(this.getHostObject(), this.currentSprite, time);
      }
   }
}, { /** @scope SpriteComponent.prototype */
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpriteComponent";
   }
});

return SpriteComponent;

});
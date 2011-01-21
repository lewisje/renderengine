/**
 * The Render Engine
 * MouseInputComponent
 *
 * @fileoverview An extension of the input component which handles
 *               mouse input.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.components.MouseInput",
	"requires": [
		"R.components.Input",
		"R.engine.Events",
		"R.lang.Timeout",
		"R.math.Point2D",
		"R.math.Vector2D",
		"R.math.Math2D"
	]
});

/**
 * @class A component which responds to mouse events and notifies
 * the host object when one of the events occurs.  The host should implement
 * any of the five methods listed below to be notified of the corresponding event:
 * <ul>
 * <li><tt>onMouseOver()</tt> - The mouse moved over the host object, or the object 
 *     moved under the mouse</li>
 * <li><tt>onMouseOut()</tt> - The mouse moved out of the host object (after being over it)</li>
 * <li><tt>onMouseDown()</tt> - A mouse button was depressed</li>
 * <li><tt>onMouseUp()</tt> - A mouse button was released</li>
 * <li><tt>onMouseMove()</tt> - The mouse was moved</li>
 * </ul>
 * Each event receives the "mouseInfo" object as its only argument which contains the following:
 * <ul>
 * <li><tt>position [Point2D]</tt> - The position of the mouse in screen coordinates</li>
 * <li><tt>lastPosition [Point2D]</tt> - The last updated position of the mouse</li>
 * <li><tt>button [Number]</tt> - One of the mouse button constants from {@link EventEngine}</li>
 * </ul>
 * Objects which wish to be notified via the <tt>onMouseOver()</tt> event handler will need
 * to define their bounding box.
 *
 * @param name {String} The unique name of the component.
 * @param priority {Number} The priority of the component among other input components.
 * @extends R.components.Input
 * @constructor
 * @description Create a mouse input component.
 */
R.components.MouseInput = function() {
	return R.components.Input.extend(/** @scope R.components.MouseInput.prototype */{

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, priority);
   },

   /**
    * Set the host object this component exists within.  Additionally, this component
    * sets some readable flags on the host object and establishes (if not already set)
    * a mouse listener on the render context.
    *
    * @param hostObject {R.engine.HostObject} The object which hosts the component
    * @private
    */
   setHostObject: function(hostObject) {
      this.base(hostObject);

      // Set some flags we can check
		// TODO: Store in object data!!
      hostObject.MouseInputComponent_mouseOver = false;
      hostObject.MouseInputComponent_mouseDown = false;

		// Remember if the host has any of the required handlers
		if (this.getHostObject().onMouseOver ||
          this.getHostObject().onMouseOut ||
          this.getHostObject().onMouseDown ||
          this.getHostObject().onMouseUp) {
			hostObject.MouseInputComponent_hasHandlers = true;	 	
		}

		// Assign the global handlers
		R.components.MouseInput.assignMouseHandlers(hostObject.getRenderContext(), this);

   },

   /**
    * Perform the checks on the mouse info object, and also perform
    * intersection tests to be able to call mouse events.
    * @param renderContext {R.rendercontexts.AbstractRenderContext} The render context
    * @param time {Number} The current world time
    */
   execute: function(renderContext, time) {
      // Objects may be in motion.  If so, we need to call the mouse
      // methods for just such a case.
      var mouseInfo = this.getHostObject().getRenderContext().MouseInputComponent_mouseInfo;
      var bBox = this.getHostObject().getWorldBox();
      var mouseOver = false;
      if (this.getHostObject().MouseInputComponent_hasHandlers && mouseInfo && bBox) {
         mouseOver = R.math.Math2D.boxPointCollision(bBox, mouseInfo.position);
      }

      // Mouse position changed
      if (this.getHostObject().onMouseMove && !mouseInfo.position.equals(mouseInfo.lastPosition)) {
         this.getHostObject().onMouseMove(mouseInfo);
      }

      // Mouse is over object
      if (this.getHostObject().onMouseOver && mouseOver && 
			 !this.getHostObject().MouseInputComponent_mouseOver) {
         this.getHostObject().MouseInputComponent_mouseOver = true;
         this.getHostObject().onMouseOver(mouseInfo);
      }

      // Mouse was over object
      if (this.getHostObject().onMouseOut && !mouseOver &&
          this.getHostObject().MouseInputComponent_mouseOver == true) {
         this.getHostObject().MouseInputComponent_mouseOver = false;
         this.getHostObject().onMouseOut(mouseInfo);
      }

      // Mouse button clicked 
      if (this.getHostObject().onMouseDown && (mouseInfo.button != R.engine.Events.MOUSE_NO_BUTTON)) {
         this.getHostObject().MouseInputComponent_mouseDown = true;
         this.getHostObject().onMouseDown(mouseInfo);
      }

      // Mouse button released (and mouse was down)
      if (this.getHostObject().onMouseUp && this.getHostObject().MouseInputComponent_mouseDown &&
		    (mouseInfo.button == R.engine.Events.MOUSE_NO_BUTTON)) {
         this.getHostObject().MouseInputComponent_mouseDown = false;
         this.getHostObject().onMouseUp(mouseInfo);
      }
   }
}, /** @scope R.components.MouseInput.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "R.components.MouseInput"
    */
   getClassName: function() {
      return "R.components.MouseInput";
   },
	
	/**
	 * Assigns the global mouse handlers.  The mouse information can be read from an
	 * object which is contained on the default context. Reading 
	 * <code>R.Engine.getDefaultContext().MouseInputComponent_mouseInfo</code> will return:
	 * <ul>
	 * <li><code>position</code> - {@link R.math.Point2D}</li>
	 * <li><code>lastPosition</code> - {@link R.math.Point2D}</li>
	 * <li><code>button</code> - {@link R.engine.Events#MOUSE_NO_BUTTON}, {@link R.engine.Events#MOUSE_LEFT_BUTTON},
	 * {@link R.engine.Events#MOUSE_RIGHT_BUTTON}, or {@link R.engine.Events#MOUSE_MIDDLE_BUTTON}</li>
	 * <li><code>lastOver</code> - {@link R.engine.BaseObject} or <code>null</code></li>
	 * <li><code>moveVec</code> - {@link R.math.Vector2D} which represents the direction and distance
	 * of the mouse movement</li>
	 * </ul>
	 * @param ctx {R.rendercontexts.AbstractRenderContext} The context to assign the handlers to
	 * @param c {R.components.Base}
	 */
	assignMouseHandlers: function(ctx, c) {
      // Assign handlers to the context, making sure to only add
      // the handler once.  This way we don't have hundreds of mouse move
      // handlers taking up precious milliseconds.
      if (!ctx.MouseInputComponent_mouseInfo)
      {
         ctx.MouseInputComponent_mouseInfo = {
            position: R.math.Point2D.create(0,0),
            lastPosition: R.math.Point2D.create(0,0),
				downPosition: R.math.Point2D.create(0,0),
            button: R.engine.Events.MOUSE_NO_BUTTON,
				moveVec: R.math.Vector2D.create(0,0),
				dragVec: R.math.Vector2D.create(0,0),
            lastOver: null,
				moveTimer: null
         };

			ctx.addEvent(c, "mousemove", function(evt) {
            var mouseInfo = R.Engine.getDefaultContext().MouseInputComponent_mouseInfo;
				if (mouseInfo.moveTimer != null) {
					mouseInfo.moveTimer.destroy();
					mouseInfo.moveTimer = null;						
				}
	         mouseInfo.lastPosition.set(mouseInfo.position);
				mouseInfo.position.set(evt.pageX, evt.pageY);
				mouseInfo.moveVec.set(mouseInfo.position);
				mouseInfo.moveVec.sub(mouseInfo.lastPosition);
				if (mouseInfo.button != R.engine.Events.MOUSE_NO_BUTTON) {
					mouseInfo.dragVec.set(mouseInfo.downPosition);
					mouseInfo.dragVec.sub(mouseInfo.position);
				}
				mouseInfo.moveTimer = R.lang.Timeout.create("mouseMove", 33, function() {
					mouseInfo.moveVec.set(0,0);				
				});
         });

         ctx.addEvent(c, "mousedown", function(evt) {
            var mouseInfo = R.Engine.getDefaultContext().MouseInputComponent_mouseInfo;
            mouseInfo.button = evt.which;
				mouseInfo.downPosition.set(evt.pageX, evt.pageY);
				evt.preventDefault();
         });

         ctx.addEvent(c, "mouseup", function(evt) {
            var mouseInfo = R.Engine.getDefaultContext().MouseInputComponent_mouseInfo;
            mouseInfo.button = R.engine.Events.MOUSE_NO_BUTTON;
				mouseInfo.dragVec.set(0,0);
         });

      }
	}
});
}
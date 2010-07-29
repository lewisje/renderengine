/**
 * The Render Engine
 * BillboardComponent
 *
 * @fileoverview A render component which will render the contents of
 * 				  a generated image until the contents are updated.
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

// Includes
Engine.include("/components/component.render.js");

Engine.initObject("Billboard2DComponent", "RenderComponent", function() {

/**
 * @class The billboard component renders the contents of an image which
 * 		 was generated by a subclassed render component.  When the contents
 *        of the subclassed component are re-rendered, the contents of the
 *        image are updated.  The best usage of this component is for infrequently
 *        changing vector drawn objects.  For example:
 *        <pre>
 *  constructor: function(size, position, pWidth, pHeight) {
 *     this.base("Spaceroid");
 *
 *     // Add components to move and draw the asteroid
 *     this.add(Mover2DComponent.create("move"));
 *     this.add(Billboard2DComponent.create("draw", Vector2DComponent.create("vector")));
 *     this.add(ColliderComponent.create("collider", Spaceroids.collisionModel));
 *			 </pre>
 *			 Accessing the <tt>Vectory2DComponent</tt> within the <tt>Billboard2DComponent</tt>
 *			 is as simple as calling {@link #getComponent}.  If the contents of the contained
 *			 component are updated, you will need to call {@link #regenerate} to recreate the
 *			 billboard image.
 *
 *
 * @param name {String} The name of the component
 * @param priority {Number} The priority of the component between 0.0 and 1.0
 * @constructor
 * @extends RenderComponent
 * @description Creates a 2d billboard component.
 */
var Billboard2DComponent = RenderComponent.extend(/** @scope Billboard2DComponent.prototype */{

   billboard: null,
	
	mode: null,
	
	renderComponent: null,

   /**
    * @private
    */
   constructor: function(name, renderComponent, priority) {
      this.base(name, priority || 0.1);
      this.billboard = $("<img src='' width='1' height='1'/>");
		this.mode = Billboard2DComponent.REDRAW;
		this.renderComponent = renderComponent;
		
		// All billboard components share the same temporary context
		if (Billboard2DComponent.tempContext == null) {
			// TODO: At some point it would be good to mimic the
			// context to which the component is rendering 
			Billboard2DComponent.tempContext = CanvasContext.create("billboardTemp", 800, 800);
		}
   },

   /**
    * Releases the component back into the object pool. See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.billboard = null;
		this.mode = null;
		this.renderComponent = null;
   },

   /**
    * Establishes the link between this component and its host object.
    * When you assign components to a host object, it will call this method
    * so that each component can refer to its host object, the same way
    * a host object can refer to a component with {@link HostObject#getComponent}.
    *
    * @param hostObject {HostObject} The object which hosts this component
    */
   setHostObject: function(hostObject) {
      this.renderComponent.setHostObject(hostObject);
		this.base(hostObject);
   },

	regenerate: function() {
		this.mode = Billboard2DComponent.REDRAW;
	},

	getComponent: function() {
		return this.renderComponent;
	},

   /**
    * Draws the contents of the billboard to the render context.  This
    * component operates in one of two modes.  When the contents of the
    * subclassed component are redrawing, a temporary render context is created
    * to which the component renders.  The second mode is where the contents
    * of the context from the first mode are rendered instead of performing
    * all of the operations required to render the component.  This component
    * is only good if the contents don't change often.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
      if (!this.base(renderContext, time)) {
         return;
      }

		// Get the host objects bounding box
		var hostBox = this.getHostObject().getBoundingBox().get();

		if (this.mode == Billboard2DComponent.REDRAW) {
			// Provide a temporary context which is used to render the contents to
			Assert((Billboard2DComponent.tempContext != null), "Billboard2DComponent temporary context is not defined!");
			
			// Clear the temporary context and render the associated component to it
			Billboard2DComponent.tempContext.getElement().width = hostBox.w;
			Billboard2DComponent.tempContext.getElement().height = hostBox.h;
			Billboard2DComponent.tempContext.reset();
			Billboard2DComponent.tempContext.setPosition(Point2D.create(Math.abs(hostBox.x), Math.abs(hostBox.y)));
			this.renderComponent.execute(Billboard2DComponent.tempContext, time);
			
			// Extract the rendered image
			this.billboard.attr("src", Billboard2DComponent.tempContext.getDataURL())
				.attr("width", hostBox.w).attr("height", hostBox.h);
			this.mode = Billboard2DComponent.NORMAL;
		}
		
		// Render the billboard.  If the bounding box's origin is negative in
		// either X or Y, we'll need to move the transformation there before rendering the object
		if (hostBox.x < 0 || hostBox.y < 0) {
			renderContext.pushTransform();
			renderContext.setPosition(this.getHostObject().getBoundingBox().getTopLeft());
		}
		renderContext.drawImage(Rectangle2D.create(0, 0, hostBox.w, hostBox.h), this.billboard[0]);	
		if (hostBox.x < 0 || hostBox.y < 0) {
			renderContext.popTransform();
		}
   }

}, /** @scope Billboard2DComponent.prototype */{ 

   /**
    * Get the class name of this object
    *
    * @return {String} "RenderComponent"
    */
   getClassName: function() {
      return "Billboard2DComponent";
   },

   /**
    * The component will render to a temporary context from which the
    * actual content will be rendered.
    * @type {Number}
    */
   REDRAW: 0,

   /**
    * The component will render the contents of the billboard.
    * @type {Number}
    */
   NORMAL: 1,
	
	/**
	 * A temporary context to which all billboards will render their
	 * bitmaps.
	 * @private
	 */
	tempContext: null

});

return Billboard2DComponent;

});
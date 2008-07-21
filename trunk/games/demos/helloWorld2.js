/**
 * The Render Engine
 * A more advanced "Hello World" 2D object
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
 * @param position {Point2D} An optional position for the text to render.
 *                           If not specified, a random position will be assigned.
 */
var HelloWorld2 = Object2D.extend({

   constructor: function(position) {

      /*
       * We call the super class to allow it to set up its data.
       * After that we can set up ourself.
       */
      this.base("HelloWorld2");

      /*
       * This host object is comprised of three components.  One component
       * is responsible for positioning the object in the context.  The second one
       * modifies the position relative to the "world" location and then rotates it.
       * The last one will render text using lines (i.e. vector text). We
       * use components so that an object doesn't have to implement each
       * bit of functionality itself.  So, instead of having to know how
       * to move, rotate, scale, color, draw text, etc. we use these
       * two components which handle it for us.  Examining each component
       * will show you what methods they expose.  But suffice it to say,
       * it will save you time by using components.  Plus, it make
       * your code more clear.  If you need access to the internals of
       * a component from the host object, you need only write accessor
       * methods like the ones in this object.
       *
       * Add each component to this host, and assign a name to it.  The
       * name should be unique amongst all other components.  You can
       * then refer to each component by its name.
       *
       * The priority of the components is important here.  Render components,
       * by default, have a priority of 1.0 (highest) and thus get updated
       * sooner.  Other components have lower priorities which makes them
       * execute later.  We'll have the second transform component be processed
       * after the first one.  The text component has a default of 0.1 (the
       * lowest) which will make it update last.
       */
      this.add(new Transform2DComponent("move"));
      this.add(new HostComponent("host", 0.5));

		var Local = HostObject.extend({

			update: function(renderContext, time) {
				renderContext.pushTransform();
				this.base(renderContext, time);
				renderContext.popTransform();
			}

		});
		var local = new Local();

		local.add(new Transform2DComponent("pos"));
      local.add(new VectorText("text"));

      /*
       * Accessing a component is done by the unique name you gave it
       * when you created it.  It is possible to have more than one
       * component of a given type in a single host.  Just make sure they
       * each have a unique name.  You can then get a component, like below,
       * and call methods on that component to configure or change it.
       * Here we set the text of the VectorText component and the
       * color of it.
       */
      local.getComponent("text").setText("Hello World");
      local.getComponent("text").setColor("white");

      /*
       * Here we set the position relative to its origin point, and
       * then initialize the rotation.
       */
      local.getComponent("pos").setPosition(new Point2D(-40, 0));
      local.getComponent("pos").setRotation(0);

		this.getComponent("host").add("local", local);

      /*
       * We're doing a little work here so that if no position is
       * specified, we'll randomly assign one.
       */
      if (!position)
      {
         // Create a random position
         position = new Point2D( Math.floor(Math.random() * 300),
                                 Math.floor(Math.random() * 400));
      }

      /*
       * This calls the accessor method below which will get the
       * 2D transform component and pass along the position to it.
       * Accessor methods allow you to expose only the parts of a
       * host object that you want to be public.  Even though a
       * javascript objects fields and methods are already public,
       * it is good practice to work with accessor methods.  This will
       * keep your code clean.
       */
      this.setPosition(position);
   },

   /**
    * The method updates the host object in the rendering context.  It
    * is automatically called by the rendering context when it is being
    * updated by the engine.  The rendering context onto which the
    * object is to be drawn will be passed, along with the Engine
    * time.  You can use the time to make adjustments, should you miss
    * a few cycles.  Most times, however, you'll only need the rendering
    * context and the time can just be passed along.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {

      /*
       * Our render context has what is known as a "transform stack"
       * built into it.  This allows us to stack the many transforms that
       * may occur within a single object, and then pop them off that stack
       * (reverting anything we've done such as position and rotation) back
       * to how it was before our object rendered.  You should note that
       * even though we're pushing the transform before the actual update,
       * each component may do their own pushing and popping of the transform.
       * This allows an object to keep transforms relative to the object space
       * rather than doing everything in world space.
       */
      renderContext.pushTransform();

      /*
       * After making sure to push the transform, we call upon the base
       * (super) class to execute all of the components.  See how simple this
       * makes things for us?  We don't need to set colors, move things,
       * or do other messy operations.  Everything is handled in the
       * components so that the code is better segmented and easier to maintain.
       *
       * We pass along the render context, and the engine time, that were passed
       * to this object instance.  This asserts that the components won't render
       * somewhere unexpected or out of whack with this object.
       */
      this.base(renderContext, time);

      /*
       * Finally, since we pushed a transform, we should pop it.  If you fail
       * to pop the transform, the stack will become "unbalanced" and an exception
       * will occur.  Each time a frame is rendered, the stack must end in a
       * balanced state.  Otherwise, transformations and other operations will
       * begin to aggregate into an unknown state.
       */
      renderContext.popTransform();

   },

   /**
    * An accessor method that gets the position from the "move" component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   /**
    * An accessor method allowing us to set the position on the "move" component.
    * @param point {Point2D} The position of the object
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * An accessor method that gets the rotation from the "move" component.
    * @type Number
    */
   getRotation: function() {
      return this.getComponent("host").get("local").getComponent("pos").getRotation();
   },

   /**
    * An accessor method allowing us to set the rotation on the "move" component.
    * @param angle {Number} The rotation of the object
    */
   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("host").get("local").getComponent("pos").setRotation(angle);
   },

   /**
    * Each object should have this method declared so that the class
    * name of the object can be ascertained.  We can use this string form
    * of the class name to get at the actual object through indirection.
    * @type String
    */
   getClassName: function() {
      return "HelloWorld2";
   }
});

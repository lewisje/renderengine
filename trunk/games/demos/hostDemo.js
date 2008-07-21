/**
 * The Render Engine
 * Introduction Demo: Creating a render context
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 141 $
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

// Load the "CanvasContext" rendering context class file
Engine.load("/rendercontexts/context.canvascontext.js");

// Load the vector text renderer
Engine.load("/textrender/text.vector.js");

// Load a transform component
Engine.load("/components/component.transform2d.js");

/*
 * We load the HelloWorld object which is relative to
 * the game.  Examine "helloWorld.js" to see what exactly a
 * host object is.
 */
Game.load("helloWorld.js");

/*
 * The anonymous function specified in the queue callback
 * will be executed after the above script has been loaded.
 * You can inject a function call into the queue to make
 * sure that all previous scripts are loaded before performing
 * some action.  We're using this mechanism to start the demo
 * running.
 */
Engine.setQueueCallback(function() { new HostDemo(); });

/*
 * The IntroDemo object extends the BaseObject object so we
 * can add it to the demoContainer object located in the DemoHost
 * object.  It can be cleaned up when the demo is either
 * terminated, or a demo is unloaded.
 */
var HostDemo = BaseObject.extend({

   /*
    * This field will contain a reference to our rendering
    * context.  We can then access it anywhere within our instance
    * to add or remove objects from the context.
    */
   renderContext: null,

	/*
	 * These two objects will represent our host objects.  They
	 * are two instances of the exact same object.
	 */
   hello1: null,
   hello2: null,

	/*
	 * We'll have a little fun and animate the objects. There
	 * are many ways to animate an object, with this timer
	 * being one of the easiest.
	 */
   timer: null,

   constructor: function() {

      /*
       * We call the super class (the BaseObject object) and
       * pass the name of our object to it.  This way, we can
       * refer to an object in the game engine by name.
       */
      this.base("HostDemo");

      /*
       * Now we add ourself to the DemoHost object's demoContainer
       * object so we can be cleaned up.  The DemoHost object (and all
       * Game object subclasses) are logically "static".  This means that
       * we can refer to it by it's declared object name, and access any
       * methods (functions) and fields within it.
       */
      DemoHost.demoContainer.add(this);

      /*
       * We're calling the "run" method to start our execution.  Without
       * this call, nothing would happen beyond this point.
       */
      this.run();
   },

   /**
    * All objects that extend from BaseObject have a "destroy" method on
    * them.  You can extend this method to perform any additional cleanup
    * that you need.
    */
   destroy: function() {

		/*
		 * Anything that we create should be destroyed.  This way we
		 * can keep our memory clean and allow the garbage collector
		 * to clean up objects as they become unused.
		 */
      this.timer.destroy();
      this.renderContext.destroy();

		/*
		 * Remember to call the base class, unless you are overriding
		 * the method.  In the case of the "destroy" method, you'll
		 * almost always want to call the base class.
		 */
      this.base();
   },

   /**
    * Run the demo
    */
   run: function() {

      /*
       * Create the render context and add it to the Engine
       */
      this.renderContext = new CanvasContext(350, 450);
      Engine.getDefaultContext().add(this.renderContext);
      this.renderContext.setBackgroundColor("blue");

		/*
		 * Here we create two instances of our host object. Each instance
		 * is controlled independent of the other.  We can have as many
		 * instances of an object as we want, but remember that it takes
		 * time to process each object and then render it.  More objects on
		 * screen will result in a real framerate drop.
		 */
		this.hello1 = new HelloWorld();
		this.hello2 = new HelloWorld();

		/*
		 * Here we add the objects to the rendering context so that they
		 * will be drawn.  Missing this step will result in your not
		 * seeing anything, and a lot of headaches!  Some components
		 * are not rendered, but should still be added to the context
		 * so they get updated with the rest.
		 */
		this.renderContext.add(this.hello1);
		this.renderContext.add(this.hello2);

		/*
		 * We're about to create the timer.  It uses what is known as
		 * an anonymous function.  The function itself has no object scope
		 * except for itself.  Thus, if we refer to "this" in the anonymous
		 * function, we are referring to the function.  In this case we
		 * want to refer to the DemoHost class instance.  To do so, we create
		 * a reference pointer to the instance and refer to that in the function.
		 * It sets up what is known as a "closure" (a topic beyond this demo)
		 * which allows us to access the "this" pointer indirectly.
		 */
		var self = this;

		/*
		 * Finally, here we are at the animation timer.  We'll make our
		 * two host objects rotate in opposite directions.  If you examined the
		 * host object, you'll notice there were accessor methods for getting
		 * and setting position, rotation, and scale.  We'll call upon those
		 * methods of the host object, which will in-turn call the appropriate
		 * method on the appropriate component.  Every 10 milliseconds our
		 * timer will update the two objects.
		 */
		this.timer = new Interval("HostTimer", 10, function() {

			/*
			 * Here is that indirect reference I was telling you about.  We
			 * created a reference to the instance of the DemoHost object and
			 * called it "self".  So, "self" is actually now a reference to
			 * the "this" pointer in the scope outside of this anonymous function.
			 *
			 * We'll get the rotation of the two host objects and then modify
			 * them so one rotates clockwise and the other counter clockwise.  We
			 * set rotations in degrees.
			 */
			var r1 = self.hello1.getRotation();
			var r2 = self.hello2.getRotation();

			/*
			 * We want to do some "bounds checking" on the two values to keep
			 * them within a suitable range.  Here we'll be keeping the two
			 * values between zero and 360 degrees.
			 */
			r1 = r1 < 360 ? r1 + 2 : 0;
			r2 = r2 > 0 ? r2 - 2 : 360;

			/*
			 * Finally, we set the rotation of the two host objects, which
			 * will set the rotation on the transform component of each.
			 */
			self.hello1.setRotation(r1);
			self.hello2.setRotation(r2);
		});
   }
});

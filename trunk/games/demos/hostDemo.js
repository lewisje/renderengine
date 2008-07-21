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

   hello1: null,

   hello2: null,

   constructor: function() {

      /*
       * We call the super class (the Container object) and
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
       * We need to clean up our render context.
       */
      this.renderContext.destroy();
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


		this.hello1 = new HelloWorld();
		this.hello2 = new HelloWorld();

		this.renderContext.add(this.hello1);
		this.renderContext.add(this.hello2);


   }

});

/**
 * The Render Engine
 * Introduction Demo: Creating a render context
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

// Load the "CanvasContext" rendering context class file
Engine.load("/rendercontexts/context.canvascontext.js");

/*
 * The anonymous function specified in the queue callback
 * will be executed after the above script has been loaded.
 * You can inject a function call into the queue to make
 * sure that all previous scripts are loaded before performing
 * some action.  We're using this mechanism to start the demo
 * running.
 */
Engine.setQueueCallback(function() { new IntroDemo(); });

/*
 * The IntroDemo object extends the BaseObject object so we
 * can add it to the demoContainer object located in the DemoHost
 * object.  It can be cleaned up when the demo is either
 * terminated, or a demo is unloaded.
 */
var IntroDemo = BaseObject.extend({

   /*
    * This field will contain a reference to our rendering
    * context.  We can then access it anywhere within our instance
    * to add or remove objects from the context.
    */
   renderContext: null,

   constructor: function() {

      /*
       * We call the super class (the Container object) and
       * pass the name of our object to it.  This way, we can
       * refer to an object in the game engine by name.
       */
      this.base("IntroDemo");

      /*
       * We're calling the "run" method to start our execution.  Without
       * this call, nothing would happen beyond this point.
       */
      this.run();
   },

   init: function() {
      /*
       * Now we add ourself to the DemoHost object's demoContainer
       * object so we can be cleaned up.  The DemoHost object (and all
       * Game object subclasses) are logically "static".  This means that
       * we can refer to it by it's declared object name, and access any
       * methods (functions) and fields within it.
       */
      DemoHost.demoContainer.add(this);
	},

   /**
    * All objects that extend from BaseObject (in this case, Container)
    * have a "destroy" method on them.  You can extend this method to
    * perform any additional cleanup that you need.
    */
   destroy: function() {

   },

   /**
    * Run the demo
    */
   run: function() {

      /*
       * A rendering context is where everything is put that needs to be
       * drawn to the screen (e.g. rendered).  There is a default context
       * that is created when the Engine starts, and this context is essentially
       * a wrapper around the HTML Document object (or the DOM).  We're creating
       * another context and adding it to the default context.  A CanvasContext
       * needs only know how big you want it to be.  We provide the width and
       * height for it.
       */
      this.renderContext = new CanvasContext(350, 450);

      /*
       * After creating the context, we want to make sure that it will be
       * updated by the Engine.  Every frame that is rendered will call our
       * rendering context and update any objects that need to be drawn.
       * To do this, we only need to add it to the Engine's default context.
       */
      Engine.getDefaultContext().add(this.renderContext);

      /*
       * Finally, we'll set it's background color to blue to make it
       * at least a little interesting.  Some colors can be referred to
       * by name.  Other colors will require you to provide a hexadecimal
       * specification for them.  The format is fairly simple: #rrggbb.
       * Each pair of letters refers to a 2-digit hex number.  The value can
       * be between zero "00" and 255 "ff".  So, "blue" in our example
       * could also be represented in hex with "#0000ff".  No red, no green,
       * just all blue.  Higher numbers are lighter and lower are darker.
       * If we wanted to make the color more of a navy blue, we could use
       * "#000088" (or, in this case, the word "navy").
       */
      this.renderContext.setBackgroundColor("blue");
   }

});

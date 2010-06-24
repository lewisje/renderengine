/**
 * The Render Engine
 * Wii Testing
 *
 * A simple game of bouncing balls
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

// Load all required engine components
Engine.include("/rendercontexts/context.htmldivcontext.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");

// Load game objects
Game.load("/wiihost.js");
Game.load("/wiiball.js");

Engine.initObject("WiiTest", "Game", function(){

   /**
    * @class Wii ball bounce game.  Press the A button over a ball
    *        to make it bounce.  Press A when not over a ball to create
    *        another ball.
    */
   var WiiTest = Game.extend({
   
      constructor: null,
      
      // The rendering context
      renderContext: null,
      
      // Engine frames per second
      engineFPS: 60,
      
      // The play field
      fieldBox: null,
      fieldWidth: 800,
      fieldHeight: 460,

      // Sprite resource loader
      spriteLoader: null,
      
      // The collision model
      cModel: null,
      
      /**
       * Called to set up the game, download any resources, and initialize
       * the game to its running state.
       */
      setup: function(){
         // Set the FPS of the game
         Engine.setFPS(this.engineFPS);
         
         this.spriteLoader = SpriteLoader.create();
         
         // Load the sprites
         this.spriteLoader.load("redball", this.getFilePath("resources/redball.js"));
         
         // Don't start until all of the resources are loaded
         WiiTest.loadTimeout = Timeout.create("wait", 250, WiiTest.waitForResources);
         this.waitForResources();
      },
      
      /**
       * Wait for resources to become available before starting the game
       * @private
       */
      waitForResources: function(){
         if (WiiTest.spriteLoader.isReady()) {
               WiiTest.loadTimeout.destroy();
               WiiTest.run();
               return;
         }
         else {
            // Continue waiting
            WiiTest.loadTimeout.restart();
         }
      },
      
      /**
       * Called when a game is being shut down to allow it to clean up
       * any objects, remove event handlers, destroy the rendering context, etc.
       */
      teardown: function(){
         this.renderContext.destroy();
      },
      
      /**
       * Run the game
       */
      run: function(){
         // Remove the "loading" message
         $("#loading").remove();
         
         // Create the render context
         this.fieldWidth = Engine.getDebugMode() ? 400 : this.fieldWidth;
         this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
         this.centerPoint = this.fieldBox.getCenter();
         this.renderContext = HTMLDivContext.create("Playfield", this.fieldWidth, this.fieldHeight);
         this.renderContext.jQ().css({
            border: "1px solid red",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0});
         Engine.getDefaultContext().add(this.renderContext);

         // Create the collision model with 5x5 divisions
         this.cModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 5);

         // Add the first ball
         var ball = WiiBall.create();
         this.getRenderContext().add(ball);
         
         // Add the player object
         var player = WiiHost.create();
         this.getRenderContext().add(player);
      },
      
      /**
       * Return a reference to the render context
       */
      getRenderContext: function(){
         return this.renderContext;
      },
      
      /**
       * Return a reference to the playfield box
       */
      getFieldBox: function() {
         return this.fieldBox;
      },
      
      /**
       * return a reference to the collision model
       */
      getCModel: function() {
         return this.cModel;
      }
      
   });
   
   return WiiTest;
   
});
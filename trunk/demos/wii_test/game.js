/**
 * The Render Engine
 * Wii Testing
 *
 * Some simple tests for the Wii
 *
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

// Load all required engine components
Engine.include("/rendercontexts/context.htmldivcontext.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.image.js");
Engine.include("/engine/engine.timers.js");

// Load game objects
Game.load("/wiihost.js");
Game.load("/dummy.js");

Engine.initObject("WiiTest", "Game", function(){

   /**
    * @class The game.
    */
   var WiiTest = Game.extend({
   
      constructor: null,
      
      renderContext: null,
      
      fieldBox: null,
      areaScale: 1.0,
      
      engineFPS: 15,
      
      fieldWidth: 320,
      fieldHeight: 400,
      spriteLoader: null,
      imageLoader: null,
      
      
      /**
       * Handle the keypress which starts the game
       *
       * @param event {Event} The event object
       onKeyPress: function(event) {
       if (event.keyCode == EventEngine.KEYCODE_ENTER)
       {
       Spaceroids.startGame();
       }
       },
       */
      /**
       * This method is being used to clean up the demo container.
       * Each demo is loaded into this container, and when a demo
       * is unloaded we can call this method to clean it up.
       */
      cleanup: function(){
         this.renderContext.cleanUp();
      },
      
      /**
       * Called to set up the game, download any resources, and initialize
       * the game to its running state.
       */
      setup: function(){
      
         // Set the FPS of the game
         Engine.setFPS(this.engineFPS);
         
         this.spriteLoader = SpriteLoader.create();
         this.imageLoader = ImageLoader.create();
         
         // Load the music
         //      this.soundLoader.load("bgm", this.getFilePath("resources/smblvl1.mp3"));
         
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
         if (WiiTest.imageLoader.isReady() &&
         WiiTest.spriteLoader.isReady()) {
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
      
      run: function(){
         $("#loading").remove();
         
         // Create the render context
         this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
         this.centerPoint = this.fieldBox.getCenter();
         
         var field = $("<div>").css({
            width: this.fieldWidth,
            height: this.fieldHeight,
            border: "1px solid red",
            position: "relative"
         });
         
         this.renderContext = HTMLDivContext.create("Playfield", this.fieldWidth, this.fieldHeight);
         this.renderContext.jQ().css({
            border: "1px solid red",
            position: "relative"});
         Engine.getDefaultContext().add(this.renderContext);
         WiiTest.play();
      },
      
      play: function(){
         var player = WiiHost.create();
         this.getRenderContext().add(player);
      },
      
      getRenderContext: function(){
         return this.renderContext;
      }
      
   });
   
   return WiiTest;
   
});

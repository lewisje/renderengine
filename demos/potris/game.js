
/**
 * The Render Engine
 * PoTris
 *
 * A combination of tetris and poker.  Blocks of the tetris variety will drop
 * but the tiles will be cards of varying suits and faces.  Make poker hands
 * across (maybe up/down and diagonally at some point) with wild cards thrown
 * in to make a hand.
 *
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 350 $
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
Engine.include("/rendercontexts/context.htmlelement.js");
Engine.include("/resourceloaders/loader.sound.js");
Engine.include("/resourceloaders/loader.image.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/engine/engine.timers.js");

// Load game objects

Engine.initObject("PoTris", "Game", function() {

/**
 * @class The game.
 */
var PoTris = Game.extend({

   constructor: null,

   renderContext: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: 1.0,

   engineFPS: 5,

   fieldWidth: 210,	// 30px tile width * 7 tiles
   fieldHeight: 450, // 30px tile height * 15 tiles

   spriteLoader: null,
   soundLoader: null,
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
   cleanup: function() {
      this.renderContext.cleanUp();
   },

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {

      // Set the FPS of the game
      Engine.setFPS(this.engineFPS);

      this.soundLoader = SoundLoader.create();
      this.imageLoader = ImageLoader.create();

      // Load the music
//      this.soundLoader.load("bgm", this.getFilePath("resources/smblvl1.mp3"));

      // Load the card images
      this.imageLoader.load("club", this.getFilePath("resources/club.png"), 30, 30);
      this.imageLoader.load("spade", this.getFilePath("resources/spade.png"), 30, 30);
      this.imageLoader.load("diamond", this.getFilePath("resources/diamond.png"), 30, 30);
      this.imageLoader.load("heart", this.getFilePath("resources/heart.png"), 30, 30);

		// Don't start until all of the resources are loaded
      PoTris.loadTimeout = Timeout.create("wait", 250, PoTris.waitForResources);
      this.waitForResources();
   },

   /**
    * Wait for resources to become available before starting the game
    * @private
    */
   waitForResources: function() {
      if (PoTris.imageLoader.isReady() &&
          PoTris.soundLoader.isReady())
      {
         PoTris.loadTimeout.destroy();
         PoTris.run();
         return;
      }
      else
      {
			// Continue waiting
         PoTris.loadTimeout.restart();
      }
   },

   /**
    * Called when a game is being shut down to allow it to clean up
    * any objects, remove event handlers, destroy the rendering context, etc.
    */
   teardown: function() {
      this.renderContext.destroy();
   },

   run: function() {
      $("#loading").remove();

      // Create the render context
      this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
      this.centerPoint = this.fieldBox.getCenter();

		var field = $("<div>").css({
			width: this.fieldWidth,
			height: this.fieldHeight,
			border: "1px solid black",
			position: "relative"
		});

      this.renderContext = HTMLElementContext.create("Playfield", field[0]);
      Engine.getDefaultContext().add(this.renderContext);
      this.play();
   },

   play: function() {
	},

   getRenderContext: function() {
      return this.renderContext;
   }

});

return PoTris;

});
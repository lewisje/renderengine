
/**
 * The Render Engine
 * Sprite test
 *
 * Demonstration of using The Render Engine.
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
Engine.include("/rendercontexts/context.scrollingbackground.js");
Engine.include("/resourceloaders/loader.sound.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.level.js");
Engine.include("/engine/engine.timers.js");

Engine.include("/objects/object.spriteactor.js");
Engine.include("/objects/object.collisionbox.js");

Engine.include("/tools/level_editor/leveleditor.js");

Engine.initObject("SuperMario", "Game", function() {

/**
 * @class The game.
 */
var SuperMario = Game.extend({

   constructor: null,

   renderContext: null,
   scrollBkg: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: 1.0,

   engineFPS: 30,

   fieldWidth: 640,
   fieldHeight: 448,

   spriteLoader: null,
   soundLoader: null,
   levelLoader: null,

   level: null,
   
   nextZ: 1,

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

      this.spriteLoader = SpriteLoader.create();
      this.soundLoader = SoundLoader.create();
      this.levelLoader = LevelLoader.create();

      // Load the music
      this.soundLoader.load("bgm", this.getFilePath("resources/smblvl1.mp3"));

      // Load the level
      this.levelLoader.load("level1", this.getFilePath("resources/smblevel1.js"));

      // Load the sprites
      this.spriteLoader.load("smbtiles", this.getFilePath("resources/smbtiles.js"));
      SuperMario.loadTimeout = Timeout.create("wait", 250, SuperMario.waitForResources);
      this.waitForResources();
   },

   /**
    * Wait for resources to become available before starting the game
    * @private
    */
   waitForResources: function() {
      //Console.debug("checking");
      if (SuperMario.spriteLoader.isReady("smbtiles") &&
          SuperMario.levelLoader.isReady("level1") &&
          SuperMario.soundLoader.isReady("bgm"))
      {
         this.destroy();
         SuperMario.run();
         return;
      }
      else
      {
         this.restart();
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

      // Create the 2D context
      this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
      this.centerPoint = this.fieldBox.getCenter();

      this.level = this.levelLoader.getLevel("level1");

      this.renderContext = ScrollingBackground.create("bkg", this.level, this.fieldWidth, this.fieldHeight);
      this.renderContext.setWorldScale(this.areaScale);
      Engine.getDefaultContext().add(this.renderContext);

      if (EngineSupport.checkBooleanParam("edit")) {
         LevelEditor.edit(this);
      } else {
         this.play();
      }
   },

   play: function() {
      //this.soundLoader.get("bgm").play();

      var player = SpriteActor.create();
      player.setSprite(this.spriteLoader.getSprite("smbtiles", "super_walk"));
      player.setPosition(Point2D.create(100, 338));
      this.renderContext.add(player);

      var mario = SpriteActor.create();
      mario.setSprite(this.spriteLoader.getSprite("smbtiles", "mario_walk"));
      mario.setPosition(Point2D.create(228, 370));
      this.renderContext.add(mario);
   },

   /**
    * A simple method that determines if the position is within the supplied bounding
    * box.
    *
    * @param pos {Point2D} The position to test
    * @param bBox {Rectangle2D} The bounding box of the playfield
    * @type Boolean
    */
   inField: function(pos, bBox) {
      var newPos = this.wrap(pos, bBox);
      return newPos.equals(pos);
   },

   getLevel: function() {
      return this.level;
   },

   getRenderContext: function() {
      return this.renderContext;
   }

});

return SuperMario;

});

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

// Load required engine components
Engine.load("/rendercontexts/context.canvascontext.js");
Engine.load("/objects/object.background.js");
Engine.load("/components/component.transform2d.js");
Engine.load("/components/component.render.js");
Engine.load("/components/component.sprite.js");
Engine.load("/components/component.input.js");
Engine.load("/components/component.keyboardinput.js");
Engine.load("/resourceloaders/loader.sound.js");
Engine.load("/resourceloaders/loader.image.js");
Engine.load("/resourceloaders/loader.sprite.js");
Engine.load("/resourceloaders/loader.level.js");

// Load game objects
Game.load("/actor.js");

// Start the game when all the scripts are loaded.
Engine.setQueueCallback(function() { SpriteTest.setup(); });

/**
 * @class The game.
 */
var SpriteTest = Game.extend({

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
      this.soundLoader = SoundResourceLoader.create();
		this.levelLoader = LevelLoader.create();

      // Load the music
      this.soundLoader.load("bgm", "resources/smblvl1.mp3");

		// Load the level
		this.levelLoader.load("level1", "resources/smblevel1.js");

      // Load the sprites
      this.spriteLoader.load("smbtiles", "resources/smbtiles.js");
      SpriteTest.loadTimeout = Timeout.create("wait", 250, SpriteTest.waitForResources);
      this.waitForResources();
   },

   /**
    * Wait for resources to become available before starting the game
    * @private
    */
   waitForResources: function() {
      //Console.debug("checking");
      if (SpriteTest.spriteLoader.isReady("smbtiles") &&
      	 SpriteTest.levelLoader.isReady("level1"))
      {
         SpriteTest.loadTimeout.destroy();
         SpriteTest.run();
         return;
      }
      else
      {
         SpriteTest.loadTimeout.restart();
      }
   },

   /**
    * Called when a game is being shut down to allow it to clean up
    * any objects, remove event handlers, destroy the rendering context, etc.
    */
   teardown: function() {
      renderContext.destroy();
   },

   run: function() {
		$("#loading").remove();

		// Create the 2D context
		this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
		this.centerPoint = this.fieldBox.getCenter();

		var level = SpriteTest.levelLoader.getLevel("level1");

		this.scrollBkg = ScrollingBackground.create("bkg", level, this.fieldWidth, this.fieldHeight);
		Engine.getDefaultContext().add(this.scrollBkg);

		this.renderContext = CanvasContext.create(this.fieldWidth, this.fieldHeight);
		this.renderContext.setWorldScale(this.areaScale);
		$(this.renderContext.getSurface()).css({ position: "absolute", top: "0px"});
		Engine.getDefaultContext().add(this.renderContext);

		//this.renderContext.setBackgroundColor("#5c94fc");

      var player = SpriteTest.Actor.create();
      player.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "super_walk"));
      player.setPosition(Point2D.create(100, 346));
      this.renderContext.add(player);

      var goomba = SpriteTest.Actor.create();
      goomba.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "goomba"));
      goomba.setPosition(Point2D.create(164, 378));
      this.renderContext.add(goomba);

      var mario = SpriteTest.Actor.create();
      mario.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "mario_walk"));
      mario.setPosition(Point2D.create(228, 378));
      this.renderContext.add(mario);

      var koopa = SpriteTest.Actor.create();
      koopa.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "green_koopa"));
      koopa.setPosition(Point2D.create(292, 346));
      this.renderContext.add(koopa);

      var coin = SpriteTest.Actor.create();
      coin.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "coin"));
      coin.setPosition(Point2D.create(356, 378));
      this.renderContext.add(coin);

      var qblock = SpriteTest.Actor.create();
      qblock.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", "q_block"));
      qblock.setPosition(Point2D.create(420, 378));
      this.renderContext.add(qblock);

      //this.soundLoader.get("bgm").play();
      SpriteTest.scrollAmt = 0;
      SpriteTest.sTimer = Interval.create("scroll", 50, function() {
			SpriteTest.scrollBkg.setHorizontalScroll(SpriteTest.scrollAmt+=3);
		});
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

   /**
    * Called to wrap an object around the edges of the playfield.
    *
    * @param pos {Point2D} The position of the object
    * @param bBox {Rectangle2D} The bounding box of the playfield
    */
   wrap: function(pos, bBox) {

      // Get XY radius and set new collision box
      var rX = Math.floor(bBox.len_x() / 2);
      var rY = Math.floor(bBox.len_y() / 2);

      // Wrap if it's off the playing field
      var p = new Point2D(pos);
      var x = p.x;
      var y = p.y;
      var fTL = this.fieldBox.getTopLeft();
      var fDM = this.fieldBox.getDims();

      if (pos.x < fTL.x || pos.x > fTL.x + fDM.x ||
          pos.y < fTL.y || pos.y > fTL.y + fDM.y)
      {
         if (pos.x > fTL.x + fDM.x + rX)
         {
            x = (fTL.x - (rX - 10));
         }
         if (pos.y > fTL.y + fDM.y + rY)
         {
            y = (fTL.y - (rY - 10));
         }
         if (pos.x < fTL.x - rX)
         {
            x = (fTL.x + fDM.x + (rX - 10));
         }
         if (pos.y < fTL.y - rY)
         {
            y = (fTL.y + fDM.y + (rX - 10));
         }
         p.set(x,y);
      }
      return p;
   }

});


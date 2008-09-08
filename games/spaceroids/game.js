
/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * This is an example of using The Render Engine to create a simple
 * game.  This game is based off of the popular vector shooter, Asteroids,
 * which is (c)Copyright 1979 - Atari Corporation.
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
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/platform/engine.spatialgrid.js");
Engine.include("/platform/engine.timers.js");
Engine.include("/textrender/text.vector.js");
Engine.include("/textrender/text.renderer.js");
Engine.include("/resourceloaders/loader.sound.js");

// Load game objects
Game.load("/rock.js");
Game.load("/player.js");
Game.load("/bullet.js");
Game.load("/particle.js");

Engine.initObject("Spaceroids", "Game", function() {

/**
 * @class The game.
 */
var Spaceroids = Game.extend({

   constructor: null,

   renderContext: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: 0.8,

   engineFPS: 60,

   collisionModel: null,

   rocks: 0,

   fieldWidth: 500,
   fieldHeight: 580,

   hiScore: 0,
   playerScore: 0,

   debug: true,

   scoreObj: null,
   hscoreObj: null,
   playerObj: null,

   showStart: false,

   pEngine: null,

   level: 0,

   /**
    * Handle the keypress which starts the game
    *
    * @param event {Event} The event object
    */
   onKeyPress: function(event) {
      if (event.keyCode == EventEngine.KEYCODE_ENTER ||
          event.keyCode == 65 || event.keyCode == 97)
      {
         Spaceroids.startGame();
      }
   },

   /**
    * Clean up the playfield, removing any objects that are
    * currently within the render context.  Used to initialize the game
    * and to handle transitions between attract mode and play mode.
    */
   cleanupPlayfield: function() {

      // Remove any rocks still floating around
      var objs = this.renderContext.getObjects();
      while (objs.length > 0)
      {
         objs.shift().destroy();
      }

      this.rocks = 0;
      this.level = 0;

      this.scoreObj = null;
      this.hscoreObj = null;
   },

   /**
    * A simple mode where the title, highscore, game over message,
    * and start message are displayed with asteroids in the background
    */
   attractMode: function() {

      this.cleanupPlayfield();
      Spaceroids.isAttractMode = true;

      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;

      // Add some asteroids
      for (var a = 0; a < 1; a++)
      {
         var rock = SpaceroidsRock.create(null, null, pWidth, pHeight);
         this.renderContext.add(rock);
         rock.setup();
         rock.killTimer = Engine.worldTime + 2000;
      }

      var title = TextRenderer.create(VectorText.create(), "Asteroids", 2);
      title.setPosition(Point2D.create(150, 100));
      title.setTextWeight(1);
      title.setColor("#ffffff");
      this.renderContext.add(title);

      var copy = TextRenderer.create(VectorText.create(), "&copy;1979 Atari Games", 1);
      copy.setColor("#ffffff");
      copy.setPosition(Point2D.create(145, 130));
      this.renderContext.add(copy);

      var startText;
      if (window.opera && opera.wiiremote) {
         startText = "[ Press =A Button= to Start ]";

         var wii = TextRenderer.create(VectorText.create(), "(Wii Detected)", 1);
         wii.setColor("#ffffff");
         wii.setPosition(Point2D.create(160, 470));
         this.renderContext.add(wii);
      } else {
         startText = "[ Press =Enter= to Start ]";
      }

      Spaceroids.start = TextRenderer.create(VectorText.create(), startText, 1);
      Spaceroids.start.setPosition(Point2D.create(96, 450));
      Spaceroids.start.setColor("#ffffff");
      Spaceroids.renderContext.add(Spaceroids.start);

      var flash = function() {
         if (!Spaceroids.showStart)
         {
            Spaceroids.start.setDrawMode(TextRenderer.DRAW_TEXT);
            Spaceroids.showStart = true;
            Spaceroids.intv.restart();
         }
         else
         {
            Spaceroids.start.setDrawMode(TextRenderer.NO_DRAW);
            Spaceroids.showStart = false;
            Spaceroids.intv.restart();
         }
      };

      Spaceroids.intv = Timeout.create("startkey", 1000, flash);

      // Start up a particle engine
      this.pEngine = ParticleEngine.create()
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.gameOver();

      // Create a new rock every 20 seconds
      Spaceroids.attractTimer = Interval.create("attract", 20000,
         function() {
            var rock = SpaceroidsRock.create(null, null, Spaceroids.fieldWidth, Spaceroids.fieldHeight);
            Spaceroids.renderContext.add(rock);
            rock.setup();
            rock.killTimer = Engine.worldTime + 2000;
         });

   },

   /**
    * Add the highscore object to the playfield.
    */
   addHiScore: function() {
      this.hscoreObj = TextRenderer.create(VectorText.create(), this.hiScore, 2);
      this.hscoreObj.setPosition(Point2D.create(400, 20));
      this.hscoreObj.setColor("#ffffff");
      this.hscoreObj.setTextWeight(0.5);
      this.hscoreObj.setTextAlignment(AbstractTextRenderer.ALIGN_RIGHT);
      this.renderContext.add(this.hscoreObj);
   },

   /**
    * Add the score object to the playfield.
    */
   addScore: function() {
      this.scoreObj = TextRenderer.create(VectorText.create(), this.playerScore, 2);
      this.scoreObj.setPosition(Point2D.create(130, 20));
      this.scoreObj.setColor("#ffffff");
      this.scoreObj.setTextWeight(0.5);
      this.scoreObj.setTextAlignment(AbstractTextRenderer.ALIGN_RIGHT);
      this.renderContext.add(this.scoreObj);
   },

   /**
    * Called to add points to the player's score.
    *
    * @param howMany {Number} The number of points to add to the player's score.
    */
   scorePoints: function(howMany) {
      this.playerScore += howMany;
      if (this.playerScore > this.hiScore)
      {
         this.hiScore = this.playerScore;
         this.hscoreObj.setText(this.hiScore);
      }

      this.scoreObj.setText(this.playerScore);
   },

   /**
    * Start the game, resetting the playfield and creating the player.
    * If the game is already running, has no effect.
    */
   startGame: function() {

      if (this.gameRunning)
      {
         return;
      }

      Spaceroids.attractTimer.destroy();
      Spaceroids.isAttractMode = false;

      Spaceroids.intv.destroy();

      this.playerScore = 0;
      this.cleanupPlayfield();

      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;

      this.nextLevel();

      this.playerObj = SpaceroidsPlayer.create();
      this.renderContext.add(this.playerObj);
      this.playerObj.setup(pWidth, pHeight);

      // Start up a particle engine
      this.pEngine = ParticleEngine.create()
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.addScore();
      this.scorePoints(0);

      // Start the "music" track
      Spaceroids.soundNum = 1;
      Spaceroids.gameSound = Interval.create("gameSound", 1000, function() {
         if (Spaceroids.soundNum == 1) {
            Spaceroids.soundLoader.get("lowboop").play();
            Spaceroids.soundNum = 2;
         } else {
            Spaceroids.soundLoader.get("hiboop").play();
            Spaceroids.soundNum = 1;
         }
      });

      this.gameRunning = true;
   },

   nextLevel: function() {
      Spaceroids.level++;

      if (Spaceroids.level > 7) {
         Spaceroids.level = 7;
      }

      // Add some asteroids
      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;

      for (var a = 0; a < Spaceroids.level + 1; a++)
      {
         var rock = SpaceroidsRock.create(null, null, pWidth, pHeight);
         this.renderContext.add(rock);
         rock.setup();
      }
   },

   /**
    * Called when the game is over to draw the game over message and
    * set a timer to return to attract mode.
    */
   gameOver: function() {

      //var g = new TextRenderer(new BitmapText(Spaceroids.fontLoader.get("lucida")), "Game Over", 1.5);

      var g = TextRenderer.create(VectorText.create(), "Game Over", 3);
      g.setPosition(Point2D.create(100, 260));
      g.setTextWeight(0.25);
      g.setColor("#ffffff");
      this.renderContext.add(g);

      if (!this.gameRunning)
      {
         return;
      }

      Spaceroids.gameSound.destroy();

      this.gameRunning = false;

      // Remove the player
      if (this.playerObj)
      {
         this.renderContext.remove(this.playerObj);
      }

      // Back to attract mode in 10sec
      var t = Timeout.create("gameover", 10000, function() { Spaceroids.attractMode(); });
   },

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
      $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(this.engineFPS);

      // Create the 2D context
      this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
      this.centerPoint = this.fieldBox.getCenter();
      this.renderContext = CanvasContext.create("playfield", this.fieldWidth, this.fieldHeight);
      this.renderContext.setWorldScale(this.areaScale);
      Engine.getDefaultContext().add(this.renderContext);
      this.renderContext.setBackgroundColor("#000000");

      // We'll need something to detect collisions
      this.collisionModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 7);

      EventEngine.setHandler(document, "keypress", Spaceroids.onKeyPress);

      // Load our font
//      Spaceroids.fontLoader = new BitmapFontLoader();
//      Spaceroids.fontLoader.load("lucida", "lucida_sans_36.js");

//      Spaceroids.loadTimeout = new Timeout("wait", 250, Spaceroids.waitForResources);
//      this.waitForResources();

      this.soundLoader = SoundLoader.create();

      // Load the sounds
      this.soundLoader.load("explode", this.getFilePath("resources/explode1.mp3"));
      this.soundLoader.load("shoot", this.getFilePath("resources/shoot.mp3"));
      this.soundLoader.load("death", this.getFilePath("resources/explode2.mp3"));
      this.soundLoader.load("thrust", this.getFilePath("resources/thrust.mp3"));
      this.soundLoader.load("lowboop", this.getFilePath("resources/low.mp3"));
      this.soundLoader.load("hiboop", this.getFilePath("resources/hi.mp3"));

      Spaceroids.attractMode();
   },

   /**
    * Wait for resources to become available before starting the game
    * @private
    */
   waitForResources: function() {
      //Console.debug("checking");
      if (Spaceroids.fontLoader.isReady("lucida"))
      {
         Spaceroids.loadTimeout.destroy();
         Spaceroids.attractMode();
         return;
      }
      else
      {
         Spaceroids.loadTimeout.restart();
      }
   },

   /**
    * Called when the game is being shut down to allow the game
    * the chance to clean up any objects, remove event handlers, and
    * destroy the rendering context.
    */
   teardown: function() {
      this.scoreObj = null
      this.hscoreObj = null;

      EventEngine.removeHandler(document, "keypress", Spaceroids.onKeyPress);

      this.renderContext.destroy();
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

      var rX = bBox.len_x();
      var rY = bBox.len_y();

      // Wrap if it's off the playing field
      var p = new Point2D(pos);
      var x = p.x;
      var y = p.y;
      var fb = this.renderContext.getViewport().get();

      if (pos.x < fb.x || pos.x > fb.r ||
          pos.y < fb.y || pos.y > fb.h)
      {
         if (pos.x > fb.r + (rX * 2))
         {
            x = (fb.x - rX);
         }
         if (pos.y > fb.h + (rY * 2))
         {
            y = (fb.y - rY);
         }
         if (pos.x < fb.x - rX)
         {
            x = (fb.r + (rX * 2));
         }
         if (pos.y < fb.y - rY)
         {
            y = (fb.h + (rY * 2));
         }
         p.set(x,y);
      }
      return p;
   }

});

return Spaceroids;

});

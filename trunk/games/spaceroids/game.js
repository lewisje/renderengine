
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
Engine.load("/rendercontexts/context.canvascontext.js");
Engine.load("/platform/engine.spatialgrid.js");
Engine.load("/textrender/text.vector.js");
//Engine.load("/textrender/text.bitmap.js");
Engine.load("/components/component.transform2d.js");
Engine.load("/components/component.mover2d.js");
Engine.load("/components/component.render.js");
Engine.load("/components/component.vector2d.js");
Engine.load("/components/component.collider.js");
Engine.load("/components/component.input.js");
Engine.load("/components/component.keyboardinput.js");
Engine.load("/components/component.wiimoteinput.js");
Engine.load("/resourceloaders/loader.sound.js");

// Load game objects
Game.load("/rock.js");
Game.load("/player.js");
Game.load("/bullet.js");
Game.load("/particle.js");

// Start the game when all the scripts are loaded.
Engine.setQueueCallback(function() { Spaceroids.setup(); });

/**
 * @class The game.
 */
var Spaceroids = Game.extend({

   constructor: null,

   renderContext: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: 0.9,

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
      for (var a = 0; a < 3; a++)
      {
         var rock = new Spaceroids.Rock(null, null, pWidth, pHeight);
         this.renderContext.add(rock);
         rock.setup();
         rock.killTimer = Engine.worldTime + 2000;
      }

      var title = new TextRenderer(new VectorText(), "Asteroids", 2);
      title.setPosition(new Point2D(150, 100));
      title.setTextWeight(1);
      title.setColor("#ffffff");
      this.renderContext.add(title);

      var copy = new TextRenderer(new VectorText(), "&copy;1979 Atari Games", 1);
      copy.setColor("#ffffff");
      copy.setPosition(new Point2D(145, 130));
      this.renderContext.add(copy);

      var startText;
      if (window.opera && opera.wiiremote) {
         startText = "[ Press =A Button= to Start ]";

         var wii = new TextRenderer(new VectorText(), "(Wii Detected)", 1);
         wii.setColor("#ffffff");
         wii.setPosition(new Point2D(160, 470));
         this.renderContext.add(wii);
      } else {
         startText = "[ Press =Enter= to Start ]";
      }

      Spaceroids.start = new TextRenderer(new VectorText(), startText, 1);
      Spaceroids.start.setPosition(new Point2D(96, 450));
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

      Spaceroids.intv = new Timeout("startkey", 1000, flash);

      // Start up a particle engine
      this.pEngine = new ParticleEngine()
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.gameOver();

      // Create a new rock every 20 seconds
      Spaceroids.attractTimer = new Interval("attract", 20000,
         function() {
            var rock = new Spaceroids.Rock(null, null, Spaceroids.fieldWidth, Spaceroids.fieldHeight);
            Spaceroids.renderContext.add(rock);
            rock.setup();
            rock.killTimer = Engine.worldTime + 2000;
         });

   },

   /**
    * Add the highscore object to the playfield.
    */
   addHiScore: function() {
      this.hscoreObj = new TextRenderer(new VectorText(), this.hiScore, 2);
      this.hscoreObj.setPosition(new Point2D(430, 20));
      this.hscoreObj.setColor("#ffffff");
      this.hscoreObj.setTextWeight(0.5);
      this.hscoreObj.setTextAlignment(AbstractTextRenderer.ALIGN_RIGHT);
      this.renderContext.add(this.hscoreObj);
   },

   /**
    * Add the score object to the playfield.
    */
   addScore: function() {
      this.scoreObj = new TextRenderer(new VectorText(), this.playerScore, 2);
      this.scoreObj.setPosition(new Point2D(130, 20));
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

      this.playerObj = new Spaceroids.Player();
      this.renderContext.add(this.playerObj);
      this.playerObj.setup(pWidth, pHeight);

      // Start up a particle engine
      this.pEngine = new ParticleEngine()
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.addScore();
      this.scorePoints(0);

		// Start the "music" track
      Spaceroids.soundNum = 1;
      Spaceroids.gameSound = new Interval("gameSound", 1000, function() {
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
         var rock = new Spaceroids.Rock(null, null, pWidth, pHeight);
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

      var g = new TextRenderer(new VectorText(), "Game Over", 3);
      g.setPosition(new Point2D(100, 260));
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
      var t = new Timeout("gameover", 10000, function() { Spaceroids.attractMode(); });
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
      this.fieldBox = new Rectangle2D(0, 0, this.fieldWidth, this.fieldHeight);
      this.centerPoint = this.fieldBox.getCenter();
      this.renderContext = new CanvasContext(this.fieldWidth, this.fieldHeight);
      this.renderContext.setWorldScale(this.areaScale);
      Engine.getDefaultContext().add(this.renderContext);
      this.renderContext.setBackgroundColor("black");

      // We'll need something to detect collisions
      this.collisionModel = new SpatialGrid(this.fieldWidth, this.fieldHeight, 7);

      EventEngine.setHandler(document, "keypress", Spaceroids.onKeyPress);

      // Load our font
//      Spaceroids.fontLoader = new BitmapFontLoader();
//      Spaceroids.fontLoader.load("lucida", "lucida_sans_36.js");

//      Spaceroids.loadTimeout = new Timeout("wait", 250, Spaceroids.waitForResources);
//      this.waitForResources();

      this.soundLoader = new SoundResourceLoader();

      // Load the sounds
      this.soundLoader.load("explode", "explode1.mp3");
      this.soundLoader.load("shoot", "shoot.mp3");
      this.soundLoader.load("death", "explode2.mp3");
      this.soundLoader.load("thrust", "thrust.mp3");
      this.soundLoader.load("lowboop", "low.mp3");
      this.soundLoader.load("hiboop", "hi.mp3");

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

      renderContext.destroy();
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
   },

});


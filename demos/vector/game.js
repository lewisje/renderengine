
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
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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

R.Engine.define({
	"class": "Spaceroids",
	"requires": [
		"R.engine.Game",
		"R.rendercontexts.CanvasContext",
		"R.collision.broadphase.SpatialGrid",
		"R.lang.Timeout",
		"R.lang.OneShotTimeout",
		"R.lang.MultiTimeout",
		"R.lang.OneShotTrigger",
		"R.lang.IntervalTimer",
		"R.text.TextRenderer",
		"R.text.AbstractTextRenderer",
		"R.text.VectorText",
		"R.resources.loaders.SoundLoader",
		"R.sound.SM2",
		"R.collision.CircleHull",
		"R.storage.PersistentStorage",
		"R.engine.Events",
		"R.math.Math2D",
		"R.math.Point2D",
		"R.math.Rectangle2D",
		"R.particles.ParticleEngine"
	],
	
	// Game class dependencies
	"depends": [
		"SpaceroidsRock",
		"SpaceroidsPlayer",
		"SpaceroidsBullet",
		"SimpleParticle",
		"TrailParticle"
	]
});

// Load game objects
R.engine.Game.load("/rock.js");
R.engine.Game.load("/player.js");
R.engine.Game.load("/bullet.js");
R.engine.Game.load("/particle.js");

/**
 * @class The game.
 */
var Spaceroids = function() {
	return R.engine.Game.extend({

   constructor: null,

   renderContext: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: $.browser.Wii ? 0.7 : 1,

   engineFPS: 25,

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

   titlePos: null,
   
   rec: false,
   play: false,
	
	pStore: null,

   /**
    * Handle the keypress which starts the game
    *
    * @param event {Event} The event object
    */
   onKeyPress: function(event) {
      if (event.keyCode == R.engine.Events.KEYCODE_ENTER ||
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

		// Detach the particle engine so it isn't destroyed
		this.renderContext.remove(this.pEngine);

		this.scoreObj = null;
		this.hscoreObj = null;
		this.start = null;

      // Destroy all objects attached to the context
      this.renderContext.cleanUp();
      this.rocks = 0;
      this.level = 0;

   },

   /**
    * A simple mode where the title, highscore, game over message,
    * and start message are displayed with asteroids in the background
    */
   attractMode: function() {
		var center = this.fieldBox.getCenter();
		
      var titlePos = R.math.Point2D.create(center.x, 100);
      var copyPos = R.math.Point2D.create(center.x, 570);
      this.cleanupPlayfield();
      Spaceroids.isAttractMode = true;

      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;

      // Add some asteroids
      for (var a = 0; a < 3; a++)
      {
         var rock = SpaceroidsRock.create(null, null, pWidth, pHeight);
         this.renderContext.add(rock);
         rock.setup();
         rock.killTimer = R.Engine.worldTime + 2000;
      }

      var title = R.text.TextRenderer.create(R.text.VectorText.create(), "Asteroids", 2);
      title.setPosition(titlePos);
      title.setColor("#ffffff");
		title.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_CENTER);
      this.renderContext.add(title);

      var copy = R.text.TextRenderer.create(R.text.VectorText.create(), "&copy;2009 Brett Fattori", 0.6);
      copy.setColor("#ffffff");
      copy.setPosition(copyPos);
		copy.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_CENTER);
      this.renderContext.add(copy);

      // Instructions
      var instruct = "left/right arrows to turn\nup arrow to thrust\nZ to fire missile\nA to hyperjump\nENTER to detonate nuke\n";
		instruct += R.engine.Support.sysInfo().OS + " " + R.engine.Support.sysInfo().browser + " " + R.engine.Support.sysInfo().version;
		
      var inst = R.text.TextRenderer.create(R.text.VectorText.create(), instruct, 0.8);
      inst.setColor("#00ff00");
      inst.setPosition(R.math.Point2D.create(center.x, 485));
		inst.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_CENTER);
      this.renderContext.add(inst);

      var startText;
      startText = "[ Press =Enter= to Start ]";

		var evolved = R.text.TextRenderer.create(R.text.VectorText.create(), "Evolution", 1);
		evolved.setColor("#ff0000");
		evolved.setPosition(R.math.Point2D.create(290, 120));
		this.renderContext.add(evolved);

      Spaceroids.start = R.text.TextRenderer.create(R.text.VectorText.create(), startText, 1);
      Spaceroids.start.setPosition(R.math.Point2D.create(center.x, 450));
      Spaceroids.start.setColor("#ffffff");
		Spaceroids.start.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_CENTER);
      Spaceroids.renderContext.add(Spaceroids.start);

      var flash = function() {
         if (!Spaceroids.showStart)
         {
            Spaceroids.start.setDrawMode(R.text.TextRenderer.DRAW_TEXT);
            Spaceroids.showStart = true;
            Spaceroids.intv.restart();
         }
         else
         {
            Spaceroids.start.setDrawMode(R.text.TextRenderer.NO_DRAW);
            Spaceroids.showStart = false;
            Spaceroids.intv.restart();
         }
      };

      Spaceroids.intv = R.lang.Timeout.create("startkey", 1000, flash);

      if (R.engine.Support.sysInfo().browser == "chrome") {
         // Chrome can handle a lot of particles
         this.pEngine.setMaximum(5000);
      }
      
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.gameOver();

      // Create a new rock every 20 seconds
      Spaceroids.attractTimer = R.lang.IntervalTimer.create("attract", 20000,
         function() {
            var rock = SpaceroidsRock.create(null, null, Spaceroids.fieldWidth, Spaceroids.fieldHeight);
            Spaceroids.renderContext.add(rock);
            rock.setup();
            rock.killTimer = R.Engine.worldTime + 2000;
         });

   },

   /**
    * Add the highscore object to the playfield.
    */
   addHiScore: function() {
      this.hscoreObj = R.text.TextRenderer.create(R.text.VectorText.create(), this.hiScore, 2);
      this.hscoreObj.setPosition(R.math.Point2D.create(400, 5));
      this.hscoreObj.setColor("#ffffff");
      this.hscoreObj.setTextWeight(0.5);
      this.hscoreObj.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_RIGHT);
      this.renderContext.add(this.hscoreObj);
   },

   /**
    * Add the score object to the playfield.
    */
   addScore: function() {
      this.scoreObj = R.text.TextRenderer.create(R.text.VectorText.create(), this.playerScore, 2);
      this.scoreObj.setPosition(R.math.Point2D.create(130, 5));
      this.scoreObj.setColor("#ffffff");
      this.scoreObj.setTextWeight(0.5);
      this.scoreObj.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_RIGHT);
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
	 * Record a demo script
	 * @private
	 */
   recordDemo: function() {
      Spaceroids.rec = true;
      Spaceroids.demoScript = {};
      Spaceroids.demoScript.seed = R.lang.Math2.randomInt();
      
      R.lang.Math2.seed(Spaceroids.demoScript.seed);
      Spaceroids.startGame();
   },
   
	/**
	 * Playback a demo script
	 * @private
	 */
   playDemo: function() {
      Spaceroids.play = true;
      var demoMode = Spaceroids.demoModes[0];
      R.lang.Math2.seed(demoMode.seed);
      this.startGame();
      this.playerObj.getComponent("input").playScript(demoMode.player);
   },

   /**
    * Start the game, resetting the playfield and creating the player.
    * If the game is already running, has no effect.
    */
   startGame: function() {

      if (this.gameRunning) {
         return;
      }

      this.gameRunning = true;

      if (!Spaceroids.rec && !Spaceroids.play) {
         this.attractTimer.destroy();
			this.attractTimer = null;
         Spaceroids.isAttractMode = false;
   
         this.intv.destroy();
			this.intv = null;
      }

      this.playerScore = 0;
      this.cleanupPlayfield();

      this.nextLevel();

      this.playerObj = SpaceroidsPlayer.create();
      this.renderContext.add(this.playerObj);
      this.playerObj.setup();

      if (R.engine.Support.sysInfo().browser == "chrome") {
         // Chrome can handle a LOT!
         this.pEngine.setMaximum(5000);
      }
      this.renderContext.add(this.pEngine);

      this.addHiScore();
      this.addScore();
      this.scorePoints(0);

      // Start the "music" track
      Spaceroids.soundNum = 1;
      Spaceroids.gameSound = R.lang.IntervalTimer.create("gameSound", 1000, function() {
         if (Spaceroids.soundNum == 1) {
            Spaceroids.soundLoader.get("lowboop").play();
            Spaceroids.soundNum = 2;
         } else {
            Spaceroids.soundLoader.get("hiboop").play();
            Spaceroids.soundNum = 1;
         }
      });
   },

	/**
	 * Advance to next level
	 */
   nextLevel: function() {
      Spaceroids.level++;

      if (Spaceroids.level > 7) {
         Spaceroids.level = 7;
      }

      // Add some asteroids
      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;
      if (this.playerObj) {
     		// Max of 3 nukes
         this.playerObj.nukes++;
         this.playerObj.nukes = this.playerObj.nukes > 3 ? 3 : this.playerObj.nukes;
      }

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

      if (Spaceroids.rec) {
         this.playerObj.getComponent("input").stopRecording();
         Spaceroids.demoScript.player = this.playerObj.getComponent("input").getScript();
         console.debug(JSON.stringify(Spaceroids.demoScript));
         return;  
      }

      var g = R.text.TextRenderer.create(R.text.VectorText.create(), "Game Over", 3);
      g.setPosition(R.math.Point2D.create(this.fieldBox.getCenter().x, 260));
      g.setTextWeight(0.8);
      g.setColor("#ffffff");
		g.setTextAlignment(R.text.AbstractTextRenderer.ALIGN_CENTER);
      this.renderContext.add(g);

      if (!this.gameRunning) {
         return;
      }

      Spaceroids.gameSound.destroy();
      Spaceroids.gameSound = null;

      this.gameRunning = false;

      // Remove the player
      if (this.playerObj) {
         this.playerObj.destroy();
			this.playerObj = null;
      }

      // Back to attract mode in 10sec
      R.lang.OneShotTimeout.create("gameover", 10000, function() {
			// See if a high score exists
			var sql = "SELECT HighScore.* FROM HighScore";
			var result = Spaceroids.pStore.execSql(sql);
			if (result.length != 0) {
				sql = "UPDATE HighScore SET score=" + Spaceroids.hiScore + " WHERE HighScore.id==0";	
			} else {
				sql = "INSERT INTO HighScore (score, id) VALUES (" + Spaceroids.hiScore + ",0)";
			}
			// Store the high score
			Spaceroids.pStore.execSql(sql);
			
			Spaceroids.attractMode(); 
		});
   },

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
   	// Need info level to get profiles
   	R.debug.Console.setDebugLevel(1);
   	
   	// Wire up the canvas for profiling
   	R.debug.Profiler.wireObjects([SpaceroidsRock]);
   	R.debug.Profiler.start();
   	
   	//R.Engine.setDebugMode(true);
   	R.debug.Metrics.showMetrics();
   	
      R.Engine.setFPS(this.engineFPS);

      // Create the 2D context
      this.fieldBox = R.math.Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
      this.centerPoint = this.fieldBox.getCenter();
      this.renderContext = R.rendercontexts.CanvasContext.create("playfield", this.fieldWidth, this.fieldHeight);
      this.renderContext.setWorldScale(this.areaScale);
      R.Engine.getDefaultContext().add(this.renderContext);
      this.renderContext.setBackgroundColor("#000000");

      // We'll need a broad-phase collision model
      this.collisionModel = R.collision.broadphase.SpatialGrid.create(this.fieldWidth, this.fieldHeight, 5);
      this.collisionModel.setAccuracy(R.collision.broadphase.SpatialGrid.BEST_ACCURACY);

      // Prepare for keyboard input to start the game
      R.engine.Events.setHandler(document, "keypress", Spaceroids.onKeyPress);

      // Load the sounds, use a SoundManager2 sound system
      this.soundLoader = R.resources.loaders.SoundLoader.create(new R.sound.SM2());
      this.soundLoader.load("explode", this.getFilePath("resources/explode1.mp3"));
      this.soundLoader.load("shoot", this.getFilePath("resources/shoot.mp3"));
      this.soundLoader.load("death", this.getFilePath("resources/explode2.mp3"));
      this.soundLoader.load("thrust", this.getFilePath("resources/thrust.mp3"));
      this.soundLoader.load("lowboop", this.getFilePath("resources/low.mp3"));
      this.soundLoader.load("hiboop", this.getFilePath("resources/hi.mp3"));

		// Use persistent storage to keep the high score
		this.pStore = R.storage.PersistentStorage.create("AsteroidsEvolutionStorage");

		// See if the high score table exists
		if (!this.pStore.tableExists("HighScore")) {
			// Create it
			this.pStore.createTable("HighScore", ["id","score"], ["Number","Number"]);
		} else {
			// See if there's a high score already saved
			var sql = "SELECT HighScore.* FROM HighScore WHERE HighScore.id==0";
			var result = Spaceroids.pStore.execSql(sql);
			if (result.length != 0) {
				this.hiScore = result[0].score;	
		 	} 
		}

      // Start up a particle engine
      this.pEngine = R.particles.ParticleEngine.create();

      // Demo recording and playback
      if (R.engine.Support.checkBooleanParam("record")) {
         Spaceroids.recordDemo();
         return;
      }
      
      if (R.engine.Support.checkBooleanParam("playback")) {
         Spaceroids.playDemo();
         return;
      }
      
		R.lang.Timeout.create("wait", 150, function() {
			if (Spaceroids.soundLoader.isReady()) {
		      // Go into attract mode as soon as the sounds are loaded
				this.destroy();
		      Spaceroids.attractMode();
			} else {
				this.restart();
			}
		});
   },

   /**
    * Called when the game is being shut down to allow the game
    * the chance to clean up any objects, remove event handlers, and
    * destroy the rendering context.
    */
   teardown: function() {
      this.scoreObj = null;
      this.hscoreObj = null;

      R.engine.Events.clearHandler(document, "keypress", Spaceroids.onKeyPress);

      this.renderContext.destroy();
		this.pEngine.destroy();		
   },
   
   /**
    * Cause the playfield to flash
    */
   blinkScreen: function(color) {
      if (!Spaceroids.isAttractMode) {
         $(this.renderContext.getSurface()).css("background", color || "#8F8F8F");
         var surf = this.renderContext.getSurface();
         R.lang.OneShotTimeout.create("blink", 100, function() {
            $(surf).css("background", "black");
         });
      }
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
      var p = R.math.Point2D.create(pos);
      var newPos = this.wrap(p, bBox);
      var b = newPos.equals(pos);
      p.destroy();
      return b;
   },

   /**
    * Called to wrap an object around the edges of the playfield.
    *
    * @param pos {Point2D} The position of the object
    * @param bBox {Rectangle2D} The bounding box of the playfield
    */
   wrap: function(pos, bBox) {

      var rX = bBox.len_x() * 0.5;
      var rY = bBox.len_y() * 0.5;

      // Wrap if it's off the playing field
      var x = pos.x;
      var y = pos.y;
      var fb = this.renderContext.getViewport();

      if (pos.x < fb.x || pos.x > fb.r ||
          pos.y < fb.y || pos.y > fb.b) {
         
			if (pos.x > fb.r + rX) {
            x = (fb.x - (rX - 1));
         }
         if (pos.y > fb.b + rY) {
            y = (fb.y - (rY - 1));
         }
         if (pos.x < fb.x - rX) {
            x = (fb.r + (rX - 1));
         }
         if (pos.y < fb.y - rY) {
            y = (fb.b + (rY - 1));
         }
         pos.set(x,y);
      }
      return pos;
   },
	
	/**
	 * The name of the game
	 * @return {String}
	 */
	getName: function() {
		return "Asteroids Evolved";
	}
});
}

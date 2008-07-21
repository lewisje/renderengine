
/**
 * The Render Engine
 * DemoHost
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

/**
 * @class The game.
 */
var DemoHost = Game.extend({

   constructor: null,

   demoContainer: null,

/*
   renderContext: null,

   fieldBox: null,
   centerPoint: null,
   areaScale: 0.9,

   engineFPS: 25,

   collisionModel: null,

   rocks: [],

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
*/

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
		this.demoContainer.clear();
   },

   /**
    * Add the highscore object to the playfield.
   addHiScore: function() {
      this.hscoreObj = new TextRenderer(new VectorText(), this.hiScore, 2);
      this.hscoreObj.setPosition(new Point2D(430, 20));
      this.hscoreObj.setColor("#ffffff");
      this.hscoreObj.setTextWeight(0.5);
      this.hscoreObj.setTextAlignment(AbstractTextRenderer.ALIGN_RIGHT);
      this.renderContext.add(this.hscoreObj);
   },
    */

	hideMenu: function() {
		$("#menu").hide();
		$("#return").show();
	},

	showMenu: function() {
		$("#loading").remove();
		$("#menu").show();
		$("#return").hide();
	},

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {

      // Set the FPS of the game
      Engine.setFPS(20);

      this.showMenu();

		this.demoContainer = new Container();
		Engine.getDefaultContext().add(this.demoContainer);

		/*
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

      Spaceroids.attractMode();
      */
   },

   /**
    * Called when a game is being shut down to allow it to clean up
    * any objects, remove event handlers, destroy the rendering context, etc.
    */
   teardown: function() {
      //EventEngine.removeHandler(document, "keypress", Spaceroids.onKeyPress);
      //renderContext.destroy();
   },

	exec: function(sectionName) {
		Console.debug("running " + sectionName);
		switch (sectionName) {
			case "intro"			: this.introDemo(); break;
			case "host"				: this.hostDemo(); break;
			case "vector2d"		: this.doSomething(); break;
			case "transform2d"	: this.doSomething(); break;
			case "mover2d"			: this.doSomething(); break;
			case "keyboardinput"	: this.doSomething(); break;
			case "test1"			: this.doSomething(); break;
			case "spatialgrid"	: this.doSomething(); break;
			case "collider"		: this.doSomething(); break;
			case "loadsound"		: this.doSomething(); break;
			case "playsound"		: this.doSomething(); break;
			case "changesound"	: this.doSomething(); break;
			case "loopsound"		: this.doSomething(); break;
		}
	},

	/* REMOVE ME WHEN COMPLETE!! */
	doSomething: function() {
		alert("not implemented yet");
	},

	//===============================================================================================
	// EXAMPLES

	introDemo: function() {
		/* Scripts are queued to be loaded one after the other, since
		 * objects declared in one file might need objects from another
		 * file loaded before it.  Both Engine.load() and Game.load()
		 * use this mechanism.  The queue is a "First In First Out"
		 * (FIFO) buffer of files to load and functions to execute.
		 *
		 * We use the Game object's static "load()" method to get
		 * scripts which are local to our game's folder.  The code
		 * of the intro is located in the following file.
		 */
		Game.load("introDemo.js");
	},

	hostDemo: function() {
		Game.load("hostDemo.js");
	},

	//===============================================================================================


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


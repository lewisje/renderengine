/**
 * The Render Engine
 * Physics Demo
 *
 * A simple game of bouncing balls
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

// Load all required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/rendercontexts/context.htmldivcontext.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/physics/physics.simulation.js")

Engine.include("/physics/collision/shapes/b2BoxDef.js");

// Load game objects
Game.load("/player.js");
Game.load("/toy.js");
Game.load("/beachball.js");
Game.load("/crate.js");

Engine.initObject("PhysicsDemo", "Game", function(){

   /**
    * @class A physics demonstration to show off Box2D-JS integration.  Creates
    *			 a set of "toys" and drops them into the simulation.  The "player"
    *			 can drag objects around and watch them interact.
    */
   var PhysicsDemo = Game.extend({
   
      constructor: null,
      
      // The rendering context
      renderContext: null,
      
      // Engine frames per second
      engineFPS: 30,
      
      // The play field
      fieldBox: null,
      fieldWidth: 800,
      fieldHeight: 460,

      // Sprite resource loader
      spriteLoader: null,
      
      // The collision model
      cModel: null,
      
      simulation: null,
      
      /**
       * Called to set up the game, download any resources, and initialize
       * the game to its running state.
       */
      setup: function(){
         // Set the FPS of the game
         Engine.setFPS(this.engineFPS);
         
         this.spriteLoader = SpriteLoader.create();
         
         // Load the sprites
         this.spriteLoader.load("beachball", this.getFilePath("resources/beachball.js"));
         this.spriteLoader.load("crate", this.getFilePath("resources/crate.js"));
         
         // Don't start until all of the resources are loaded
         Timeout.create("wait", 250, function() {
				if (PhysicsDemo.spriteLoader.isReady()) {
						this.destroy();
						PhysicsDemo.run();
				}
				else {
					// Continue waiting
					this.restart();
				}
         });
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
         // Create the render context
         this.fieldWidth = EngineSupport.sysInfo().viewWidth;
			this.fieldHeight = EngineSupport.sysInfo().viewHeight;
         this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
         this.centerPoint = this.fieldBox.getCenter();
         
			this.renderContext = CanvasContext.create("Playfield", this.fieldWidth, this.fieldHeight);
         this.renderContext.setBackgroundColor("#FFFFFF");

			// Set up the physics simulation
         this.simulation = Simulation.create("simulation", this.fieldBox);
			this.simulation.setIntegrations(3);
         this.setupWorld();
         
         // Add the simulation to the scene graph
         this.renderContext.add(this.simulation);

         // Address the context element directly via jQuery
         this.renderContext.jQ().css({
            border: "1px solid red",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0});

         Engine.getDefaultContext().add(this.renderContext);

         // Create the collision model with 5x5 divisions
         this.cModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 10);

         // Add some toys to play around with
			var self = this;
			MultiTimeout.create("ballmaker", 6, 250, function() {
	         self.createBall();
			});

			MultiTimeout.create("boxmaker", 6, 250, function() {
	         self.createBox();
			});
         
         // Add the player object
         var player = Player.create();
         this.getRenderContext().add(player);
      },
      
      /**
       * Set up the physical world.  Creates the bounds of the world by establishing
       * walls an a floor.  The actual objects have no visual respresentation but they
       * will exist in the simulation.
       */
      setupWorld: function() {
         var groundSd = new b2BoxDef();
         groundSd.extents.Set(2000, 30);
         groundSd.restitution = 0.2;
			groundSd.friction = 1.6;
         var groundBd = new b2BodyDef();
         groundBd.AddShape(groundSd);
         groundBd.position.Set(0, this.fieldBox.get().h);
         this.simulation.addBody(groundBd);

         var leftSd = new b2BoxDef();
         leftSd.extents.Set(20, this.fieldBox.get().h + 150);
         var leftBd = new b2BodyDef();
         leftBd.AddShape(leftSd);
         leftBd.position.Set(-10, 100);
         this.simulation.addBody(leftBd);

         var rightSd = new b2BoxDef();
         rightSd.extents.Set(20, this.fieldBox.get().h + 150);
         var rightBd = new b2BodyDef();
         rightBd.AddShape(rightSd);
         rightBd.position.Set(this.fieldBox.get().w - 10, 100);
         this.simulation.addBody(rightBd);
      },
      
      /**
       * Create a beachball toy
       */
      createBall: function() {
         var ball = BeachBall.create();
			// Set a random location
			var x = Math.floor(Math2.random() * 300);
			var p = Point2D.create(x, 15);
			ball.setPosition(p);
         ball.setSimulation(this.simulation);
         this.getRenderContext().add(ball);
         ball.simulate();
         var v = 1000 + (Math2.random() * 5000);
         ball.applyForce(Vector2D.create(v * 2000,10), p);
         p.destroy();
      },

		/**
		 * Create a wooden crate toy
		 */
      createBox: function() {
         var box = Crate.create();
			// Set a random location
			var x = Math.floor(Math2.random() * 300);
			var p = Point2D.create(x, 15);
			box.setPosition(p);
         box.setSimulation(this.simulation);
         this.getRenderContext().add(box);
         box.simulate();
         var v = 1000 + (Math2.random() * 5000);
         box.applyForce(Vector2D.create(v * 2000,10), p);
         p.destroy();
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
   
   return PhysicsDemo;
   
});


/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The player object
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

Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/engine/engine.timers.js");

Engine.initObject("SpaceroidsPlayer", "Object2D", function() {

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
var SpaceroidsPlayer = Object2D.extend({

   size: 4,

   field: null,

   rotDir: 0,

   thrusting: false,

   bullets: 0,

   tip: null,

   players: 3,

   alive: false,

   playerShape: null,
   
   nukes: null,
   
   nuking: null,

   constructor: function() {
      this.base("Player");

      this.field = Spaceroids;

      // Add components to move and draw the player
//      if (window.opera && opera.wiiremote) {
//         this.add(WiimoteInputComponent.create("input"));
//      } else {
         this.add(KeyboardInputComponent.create("input"));
//      }

      this.add(Mover2DComponent.create("move"));
      this.add(Vector2DComponent.create("draw"));
      this.add(Vector2DComponent.create("thrust"));
      this.add(ColliderComponent.create("collider", this.field.collisionModel));

      this.tip = Point2D.create(0, -1);
      this.players--;

      this.alive = true;
      this.rotDir = 0;
      this.thrusting = false;
      this.getComponent("move").setCheckRestState(false);
      this.getComponent("move").setCheckLag(false);
      this.nukes = 1;
      this.nuking = false;

   },

   destroy: function() {
      if (this.ModelData && this.ModelData.lastNode) {
         this.ModelData.lastNode.removeObject(this);
      }
      this.base();
   },

   release: function() {
      this.base();
      this.size = 4;
      this.rotDir = 0;
      this.thrusting = false;
      this.bullets = 0;
      this.tip = null;
      this.players = 3;
      this.alive = false;
      this.playerShape = null;
      this.nukes = null;
      this.nuking = null;
   },

   /**
    * Update the player within the rendering context.  This draws
    * the shape to the context, after updating the transform of the
    * object.  If the player is thrusting, draw the thrust flame
    * under the ship.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      var c_mover = this.getComponent("move");
      c_mover.setPosition(this.field.wrap(c_mover.getPosition(), this.getBoundingBox()));
      c_mover.setRotation(c_mover.getRotation() + this.rotDir);

      if (this.thrusting)
      {
         var r = c_mover.getRotation();
         var dir = Math2D.getDirectionVector(Point2D.ZERO, this.tip, r);

         c_mover.setAcceleration(dir.mul(0.3));

         // Particle trail
         if (Spaceroids.evolved) {
            var inv = Point2D.create(this.getPosition()).add(dir.neg().mul(1.5));
            var colr = SpaceroidsPlayer.trailColors[Math.floor(Math.random() * 3)];
            this.field.pEngine.addParticle(TrailParticle.create(inv, this.getRotation(), 20, colr, 5000));
         }
      } else {
         c_mover.setAcceleration(Point2D.ZERO);
      }

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

      // Debug the collision node
      if (Engine.getDebugMode() && this.ModelData && this.ModelData.lastNode)
      {
         renderContext.setLineStyle("red");
         renderContext.drawRectangle(this.ModelData.lastNode.rect);
      }

      // Draw the remaining lives
      renderContext.setLineStyle("white");
      var posX = 170;
      for (var l = 0; l <= this.players; l++) {
         renderContext.pushTransform();
         renderContext.setScale(0.7);
         renderContext.setPosition(new Point2D(posX, 60));
         renderContext.drawPolygon(this.playerShape);
         renderContext.popTransform();
         posX -= 20;
      }
      
      // If they have their nuke, draw that too
      if (Spaceroids.evolved && this.nukes > 0) {
         renderContext.pushTransform();
         renderContext.drawRectangle(Rectangle2D.create(70, 35, 6, 6));
         renderContext.popTransform();
      }
   },

   /**
    * Get the position of the ship from the mover component.
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Get the last position the ship was at before the current move.
    * @type Point2D
    */
   getLastPosition: function() {
      return this.getComponent("move").getLastPosition();
   },

   /**
    * Set, or initialize, the position of the mover component
    *
    * @param point {Point2D} The position to draw the ship in the playfield
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Get the rotation of the ship from the mover component.
    * @type Number
    */
   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   /**
    * Set the rotation of the ship on the mover component.
    *
    * @param angle {Number} The rotation angle of the ship
    */
   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("move").setRotation(angle);
   },

   getScale: function() {
      return this.getComponent("move").getScale();
   },

   setScale: function(scale) {
      this.base(scale);
      this.getComponent("move").setScale(scale);
   },

   /**
    * Set up the player object on the playfield.  The width and
    * heigh of the playfield are used to determine the center point
    * where the player starts.
    *
    * @param pWidth {Number} The width of the playfield in pixels
    * @param pHeight {Number} The height of the playfield in pixels
    */
   setup: function(pWidth, pHeight) {

      // Playfield bounding box for quick checks
      this.pBox = Rectangle2D.create(0, 0, pWidth, pHeight);

      // Randomize the position and velocity
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");
      var c_thrust = this.getComponent("thrust");

      // The player shapes
      var shape = SpaceroidsPlayer.points;

      // Scale the shape
      var s = [];
      for (var p = 0; p < shape.length; p++)
      {
         var pt = Point2D.create(shape[p][0], shape[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      c_draw.setLineStyle("white");

      // Save the shape so we can draw lives remaining
      this.playerShape = s;

      var thrust = SpaceroidsPlayer.thrust;
      s = [];
      for (var p = 0; p < thrust.length; p++)
      {
         var pt = Point2D.create(thrust[p][0], thrust[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }
      c_thrust.setPoints(s);
      c_thrust.setLineStyle("white");
      c_thrust.setClosed(false);
      c_thrust.setDrawMode(RenderComponent.NO_DRAW);

      // Put us in the middle of the playfield
      c_mover.setPosition( this.pBox.getCenter() );
      c_mover.setVelocityDecay(0.03);
   },

   /**
    * Called when the player shoots a bullet to create a bullet
    * in the playfield and keep track of the active number of bullets.
    */
   shoot: function() {
      var b = SpaceroidsBullet.create(this);
      this.getRenderContext().add(b);
      this.bullets++;
      this.field.soundLoader.get("shoot").play({volume: 15});
   },

   /**
    * Called when a bullet collides with another object or leaves
    * the playfield so the player can fire more bullets.
    */
   removeBullet: function() {
      // Clean up
      this.bullets--;
   },

   /**
    * Called after a player has been killed.  If the node where the player
    * was last located does not contain any objects, the player will respawn.
    * Otherwise, the routine will wait until the area is clear to respawn
    * the player.
    */
   respawn: function() {
      // Are there rocks in our area?
      if (this.ModelData)
      {
         if (this.ModelData.lastNode.getObjects().length > 1)
         {
            var pl = this;
            OneShotTimeout.create("respawn", 250, function() { pl.respawn(); });
            return;
         }
      }

      // Nope, respawn
      this.getComponent("draw").setDrawMode(RenderComponent.DRAW);
      this.alive = true;
   },

   /**
    * Returns the state of the player object.
    * @type Boolean
    */
   isAlive: function() {
      return this.alive;
   },

   /**
    * Kills the player, creating the particle explosion and removing a
    * life from the extra lives.  Afterwards, it determines if the
    * player can respawn (any lives left) and either calls the
    * respawn method or signals that the game is over.
    */
   kill: function() {
      this.alive = false;

      this.getComponent("draw").setDrawMode(RenderComponent.NO_DRAW);
      this.getComponent("thrust").setDrawMode(RenderComponent.NO_DRAW);
      this.field.soundLoader.get("thrust").stop();

      var pCount = Spaceroids.evolved ? 40 : 8;

      // Make some particles
      for (var x = 0; x < pCount; x++)
      {
         if (Spaceroids.evolved) {
            this.field.pEngine.addParticle(TrailParticle.create(this.getPosition(), this.getRotation(), 45, "#ffffaa", 2000));
         }
         this.field.pEngine.addParticle(SimpleParticle.create(this.getPosition(), 3000));
      }

      this.getComponent("move").setVelocity(Point2D.ZERO);
      this.getComponent("move").setPosition(this.getRenderContext().getBoundingBox().getCenter());
      this.getComponent("move").setRotation(0);
      this.rotDir = 0;
      this.thrusting = false;

      this.field.soundLoader.get("death").play({volume: 80});

      // Remove one of the players
      if (this.players-- > 0)
      {
         // Set a timer to spawn another player
         var pl = this;
         OneShotTimeout.create("respawn", 3000, function() { pl.respawn(); });
      }
      else
      {
         this.field.gameOver();
      }

   },

   /**
    * Randomly jump the player somewhere when they get into a tight spot.
    * The point is NOT guaranteed to be free of a collision.
    */
   hyperSpace: function() {

      if (this.hyperjump) {
         return;
      }

      // Hide the player
      this.alive = false;
      this.getComponent("thrust").setDrawMode(RenderComponent.NO_DRAW);
      this.field.soundLoader.get("thrust").stop();
      this.thrusting = false;
      this.hyperjump = true;

      var self = this;
      if (Spaceroids.evolved) {
         OneShotTrigger.create("hyper", 250, function() {
            self.getComponent("draw").setDrawMode(RenderComponent.NO_DRAW);
         }, 10, function() {
            self.setScale(self.getScale() - 0.09);
         });
      } else {
         this.getComponent("draw").setDrawMode(RenderComponent.NO_DRAW);
      }


      // Give it some time and move the player somewhere random
      OneShotTimeout.create("hyperspace", 800, function() {
         self.getComponent("move").setVelocity(Point2D.create(0,0));
         var randPt = Math2D.randomPoint(self.getRenderContext().getBoundingBox());
         self.getComponent("move").setPosition(randPt);
         self.setScale(1);
         self.getComponent("draw").setDrawMode(RenderComponent.DRAW);
         self.alive = true;
         self.hyperjump = false;
      });
   },
   
   nuke: function() {
      if (this.nukes-- <= 0 || this.nuking) {
         return;
      }
      this.nuking = true;
      var p = this;
      var t = MultiTimeout.create("particles", 3, 150, function(rep) {
         // Make some particles
         for (var x = 0; x < 60; x++)
         {
            p.field.pEngine.addParticle(TrailParticle.create(p.getPosition(), p.getRotation(), 355, SpaceroidsPlayer.nukeColors[rep], 1500));
         }
      });
      
      for (var g in Engine.gameObjects) {
         if (Engine.gameObjects[g] instanceof SpaceroidsRock) {
            Engine.gameObjects[g].kill();
         }
      }
      this.nuking = false;
   },

   /**
    * Called by the keyboard input component to handle a key down event.
    *
    * @param event {Event} The event object
    */
   onKeyDown: function(event) {
      if (!this.alive)
      {
         return;
      }

      if (event.shiftKey) {
         this.hyperSpace();
      }
      
      if (event.ctrlKey) {
         if (this.bullets < 5) {
            this.shoot();
         }
      }

      switch (event.keyCode) {
         case EventEngine.KEYCODE_LEFT_ARROW:
            this.rotDir = -5;
            break;
         case EventEngine.KEYCODE_RIGHT_ARROW:
            this.rotDir = 5;
            break;
         case EventEngine.KEYCODE_UP_ARROW:
            this.getComponent("thrust").setDrawMode(RenderComponent.DRAW);
            this.thrusting = true;
            this.field.soundLoader.get("thrust").play({volume: 30});
            break;
         case EventEngine.KEYCODE_SPACE:
            if (Spaceroids.evolved) {
               this.nuke();
            }
            break;
      }
      
      return false;
   },

   /**
    * Called by the keyboard input component to handle a key up event.
    *
    * @param event {Event} The event object
    */
   onKeyUp: function(event) {
      if (!this.alive)
      {
         return;
      }

      switch (event.keyCode) {
         case EventEngine.KEYCODE_LEFT_ARROW:
         case EventEngine.KEYCODE_RIGHT_ARROW:
            this.rotDir = 0;
            break;
         case EventEngine.KEYCODE_UP_ARROW:
            this.getComponent("thrust").setDrawMode(RenderComponent.NO_DRAW);
            this.thrusting = false;
            this.field.soundLoader.get("thrust").stop();
            break;

      }
      
      return false;
   },

   /*
    * WiiMote support -------------------------------------------------------------------------------------
    */

   onWiimoteLeft: function(controller, pressed) {
      this.rotDir = pressed ? -10 : 0;;
   },

   onWiimoteRight: function(controller, pressed) {
      this.rotDir = pressed ? 10 : 0;;
   },

   onWiimoteUp: function(controller, pressed) {
      this.getComponent("thrust").setDrawMode(pressed ? RenderComponent.DRAW : RenderComponent.NO_DRAW);
      this.thrusting = pressed;
      if (pressed) {
         this.field.soundLoader.get("thrust").play({volume: 30});
      } else {
         this.field.soundLoader.get("thrust").stop();
      }
   },

   onWiimoteButtonB: function(controller, pressed) {
      if (pressed && this.bullets < 5) {
         this.shoot();
      }
   }

   /*
    * WiiMote support -------------------------------------------------------------------------------------
    */


}, { // Static

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpaceroidsPlayer";
   },

   /** The player shape
    * @private
    */
   points: [ [-2,  2], [0, -3], [ 2,  2], [ 0, 1] ],

   /** The player's thrust shape
    * @private
    */
   thrust: [ [-1,  2], [0,  3], [ 1,  2] ],

   trailColors: ["red", "orange", "yellow", "white", "lime"],
   
   nukeColors: ["#1111ff", "#8833ff", "#ffff00"]
   
});

return SpaceroidsPlayer;

});
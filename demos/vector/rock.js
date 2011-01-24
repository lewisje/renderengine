/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The asteroid object
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
	"class": "SpaceroidsRock",
	"requires": [
		"R.components.Mover2D",
		"R.components.Vector2D",
		"R.components.Billboard2D",
		"R.components.BoxCollider",
		"R.engine.Object2D",
		"R.lang.Timeout",
		"R.lang.OneShotTimeout",
		"R.struct.Container",
		"R.math.Point2D",
		"R.math.Vector2D"
	]
});

/**
 * @class An asteroid
 *
 * @param size {Number} The size of the asteroid. Defaults to 10
 * @param position {Point2D} the position of the rock.  If not specified
 *                 a random location with the playfield will be selected.
 * @param pWidth {Number} The width of the playfield in pixels
 * @param pHeight {Number} The height of the playfield in pixels
 */
var SpaceroidsRock = function() {
	return R.engine.Object2D.extend({

   size: 10,
   speed: 0.3,
   scoreValue: 10,

   constructor: function(size, position) {
      this.base("Spaceroid");

      // Add components to move and draw the asteroid
      this.add(R.components.Mover2D.create("move"));
		
		if (R.Engine.options.hardwareAccel) {
	      this.add(R.components.Billboard2D.create("billboard", R.components.Vector2D.create("draw")));
		} else {
			this.add(R.components.Vector2D.create("draw"));			
		}
      //this.add(R.components.ConvexCollider.create("collider", Spaceroids.collisionModel));
      this.add(R.components.BoxCollider.create("collider", Spaceroids.collisionModel));
		this.getComponent("collider").setCollisionMask(SpaceroidsRock.COLLISION_MASK);
		if (Spaceroids.isAttractMode) {
			// In attract mode, rocks can collide
			this.getComponent("collider").setCollideSame(true);
		}
		
      // Set size and position
      this.size = size || 10;
      this.scoreValue = SpaceroidsRock.values[String(this.size)];
      if (!position) {
         // Set the position
			var vp = Spaceroids.renderContext.getBoundingBox();
         position = R.math.Point2D.create( Math.floor(R.lang.Math2.random() * vp.w),
                                 			 Math.floor(R.lang.Math2.random() * vp.h));
      }
      this.setPosition(position);
      this.getComponent("move").setCheckLag(false);
		this.setZIndex(1);
   },

   release: function() {
      this.base();
      this.size = 10;
      this.speed = 0.3;
      this.scoreValue = 10;
   },

   /**
    * Destroy an asteroid, removing it from the list of objects
    * in the last collision model node.
    */
   destroy: function() {
   	Spaceroids.collisionModel.removeObject(this);
      this.base();
   },

   /**
    * Update the asteroid in the rendering context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      var c_mover = this.getComponent("move");
      var p = R.math.Point2D.create(c_mover.getPosition());
      c_mover.setPosition(Spaceroids.wrap(p, this.getBoundingBox()));

      // If the player is nuking, adjust our position depending on
      // how close we are to the player
      if (Spaceroids.playerObj && Spaceroids.playerObj.isNuking()) {
         var grav = 8;
         var dVec = R.math.Vector2D.create(Spaceroids.playerObj.getPosition()).sub(this.getPosition());
         grav /= (dVec.len() * 4);
         p.add(dVec.mul(grav));
         c_mover.setPosition(p);
      }

      p.destroy();

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();
		
   },

   /**
    * Returns the position of the rock
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Returns the last position of the rock.
    * @type Point2D
    */
   getLastPosition: function() {
      return this.getComponent("move").getLastPosition();
   },

   /**
    * Set the position of the rock.
    *
    * @param point {Point2D} The position of the rock
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Get the rotation of the rock.
    * @type Number
    */
   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   /**
    * Set the rotation of the rock.
    *
    * @param angle {Number} The rotation of the asteroid
    */
   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("move").setRotation(angle);
   },

   /**
    * Set the shape of the asteroid from one of the
    * available shapes.
    */
   setShape: function() {
      var c_draw = R.Engine.options.hardwareAccel ? this.getComponent("billboard").getComponent() : this.getComponent("draw");

      // Pick one of the three shapes
      var tmp = [];
      tmp = SpaceroidsRock.shapes[Math.floor(R.lang.Math2.random() * 3)];

      // Scale the shape
      var s = [];
      for (var p = 0; p < tmp.length; p++) {
         var pt = R.math.Point2D.create(tmp[p][0], tmp[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      c_draw.setLineStyle("white");
      c_draw.setLineWidth(0.8);

		// Set the bounding box, collision hull, and origin
		this.setOrigin(c_draw.getCenter());
		//this.setCollisionHull(c_draw.getCircleHull(0.75));
		this.setBoundingBox(c_draw.getBoundingBox());
		
		if (R.Engine.options.hardwareAccel) {
	  		this.getComponent("billboard").regenerate();
	  	}
   },

   /**
    * Set the velocity vector and angular velocity of an asteroid.
    */
   setMotion: function() {
      // Randomize the position and velocity
      var c_mover = this.getComponent("move");

      // Pick a random rotation and spin speed
      c_mover.setRotation( Math.floor(R.lang.Math2.random() * 360));
      c_mover.setAngularVelocity( Math.floor(R.lang.Math2.random() * 10) > 5 ? 0.5 : -0.5);


      var b = R.math.Point2D.create(0,-1.2);
      var vec = R.math.Math2D.getDirectionVector(R.math.Point2D.ZERO, b, Math.floor(R.lang.Math2.random() * 360));
      b.destroy();
      
      c_mover.setVelocity(vec);
   },

   /**
    * Initialize an asteroid
    */
   setup: function() {

      this.setShape();
      this.setMotion();

      Spaceroids.rocks++;
   },

   /**
    * Called when an asteroid is killed by the player to create
    * a particle explosion and split up the asteroid into smaller
    * chunks.  If the asteroid is at its smallest size, the
    * rock will not be split anymore.  Also adds a score to the player's
    * score.
    */
   kill: function() {
      // Make some particles
      var pCount = Spaceroids.isAttractMode ? 6 : 4;

      var p = R.struct.Container.create();
      for (var x = 0; x < pCount; x++)
      {
         var decel = R.lang.Math2.random() * 0.04;
			var r = Math.floor(R.lang.Math2.random() * 500);
         p.add(SimpleParticle.create(this.getPosition(), 2000 + r, decel));
      }
      Spaceroids.pEngine.addParticles(p);

      Spaceroids.blinkScreen();
      Spaceroids.rocks--;

      // Score some points
      if (!Spaceroids.isAttractMode) {
         Spaceroids.scorePoints(this.scoreValue);
         Spaceroids.soundLoader.get("explode").play({volume: 20});
      }

      // Break the rock up into smaller chunks
      if (this.size - 4 > 1)
      {
         var curVel = this.getComponent("move").getVelocity().len();
         for (var p = 0; p < 3; p++)
         {
            var rock = SpaceroidsRock.create(this.size - 4, this.getPosition());
            Spaceroids.renderContext.add(rock);
            rock.setup();
            
            var r_mover = rock.getComponent("move");
            r_mover.setVelocity(r_mover.getVelocity().mul(curVel + 0.5));
            if (Spaceroids.isAttractMode) {
               rock.killTimer = R.Engine.worldTime + 2000;
            }
         }
      }

      if (Spaceroids.rocks == 0) {
         R.lang.OneShotTimeout.create("nextLevel", 3000, function() {
            Spaceroids.nextLevel();
         });
      }

      this.destroy();
   },

   /**
    * Called when an asteroid collides with an object in the PCL.  If the
    * object is the player, calls the <tt>kill()</tt> method on the player
    * object.
    */
   onCollide: function(obj, time, mask) {
      if (mask == SpaceroidsPlayer.COLLISION_MASK && !Spaceroids.playerObj.isNuking())
      {
         if (obj.isAlive())
         {
            obj.kill();
            this.kill();
            return R.components.Collider.STOP;
         }
      }

      if (Spaceroids.isAttractMode && obj.killTimer < R.Engine.worldTime &&
            mask == SpaceroidsRock.COLLISION_MASK)
      {
         this.kill();
         obj.kill();
         return R.components.Collider.STOP;
      }

      return R.components.Collider.CONTINUE;
   }

}, { // Static Only

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpaceroidsRock";
   },

   /**
    * The different asteroid vector shapes
    * @private
    */
   shapes: [[ [-4, -2], [-2, -3], [ 0, -5], [ 4, -4], [ 5,  0], [ 3,  4], [-2,  5], [-3,  2], [-5,  1] ],
            [ [-3, -3], [-1, -5], [ 3, -4], [ 2, -2], [ 5, -3], [ 5,  2], [ 1,  5], [-4,  5], [-3,  0] ],
            [ [-2, -3], [ 2, -5], [ 5, -1], [ 3,  2], [ 4,  4], [ 0,  5], [-3,  2] ]],

   /**
    * The value of each size, in points
    * @private
    */
   values: { "10": 10, "6": 15, "2": 20 },
	
	COLLISION_MASK: R.lang.Math2.parseBin("110")

});
}

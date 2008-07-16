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
 * @class An asteroid
 *
 * @param size {Number} The size of the asteroid. Defaults to 10
 * @param position {Point2D} the position of the rock.  If not specified
 *                 a random location with the playfield will be selected.
 * @param pWidth {Number} The width of the playfield in pixels
 * @param pHeight {Number} The height of the playfield in pixels
 */
Spaceroids.Rock = Object2D.extend({

   size: 10,

   speed: 0.3,

   pBox: null,

   scoreValue: 10,

   constructor: function(size, position, pWidth, pHeight) {
      this.base("Spaceroid");

      // Add components to move and draw the asteroid
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));
      this.add(new ColliderComponent("collider", Spaceroids.collisionModel));

      // Playfield bounding box for quick checks
      this.pBox = new Rectangle2D(0, 0, pWidth, pHeight);

      // Set size and position
      this.size = size || 10;
      this.scoreValue = Spaceroids.Rock.values[String(this.size)];
      if (!position)
      {
         // Set the position
         position = new Point2D( Math.floor(Math.random() * this.pBox.getDims().x),
                                 Math.floor(Math.random() * this.pBox.getDims().y));
      }
      this.setPosition(position);
   },

   /**
    * Destroy an asteroid, removing it from the list of objects
    * in the last collision model node.
    */
   destroy: function() {
      this.ModelData.lastNode.removeObject(this);
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
      c_mover.setPosition(Spaceroids.wrap(c_mover.getPosition(), this.getBoundingBox()));

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

      // Debug the quad node
      if (this.ModelData && this.ModelData.lastNode)
      {
         renderContext.setLineStyle("blue");
         renderContext.drawRectangle(this.ModelData.lastNode.rect);
      }
   },

   /**
    * Returns the position of the rock
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
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
      var c_draw = this.getComponent("draw");

      // Pick one of the three shapes
      var tmp = [];
      tmp = Spaceroids.Rock.shapes[Math.floor(Math.random() * 3)];

      // Scale the shape
      var s = [];
      for (var p = 0; p < tmp.length; p++)
      {
         var pt = new Point2D(tmp[p][0], tmp[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      c_draw.setLineStyle("white");
      c_draw.setLineWidth(0.5);
   },

   /**
    * Set the velocity vector and angular velocity of an asteroid.
    */
   setMotion: function() {
      // Randomize the position and velocity
      var c_mover = this.getComponent("move");

      // Pick a random rotation and spin speed
      c_mover.setRotation( Math.floor(Math.random() * 360));
      c_mover.setAngularVelocity( Math.floor(Math.random() * 10) > 5 ? 0.5 : -0.5);


      var b = new Point2D(0,-1);
      var vec = Math2D.getDirectionVector(Point2D.ZERO, b, Math.floor(Math.random() * 360));

      vec.mul(0.3);

      c_mover.setVelocity(vec);
   },

   /**
    * Initialize an asteroid
    */
   setup: function() {

      this.setShape();
      this.setMotion();

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
      for (var x = 0; x < 8; x++)
      {
         Spaceroids.pEngine.addParticle(new SimpleParticle(this.getPosition()));
      }

      // Score some points
      Spaceroids.scorePoints(this.scoreValue);

      // Break the rock up into smaller chunks
      if (this.size - 4 > 1)
      {
         for (var p = 0; p < 3; p++)
         {
            var rock = new Spaceroids.Rock(this.size - 4, this.getPosition());
            this.getRenderContext().add(rock);
            rock.setup(this.pBox.getDims().x, this.pBox.getDims().y);
         }
      }

      this.destroy();
   },

   /**
    * Called when an asteroid collides with an object in the PCL.  If the
    * object is the player, calls the <tt>kill()</tt> method on the player
    * object.
    */
   onCollide: function(obj) {
      if (obj.getClassName() == "Player" &&
          (Math2D.boxBoxCollision(this.getWorldBox(), obj.getWorldBox())))
      {
         if (obj.isAlive())
         {
            obj.kill();
            this.kill();
            return ColliderComponent.STOP;
         }
      }

      return ColliderComponent.CONTINUE;
   },

   /**
    * Get the class name of this object
    *
    * @type String

    */
   getClassName: function() {
      return "Rock";
   }


}, { // Static Only

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
   values: { "10": 10, "6": 15, "2": 20 }

});


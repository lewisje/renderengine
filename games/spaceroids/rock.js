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

   destroy: function() {
      this.ModelData.lastNode.removeObject(this);
      this.base();
   },

   update: function(renderContext, time) {

      var c_mover = this.getComponent("move");
      c_mover.setPosition(Spaceroids.wrap(c_mover.getPosition(), this.getBoundingBox()));

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

      // Debug the quad node
      if (renderContext.getContextData(this) && renderContext.getContextData(this).lastNode)
      {
         renderContext.setLineStyle("blue");
         renderContext.drawRectangle(renderContext.getContextData(this).lastNode.rect);
      }
   },

   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("move").setRotation(angle);
   },

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
      c_draw.setLineStyle("silver");
      c_draw.setLineWidth(0.5);
   },

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

   setup: function() {

      this.setShape();
      this.setMotion();

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
    * The different asteroid vector lists
    */
   shapes: [[ [-4, -2], [-2, -3], [ 0, -5], [ 4, -4], [ 5,  0], [ 3,  4], [-2,  5], [-3,  2], [-5,  1] ],
            [ [-3, -3], [-1, -5], [ 3, -4], [ 2, -2], [ 5, -3], [ 5,  2], [ 1,  5], [-4,  5], [-3,  0] ],
            [ [-2, -3], [ 2, -5], [ 5, -1], [ 3,  2], [ 4,  4], [ 0,  5], [-3,  2] ]],

   /**
    * The value of each size, in points
    */
   values: { "10": 10, "6": 15, "2": 20 }

});


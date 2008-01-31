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

Spaceroids.Rock = HostObject.extend({

   size: 10,
   
   speed: 0.3,
   
   pBox: null,

   constructor: function() {
      this.base("Spaceroid");
      
      // Add components to move and draw the asteroid
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));
   },

   preUpdate: function(renderContext, time) {
      renderContext.pushTransform();   
   },

   postUpdate: function(renderContext, time) {
      renderContext.popTransform();
      var c_draw = this.getComponent("draw");
      var c_mover = this.getComponent("move");
      
      // Get XY radius and set new collision box
      var rX = Math.floor(c_draw.getBoundingBox().len_x() / 2);
      var rY = Math.floor(c_draw.getBoundingBox().len_y() / 2);
      var c = c_mover.getPosition();

      // Wrap if it's off the playing field
      var p = new Point2D(c);
      if (c.x < this.pBox.x || c.x > this.pBox.x + this.pBox.width ||
          c.y < this.pBox.y || c.y > this.pBox.y + this.pBox.height)
      {
         if (c.x > this.pBox.x + this.pBox.width + rX)
         {
            p.x = (this.pBox.x - (rX - 10));
         }
         if (c.y > this.pBox.y + this.pBox.height + rY)
         {
            p.y = (this.pBox.y - (rY - 10));
         }
         if (c.x < this.pBox.x - rX)
         {
            p.x = (this.pBox.x + this.pBox.width + (rX - 10));
         }
         if (c.y < this.pBox.y - rY)
         {
            p.y = (this.pBox.y + this.pBox.height + (rX - 10));
         }
         
         c_mover.setPosition(p);
      }
      
   },
    
   setup: function(pWidth, pHeight) {
      
      // Playfield bounding box for quick checks
      this.pBox = new Rectangle2D(0, 0, pWidth, pHeight);
      
      // Randomize the position and velocity
      var c_mover = this.getComponent("move");
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
      //c_draw.buildRenderList();
      c_draw.setLineStyle("silver");

      // Pick a random rotation and spin speed
      c_mover.setRotation( Math.floor(Math.random() * 360));
      c_mover.setAngularVelocity( Math.floor(Math.random() * 10) > 5 ? 0.5 : -0.5);

      // Set the position
      var pos = new Point2D( Math.floor(Math.random() * pWidth),
                             Math.floor(Math.random() * pHeight));
      c_mover.setPosition( pos );

      
      // Set a random motion vector
      var vec = new Vector2D( Math.floor(Math.random() * 10) > 5 ? this.speed : -this.speed,
                              Math.floor(Math.random() * 10) > 5 ? this.speed : -this.speed);
      c_mover.setVelocity(vec);
   }
   
}, { // Static Only

   /** 
    * The different asteroid vector lists
    */
   shapes: [[ [-4, -2], [-2, -3], [ 0, -5], [ 4, -4], [ 5,  0], [ 3,  4], [-2,  5], [-3,  2], [-5,  1] ],
            [ [-3, -3], [-1, -5], [ 3, -4], [ 2, -2], [ 5, -3], [ 5,  2], [ 1,  5], [-4,  5], [-3,  0] ],
            [ [-2, -3], [ 2, -5], [ 5, -1], [ 3,  2], [ 4,  4], [ 0,  5], [-3,  2] ]]
   
});


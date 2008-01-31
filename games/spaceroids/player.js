
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

Spaceroids.Player = HostObject.extend({

   size: 4,
   
   rotDir: 0,
   
   thrusting: false,

   constructor: function() {
      this.base("Player");
      
      // Add components to move and draw the asteroid
      this.add(new KeyboardInputComponent("input"));
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));
   },

   preUpdate: function(renderContext, time) {
      var c_mover = this.getComponent("move");
      c_mover.setRotation(c_mover.getRotation() + this.rotDir);

      if (this.thrusting)
      {
         var r = c_mover.getRotation();
         var tip = new Point2D(0, -1);
         var dir = Math2D.getDirectionVector(Point2D.ZERO, tip, r);
         c_mover.setVelocity(c_mover.getVelocity().add(dir.mul(0.25)));
      }
      
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
      var c_input = this.getComponent("input");

      // Pick one of the three shapes
      var shape = Spaceroids.Player.points;

      // Scale the shape
      var s = [];
      for (var p = 0; p < shape.length; p++)
      {
         var pt = new Point2D(shape[p][0], shape[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      //c_draw.buildRenderList();
      c_draw.setLineStyle("white");

      // Put us in the middle of the playfield
      c_mover.setPosition( this.pBox.getCenter() );
      
      c_input.addRecipient("keyDown", this, this.keyDown);
      c_input.addRecipient("keyUp", this, this.keyUp);
   },
   
   keyDown: function(event) {
      var c_mover = this.getComponent("move");
      switch (event.keyCode) {
         case EventEngine.KEYCODE_LEFT_ARROW:
            this.rotDir = -10;
            break;
         case EventEngine.KEYCODE_RIGHT_ARROW:
            this.rotDir = 10;
            break;
         case EventEngine.KEYCODE_UP_ARROW:
            this.thrusting = true;
            break;
      }
   },
   
   keyUp: function(event) {
      var c_mover = this.getComponent("move");
      switch (event.keyCode) {
         case EventEngine.KEYCODE_LEFT_ARROW:
         case EventEngine.KEYCODE_RIGHT_ARROW:
            this.rotDir = 0;
            break;
         case EventEngine.KEYCODE_UP_ARROW:
            this.thrusting = false;
            break;

      }
   }

}, { // Static

   /** The player shape
    * @private
    */
   points: [ [-2,  2], [0, -3], [ 2,  2], [ 0, 1] ],

   /** The player's thrust shape
    * @private
    */
   thrust: [ [-1,  2], [0,  3], [ 1,  2] ]

});
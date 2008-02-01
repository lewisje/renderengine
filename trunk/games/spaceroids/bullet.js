      if (this.bullets.length > 0)
      {
         for (var b in this.bullets) {
            this.bullets[b].convolve(this.bulletVelocity);
            renderContext.setLineStyle("white");
            renderContext.setLineWidth(2);
            renderContext.drawPoint(this.bullets[b]);
         }
      }



/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 * 
 * The player object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 42 $
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

Spaceroids.Bullet = HostObject.extend({

   constructor: function(player) {
      this.base("Bullet");
      
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
      
      c_mover.setPosition(Spaceroids.wrap(c_mover.getPosition(), c_draw.getBoundingBox());
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
   }

});
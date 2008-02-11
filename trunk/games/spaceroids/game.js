
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

// Load required engine components
Engine.load("/rendercontexts/context.canvascontext.js");
Engine.load("/platform/engine.spatialgrid.js");
Engine.load("/components/component.transform2d.js");
Engine.load("/components/component.mover2d.js");
Engine.load("/components/component.vector2d.js");
Engine.load("/components/component.collider.js");
Engine.load("/components/component.input.js");
Engine.load("/components/component.keyboardinput.js");

// Load game objects
Game.load("/rock.js");
Game.load("/player.js");
Game.load("/bullet.js");

var Spaceroids = Game.extend({

   constructor: null,

   renderContext: null,

   fieldBox: null,

   collisionModel: null,

   rocks: [],

   fieldWidth: 500,
   fieldHeight: 580,

   debug: true,

   cleanupPlayfield: function() {

      // Remove any rocks still floating around
      while (this.rocks.length > 0)
      {
         this.rocks.shift().destroy();
      }

   },

   attractMode: function() {

      this.cleanupPlayfield();

      var pWidth = this.fieldWidth;
      var pHeight = this.fieldHeight;

      // Add some asteroids
      for (var a = 0; a < 5; a++)
      {
         var rock = new Spaceroids.Rock(null, null, pWidth, pHeight);
         this.renderContext.add(rock);
         rock.setup();
      }

      var player = new Spaceroids.Player();
      this.renderContext.add(player);
      player.setup(pWidth, pHeight);

   },

   setup: function() {
      $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(24);
      // Create the 2D context
      this.fieldBox = new Rectangle2D(0, 0, this.fieldWidth, this.fieldHeight);
      this.renderContext = new CanvasContext(this.fieldWidth, this.fieldHeight);
      Engine.getDefaultContext().add(this.renderContext);
      this.renderContext.setBackgroundColor("black");

      // We'll need something to detect collisions
      this.collisionModel = new SpatialGrid(this.fieldWidth, this.fieldHeight, 7);

      this.attractMode();
   },

   teardown: function() {
      renderContext.destroy();
   },

   inField: function(pos, bBox) {
      var newPos = this.wrap(pos, bBox);
      return newPos.equals(pos);
   },

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

setTimeout("Spaceroids.setup();", 2000);



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

var Spaceroids = Game.extend({

   constructor: null,

   renderContext: null,
   
   setup: function() {
      // Create the 2D context
      renderContext = new CanvasContext(600, 580);
      Engine.getDefaultContext().add(renderContext);
      renderContext.setBackgroundColor("black");
      
      var pWidth = renderContext.getWidth();
      var pHeight = renderContext.getHeight();
      
      
      // Add some asteroids to it
      for (var a = 0; a < 6; a++)
      {
         var rock = new Spaceroids.Rock();
         renderContext.add(rock);
         rock.setup(pWidth, pHeight);
      }
   },
   
   teardown: function() {
      renderContext.destroy();
   }

});


